**Local launch verification — 12 November 2026 (Asia/Karachi)**

The source changes are local. No production deployment or production database modification was performed.

| Check | Result |
| --- | --- |
| Frontend TypeScript (`npm run typecheck`) | Passed |
| Frontend production build (`npm run build`) | Passed |
| API TypeScript/build (`npm run build --prefix server`) | Passed |
| Backend integration suite (`npm test --prefix server`) | 69 tests passed across 6 files |
| Production-build Chrome browser checks | 24 passed; no uncaught JavaScript errors |
| Production bundle checks | No provider credential, direct Groq request, or localhost API origin found |
| Deployment workflow | YAML parsed; deployment depends on verification |
| Docker/Nginx runtime | Configuration prepared; container execution not tested because Docker is unavailable here |

The browser checks used the actual production frontend build, a local same-origin API proxy, and an isolated MongoDB instance. Desktop viewport: 1366 × 900. Mobile Chrome emulation: 390 × 844. Reduced-motion mode was used for repeatable checks. Real-device frame rates and Safari/Firefox were not tested. Email and provider calls were mocked in integration tests; no real email delivery or paid model request was verified.

Verified browser flows:

- Homepage renders and shows exactly 10 case-study cards.
- Welcome panel closes automatically after 10 seconds.
- Welcome form submits to the real isolated API.
- Admin login and inbox show the submitted welcome inquiry.
- Admin homepage save is visible on the public website.
- Full case-studies page displays more than the homepage limit.
- Admin application sorting renders without errors.
- Desktop route /services.
- Desktop route /about.
- Desktop route /stories.
- Desktop route /careers.
- Desktop route /blog.
- Desktop route /privacy-policy.
- Desktop route /terms-and-conditions.
- Desktop route /cookie-policy.
- Desktop route /refund-policy.
- Career form retains data after failure and submits after retry.
- Mobile layout /.
- Mobile layout /services.
- Mobile layout /case-studies.
- Mobile layout /careers.
- Mobile welcome form fits the viewport and closes.
- Mobile chat appears after welcome closes and uses the backend endpoint.
- Removing all published projects does not resurrect sample cards.

The recorded HTTP 401 before admin login and HTTP 503 during the simulated careers outage were expected test conditions. No unexpected local asset failures were recorded.

The fixes include authoritative empty CMS results after unpublishing, periodic public-content refresh, working admin application sorting, truthful application error handling, support for the advertised résumé size, metadata-only application lists, lighter globe rendering, mobile welcome/chat separation, and private backend chat credentials. The startup and route loaders share the same spinner styling.

Production work still requires the actual hosting/API origin and access to its configuration. Configure the production API/database, persistent uploads, domain/HTTPS and proxy paths; deploy/restart the API before the frontend when releasing both. Confirm a real submission and admin publishing on the production domain, then verify email delivery and provider chat with production credentials. Rotate the chat API key that was previously configured as public frontend data. See [DEPLOY.md](DEPLOY.md) for the concrete deployment configuration.
