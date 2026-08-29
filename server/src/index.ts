import { createApp } from "./app.js";
import { connectDb, disconnectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * `tsx watch` spawns the replacement process before the old one has released
 * the socket, so a save reliably raced into EADDRINUSE and crash-looped.
 * In dev we retry the bind briefly; in production a busy port is a genuine
 * misconfiguration and should fail loudly and immediately.
 */
async function listen(app: ReturnType<typeof createApp>, attempt = 1): Promise<import("node:http").Server> {
  const MAX_ATTEMPTS = env.isProd ? 1 : 12; // ~3s of grace in dev

  return new Promise((resolve, reject) => {
    const server = app.listen(env.PORT, () => {
      logger.info(`API listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
      resolve(server);
    });

    server.once("error", async (err: NodeJS.ErrnoException) => {
      if (err.code !== "EADDRINUSE") return reject(err);

      if (attempt < MAX_ATTEMPTS) {
        // Quiet for the first few — this is the normal watch-restart race.
        if (attempt === 4) logger.warn(`Port ${env.PORT} busy, waiting for the previous server to exit…`);
        await sleep(250);
        resolve(listen(app, attempt + 1));
        return;
      }

      reject(
        new Error(
          `Port ${env.PORT} is still in use after ${attempt} attempts.\n` +
            `  Find it:  ss -lptn 'sport = :${env.PORT}'\n` +
            `  Or set a different PORT in server/.env`
        )
      );
    });
  });
}

async function main() {
  await connectDb();

  const server = await listen(createApp());

  server.on("error", (err) => logger.error({ err }, "server error"));

  let shuttingDown = false;

  const shutdown = (signal: string) => async () => {
    // tsx watch can fire SIGTERM twice on a fast double-save; re-entering
    // would race two close() calls and log a confusing second shutdown.
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info(`${signal} received — shutting down`);

    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });

    /**
     * server.close() stops NEW connections but waits for existing keep-alive
     * sockets to drain — browsers and curl hold those open for seconds. On a
     * `tsx watch` restart the old process kept the port while the new one
     * booted, producing an EADDRINUSE crash loop on every file save.
     * Destroying idle sockets releases the port immediately.
     */
    server.closeAllConnections?.();

    // Hard backstop: never hang a restart on a stuck connection.
    setTimeout(() => {
      logger.warn("forced exit after shutdown timeout");
      process.exit(0);
    }, 3_000).unref();
  };

  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT", shutdown("SIGINT"));

  // Surface these instead of dying silently with no explanation.
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "unhandled promise rejection");
  });
}

main().catch((err) => {
  if ((err as NodeJS.ErrnoException)?.name === "MongooseServerSelectionError") {
    logger.error(
      `Cannot reach MongoDB at ${env.MONGODB_URI}\n` +
        `  Is mongod running?  pgrep mongod\n` +
        `  Start it:  mongod --dbpath server/.mongo-data --port 27017 --fork \\\n` +
        `               --logpath server/.mongo-data/mongod.log`
    );
  } else {
    logger.error({ err }, "failed to start");
  }
  process.exit(1);
});
