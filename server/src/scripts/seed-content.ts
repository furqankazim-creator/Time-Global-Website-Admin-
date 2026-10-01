import { connectDb, disconnectDb } from "../config/db.js";
import { logger } from "../lib/logger.js";
import { slugify } from "../lib/slug.js";
import { HomePage } from "../models/HomePage.js";
import { Job } from "../models/Job.js";
import { Media } from "../models/Media.js";
import { Category, Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { Service } from "../models/Service.js";
import { TeamMember } from "../models/TeamMember.js";
import { Testimonial } from "../models/Testimonial.js";
import { User } from "../models/User.js";

/**
 * Realistic demo content for every public surface. Idempotent: re-running
 * replaces the demo rows rather than piling up duplicates, so it's safe to run
 * against a database that already has some.
 *
 *   npm run seed:content            # add demo content
 *   npm run seed:content -- --reset # wipe those collections first
 */

const withSlug = <T extends { title?: string; name?: string }>(rows: T[]) =>
  rows.map((r) => ({ ...r, slug: slugify((r.title ?? r.name)!) }));

const SERVICES = withSlug([
  { title: "Web Application Development", icon: "Code2", shortDescription: "Scalable, secure web apps built on React, Node.js and cloud-native architecture — from SPAs to full-stack platforms.", order: 1, featured: true, status: "published" },
  { title: "Mobile App Development", icon: "Smartphone", shortDescription: "Native and cross-platform apps with Swift, Kotlin and React Native. Clean UI, native performance, solid backends.", order: 2, featured: true, status: "published" },
  { title: "Cloud & DevOps Consulting", icon: "Cloud", shortDescription: "Migrate, scale and automate on AWS, GCP and Azure with CI/CD pipelines and infrastructure as code.", order: 3, featured: true, status: "published" },
  { title: "AI & Computer Vision", icon: "Cpu", shortDescription: "Custom models, LLM integration and computer-vision pipelines taken from prototype to production.", order: 4, featured: true, status: "published" },
  { title: "Enterprise Automation", icon: "Workflow", shortDescription: "Streamline operations with workflow automation, system integration and BI dashboards that pay for themselves.", order: 5, status: "published" },
  { title: "UI/UX & Product Design", icon: "Palette", shortDescription: "Research-led design systems and prototypes that turn complex products into interfaces people enjoy using.", order: 6, status: "published" },
]);

const PROJECTS = withSlug([
  { imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200", title: "Bonnet — EV Charging Platform", metrics: [{ value: "3x", label: "User Growth" }, { value: "45%", label: "Fewer Failures" }, { value: "40+", label: "Networks" }], client: "Bonnet", category: "mobile", techStack: ["React Native", "Node.js", "PostgreSQL", "Stripe"], problem: "<p>Fragmented charging networks made it painful for drivers to find and pay for charging across providers.</p>", solution: "<p>A single app aggregating 40+ networks behind one wallet and roaming API.</p>", result: "<p>3x user growth in the first year and a 45% drop in failed charging sessions.</p>", featured: true, order: 1, status: "published", liveUrl: "https://joinbonnet.com" },
  { imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200", title: "CANet — Clinical Research Portal", metrics: [{ value: "60%", label: "Less Data Prep" }, { value: "12", label: "Hospitals" }, { value: "HIPAA", label: "Compliant" }], client: "CANet", category: "web", techStack: ["Next.js", "Python", "AWS", "FHIR"], problem: "<p>Research data was scattered across spreadsheets with no audit trail.</p>", solution: "<p>A HIPAA-compliant portal centralising patient data with role-based access and full audit logging.</p>", result: "<p>Cut data-prep time by 60% across 12 partner hospitals.</p>", featured: true, order: 2, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200", title: "Helvar — IoT Lighting Dashboard", metrics: [{ value: "3,000+", label: "Devices" }, { value: "20%", label: "Energy Saved" }, { value: "Real-time", label: "Telemetry" }], client: "Helvar", category: "custom-software", techStack: ["React", "Go", "TimescaleDB", "MQTT"], problem: "<p>No unified view across thousands of connected lighting sensors.</p>", solution: "<p>A real-time dashboard visualising telemetry from 3,000+ devices with offline support.</p>", result: "<p>20% energy savings identified across managed buildings.</p>", featured: true, order: 3, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", title: "TipTop — B2B Marketplace", metrics: [{ value: "200k", label: "Daily Txns" }, { value: "0", label: "Downtime" }, { value: "40x", label: "Scale Growth" }], client: "TipTop", category: "ecommerce", techStack: ["Next.js", "NestJS", "MongoDB", "Elasticsearch"], problem: "<p>Manual quoting slowed high-volume wholesale orders.</p>", solution: "<p>A self-serve marketplace with dynamic pricing, escrow and instant quoting.</p>", result: "<p>Scaled from 5k to 200k daily transactions with zero downtime.</p>", featured: true, order: 4, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", title: "SpecTec — Fleet Maintenance Suite", metrics: [{ value: "Ahead", label: "Of Schedule" }, { value: "Modular", label: "Architecture" }, { value: "Predictive", label: "Maintenance" }], client: "SpecTec", category: "web", techStack: ["Angular", "Java", "Oracle"], problem: "<p>Legacy maintenance software couldn't scale to a growing fleet.</p>", solution: "<p>A modular suite modernising asset tracking and predictive maintenance.</p>", result: "<p>Extended the delivery team on short notice and shipped ahead of schedule.</p>", order: 5, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200", title: "FinPay — Cross-Border Payments App", metrics: [{ value: "1.2M", label: "Transfers/mo" }, { value: "60%", label: "Cheaper FX" }, { value: "9", label: "Countries" }], client: "FinPay", category: "mobile", techStack: ["Flutter", "NestJS", "PostgreSQL", "Plaid"], problem: "<p>Migrant workers were losing 6–8% of every transfer home to legacy remittance fees and multi-day settlement times.</p>", solution: "<p>A mobile-first remittance app with real-time FX rates, biometric KYC and same-day settlement across 9 corridors.</p>", result: "<p>1.2M transfers a month at 60% lower FX cost than the incumbents it replaced.</p>", featured: true, order: 6, status: "published", liveUrl: "https://finpay.app" },
  { imageUrl: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200", title: "Renlo — Property Management Platform", metrics: [{ value: "8,500+", label: "Units Managed" }, { value: "70%", label: "Less Paperwork" }, { value: "4.7★", label: "Tenant Rating" }], client: "Renlo", category: "web", techStack: ["React", "Django", "PostgreSQL", "Stripe Connect"], problem: "<p>Property managers were juggling spreadsheets, email and three disconnected tools just to collect rent and log maintenance requests.</p>", solution: "<p>A single portal unifying leasing, rent collection, maintenance tickets and owner reporting, with a tenant-facing mobile web app.</p>", result: "<p>Now manages 8,500+ units with 70% less manual paperwork and a 4.7★ average tenant rating.</p>", order: 7, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200", title: "RouteWise — Delivery Route Optimizer", metrics: [{ value: "31%", label: "Fewer Miles" }, { value: "18%", label: "Fuel Saved" }, { value: "Real-time", label: "Re-routing" }], client: "RouteWise", category: "custom-software", techStack: ["Python", "OR-Tools", "Kafka", "PostGIS"], problem: "<p>Manual dispatching left delivery drivers running inefficient routes, burning fuel and missing delivery windows during peak season.</p>", solution: "<p>A constraint-solver route engine that re-optimizes every driver's route in real time as new orders and traffic data arrive.</p>", result: "<p>31% fewer miles driven and an 18% drop in fuel spend across the fleet in the first quarter.</p>", order: 8, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200", title: "UrbanCart — Same-Day Grocery Marketplace", metrics: [{ value: "45 min", label: "Avg Delivery" }, { value: "3.2x", label: "Order Growth" }, { value: "99.9%", label: "Order Accuracy" }], client: "UrbanCart", category: "ecommerce", techStack: ["Next.js", "Node.js", "Redis", "Mapbox"], problem: "<p>The client's existing storefront couldn't handle live inventory sync across 40 dark stores, causing constant out-of-stock cancellations.</p>", solution: "<p>A real-time inventory and dispatch layer feeding a fast storefront, with live rider tracking and dynamic slot pricing.</p>", result: "<p>Average delivery time down to 45 minutes with 3.2x order growth and 99.9% order accuracy.</p>", featured: true, order: 9, status: "published" },
  { imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200", title: "EduSpark — Cohort-Based Learning Platform", metrics: [{ value: "40k+", label: "Learners" }, { value: "92%", label: "Completion Rate" }, { value: "35", label: "Countries" }], client: "EduSpark", category: "web", techStack: ["Next.js", "Ruby on Rails", "PostgreSQL", "Mux"], problem: "<p>Cohort-based courses were being run manually over spreadsheets and video calls, capping how many students the client could take on per cohort.</p>", solution: "<p>A learning platform with live cohort scheduling, peer review workflows and video-first lessons that scales past a single instructor's calendar.</p>", result: "<p>40k+ learners across 35 countries with a 92% course completion rate — well above the industry norm for online courses.</p>", order: 10, status: "published" },
]);

const TESTIMONIALS = [
  { clientName: "Patrick Reich", company: "Bonnet", position: "Co-Founder & CEO", quote: "The expectations for quality were very high and the developers were qualified enough to deliver the vision. Communication stayed transparent throughout the whole engagement.", rating: 5, featured: true, order: 1, approvalStatus: "approved" },
  { clientName: "Dimitri Popolov", company: "CANet", position: "Research Data Manager", quote: "We had a tight deadline and they found another developer overnight to keep us on track. When the partner is this good, things just quietly get done.", rating: 5, featured: true, order: 2, approvalStatus: "approved" },
  { clientName: "Matti Vesterinen", company: "Helvar", position: "Solution Development Manager", quote: "Quality has been consistently good and on the level we expected. Great visibility, clear communication, and a reliable partner for extra engineering resources.", rating: 5, order: 3, approvalStatus: "approved" },
  { clientName: "Tim Rosenberger", company: "SpecTec", position: "Director, Global R&D", quote: "Impressed by the skillset and the flexibility to ramp up quickly. They scaled the team on short notice without any drop in delivery quality.", rating: 5, order: 4, approvalStatus: "approved" },
  { clientName: "Nadine Walther", company: "SpexAI", position: "Co-Founder & CEO", quote: "The team is dependable with time and budget, consistently staying within the agreed scope while still pushing the product forward every sprint.", rating: 5, order: 5, approvalStatus: "approved" },
  { clientName: "Sebastian Belle", company: "Lawpilots", position: "VP of Engineering", quote: "They deliver on time and on budget, and proactively ask how they can support our roadmap rather than waiting to be told what to build next.", rating: 5, order: 6, approvalStatus: "approved" },
];

// No withSlug — TeamMember has no slug field, and strict mode rejects it.
// Bios read as first-person quotes: the Careers "Life at Time Global"
// marquee renders them as testimonial-style cards.
const TEAM = [
  { name: "Alex Chen", role: "Principal Architect", department: "development", order: 1, status: "published",
    bio: "<p>I've spent 15 years designing distributed systems, and this is the first place where deep work is genuinely protected. We solve scaling problems that matter without burning people out.</p>",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
  { name: "Sarah Okonkwo", role: "Head of Design", department: "design", order: 2, status: "published",
    bio: "<p>Design here isn't decoration — every decision is backed by research and data, and I have the technical freedom to push for truly pixel-perfect interfaces.</p>",
    photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200" },
  { name: "Marcus Rivera", role: "Engineering Lead", department: "development", order: 3, status: "published",
    bio: "<p>Scaling global infrastructure needs a certain mindset. I'm empowered to automate everything and build resilient systems serving clients across four continents.</p>",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
  { name: "Priya Sharma", role: "Product Manager", department: "management", order: 4, status: "published",
    bio: "<p>Continuous learning isn't a perk here, it's the DNA. The mentorship I've had took me from mid-level to leading product on our biggest accounts.</p>",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" },
  { name: "Daniel Weber", role: "AI Research Lead", department: "development", order: 5, status: "published",
    bio: "<p>We take models from paper to production. Shipping applied ML that clients actually use, with a team that reviews the maths as carefully as the code.</p>",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { name: "Lena Fischer", role: "Growth Marketing Lead", department: "marketing", order: 6, status: "published",
    bio: "<p>Marketing with engineers who ship fast means every experiment I design is live within days — data-driven growth is real here, not a slide deck.</p>",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
  // Match the exact names created in the admin panel, so the upsert-by-name
  // fills those rows in rather than creating duplicates.
  { name: "Zahoor Jamali", role: "Full-Stack Developer", department: "development", order: 7, status: "published",
    bio: "<p>Every sprint here teaches me something new — pairing with senior engineers on real client systems accelerated my growth faster than any course could.</p>",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
  { name: "HasnainHadi", role: "Frontend Developer", department: "development", order: 8, status: "published",
    bio: "<p>Shipping polished interfaces for clients across four continents, with code reviews that genuinely make you better every single week.</p>",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
];

const POSTS = withSlug([
  { title: "Scaling to 10M Users Without Breaking the Bank",
    excerpt: "How we architected a serverless system that handles massive scale with minimal operational overhead — and the trade-offs we made along the way.",
    content: "<h2>The challenge</h2><p>Growth is a great problem until the bill arrives. When one of our fintech clients went from 40k to 2M monthly users in a quarter, their cloud spend was on track to grow 30x while revenue grew 8x.</p><h2>What we changed</h2><p>We moved the hot path to serverless functions with aggressive caching at the edge, kept the long-running workers on spot instances, and pushed everything static to a CDN. The result: infrastructure costs grew 2.1x while traffic grew 20x.</p><h2>The trade-offs</h2><p>Cold starts are real. We kept latency-critical endpoints on provisioned concurrency and accepted slower p99s on admin routes nobody notices. Engineering is choosing which problems you can live with.</p>",
    status: "published", readingTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" },
  { title: "The AI Hype Cycle vs. Real Business Impact",
    excerpt: "Cutting through the noise: which AI investments actually move the needle for businesses, and which are expensive distractions.",
    content: "<h2>Signal over noise</h2><p>Not every workflow needs an LLM. The clients getting real returns from AI share one trait: they started from a measured business problem, not from the technology.</p><h2>Where it pays off today</h2><p>Document extraction, support triage, code assistance and demand forecasting are quietly compounding wins. A 30% reduction in manual document handling pays for itself in a quarter.</p><h2>Where it burns money</h2><p>Chatbots bolted onto products nobody asked for, and \"AI strategies\" with no evaluation metric. If you can't say what number should move, you're not ready to spend.</p>",
    status: "published", readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" },
  { title: "Zero-Downtime Migrations at Scale",
    excerpt: "A practical playbook for migrating production databases with no maintenance window and no lost writes.",
    content: "<h2>The playbook</h2><p>Dual writes, backfill, verify, cut over. Every zero-downtime migration we've shipped follows the same four movements — the discipline is in the verification step everyone wants to skip.</p><h2>Dual writes first</h2><p>Write to both stores behind a flag before anything reads from the new one. Bugs here are recoverable; bugs after cutover are incidents.</p><h2>Verify like you mean it</h2><p>Row counts are not verification. We diff checksums over sliding windows and replay a day of production reads against both stores before flipping a single reader.</p>",
    status: "published", readingTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200" },
  { title: "Why Your ERP Rollout Failed (and the Second One Won't)",
    excerpt: "Most ERP failures aren't technology failures — they're adoption failures. Here's what a decade of implementations taught us.",
    content: "<h2>The uncomfortable truth</h2><p>The system worked. People didn't use it. Of the failed rollouts we've been called in to rescue, four out of five had nothing wrong with the software.</p><h2>What the successful ones do</h2><p>They migrate one workflow at a time, keep the old system readable (never writable) during transition, and put a power user from each department on the project team from day one.</p>",
    status: "published", readingTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" },
  { title: "Flutter vs React Native in 2026: What We Tell Clients",
    excerpt: "We ship both. The honest answer to \"which framework?\" depends on three questions about your team and your roadmap.",
    content: "<h2>The three questions</h2><p>Who maintains this in year two? What's already in your stack? How custom is your UI?</p><h2>When we recommend Flutter</h2><p>Design-heavy consumer apps with custom UI on both platforms — Flutter's rendering model makes pixel-perfect consistency cheap.</p><h2>When we recommend React Native</h2><p>Teams that already live in TypeScript and ship a web app. Sharing logic, tooling and people across web and mobile is worth more than any framework benchmark.</p>",
    status: "published", readingTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200" },
  { title: "The Hidden Cost of Off-the-Shelf Software",
    excerpt: "Licenses look cheap next to custom builds — until you count the workarounds, the exports, and the processes you bent to fit the tool.",
    content: "<h2>The spreadsheet shadow system</h2><p>Every generic tool grows a shadow system of spreadsheets around it — that's where your actual process lives, unversioned and unauditable.</p><h2>When custom wins</h2><p>When the workflow IS the business. Nobody should custom-build email. But the process that differentiates you from competitors deserves software shaped exactly to it.</p>",
    status: "published", readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" },
]);

// Job departments/enum only has design/development/marketing/management —
// "Product" and "Sales" roles map onto the closest existing bucket rather
// than widening the enum for two rows.
const JOBS = withSlug([
  { title: "Senior Full-Stack Engineer", department: "development", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>You'll own features end-to-end across our client engagements — React/Next.js on the front, Node.js or Python on the back, deployed to real production traffic within your first sprint.</p><h2>What we're looking for</h2><ul><li>5+ years shipping production web applications</li><li>Comfortable owning a feature from database schema to deployed UI</li><li>Clear written communication — most of our teams are async and remote-first</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 1 },
  { title: "AI / ML Specialist", department: "development", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>Take client ML work from notebook to production — model serving, evaluation pipelines, and the unglamorous data plumbing that makes a model actually useful.</p><h2>What we're looking for</h2><ul><li>Hands-on experience shipping an ML or LLM feature to real users, not just research</li><li>Comfortable with Python, PyTorch or similar, and basic MLOps (versioning, monitoring, rollback)</li><li>Can explain a model's limitations to a non-technical client honestly</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 2 },
  { title: "Lead UI/UX Designer", department: "design", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>Lead design across multiple client engagements at once — research, wireframes, high-fidelity UI and the handoff that keeps engineering from guessing.</p><h2>What we're looking for</h2><ul><li>A portfolio showing shipped product work, not just concepts</li><li>Comfortable running client-facing research and design reviews solo</li><li>Fluent in a modern design system workflow (Figma + component libraries)</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 3 },
  { title: "Cloud Architect (AWS/GCP)", department: "development", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>Design the infrastructure behind client platforms handling real production load — migrations, cost optimization, and CI/CD pipelines that a five-person team can actually maintain.</p><h2>What we're looking for</h2><ul><li>Production experience on AWS or GCP at meaningful scale</li><li>Infrastructure-as-code fluency (Terraform or equivalent)</li><li>Track record of cutting cloud spend without breaking reliability</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 4 },
  { title: "Product Manager", department: "management", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>Sit between client stakeholders and the engineering team, turning ambiguous business goals into a shipped roadmap — and pushing back when a request doesn't serve the actual outcome.</p><h2>What we're looking for</h2><ul><li>3+ years managing product for a software team, agency or in-house</li><li>Comfortable running discovery directly with clients, not just internal stakeholders</li><li>Bias toward shipping something small and real over a large spec that never ships</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 5 },
  { title: "Technical Sales Lead", department: "marketing", type: "full-time", location: "Remote",
    description: "<h2>About the role</h2><p>Own new client relationships from first call to signed statement of work — you'll need to speak credibly about architecture, timelines and trade-offs, not just pricing.</p><h2>What we're looking for</h2><ul><li>Background in technical sales or solutions engineering for a dev agency or software vendor</li><li>Can scope a project realistically enough that delivery doesn't resent the deal you signed</li><li>Comfortable owning a pipeline and quota independently</li></ul>",
    applyEmail: "careers@timeglobaltech.com", status: "published", order: 6 },
]);

async function main() {
  const reset = process.argv.includes("--reset");
  await connectDb();

  // Attribute demo content to an existing admin, if there is one.
  const admin = await User.findOne({ role: "admin" }).select("_id");
  const by = admin?._id ?? null;

  if (reset) {
    await Promise.all([
      Service.deleteMany({}), Project.deleteMany({}), Testimonial.deleteMany({}),
      TeamMember.deleteMany({}), Post.deleteMany({}), Category.deleteMany({}), Job.deleteMany({}),
    ]);
    logger.info("cleared demo collections");
  }

  // Upsert on a natural key so re-running updates rather than duplicates.
  // `extra` carries per-model stamps (publishedAt only exists on some models).
  const upsert = (model: any, rows: any[], key = "slug", extra: object = {}) =>
    Promise.all(
      rows.map((r) =>
        model.findOneAndUpdate(
          { [key]: r[key] },
          { $set: { ...r, createdBy: by, updatedBy: by, ...extra } },
          { upsert: true, new: true }
        )
      )
    );

  const [cat] = await Promise.all([
    Category.findOneAndUpdate({ slug: "engineering" }, { $set: { name: "Engineering", slug: "engineering" } }, { upsert: true, new: true }),
  ]);

  const now = { publishedAt: new Date() };
  const services = await upsert(Service, SERVICES, "slug", now);
  // Covers registered as Media rows, same pattern as team photos — the
  // ref then behaves exactly like an admin upload.
  const projectsWithCovers = await Promise.all(
    PROJECTS.map(async ({ imageUrl, ...proj }: any) => {
      const media = await Media.findOneAndUpdate(
        { key: `external/projects/${proj.slug}` },
        {
          $set: {
            key: `external/projects/${proj.slug}`,
            url: imageUrl,
            filename: `${proj.slug}.jpg`,
            mimeType: "image/jpeg",
            size: 0,
            alt: proj.title,
            folder: "projects",
            uploadedBy: by,
          },
        },
        { upsert: true, new: true }
      );
      return { ...proj, coverImage: media!._id };
    })
  );
  const projects = await upsert(Project, projectsWithCovers, "slug", now);
  // Photos: register each Unsplash URL as a Media row so the member's
  // photo ref behaves exactly like an admin upload (url/alt via populate).
  const teamWithPhotos = await Promise.all(
    TEAM.map(async ({ photoUrl, ...member }) => {
      const media = await Media.findOneAndUpdate(
        { key: `external/team/${slugify(member.name)}` },
        {
          $set: {
            key: `external/team/${slugify(member.name)}`,
            url: photoUrl,
            filename: `${slugify(member.name)}.jpg`,
            mimeType: "image/jpeg",
            size: 0, // external asset — no local blob
            alt: `${member.name}, ${member.role}`,
            folder: "team",
            uploadedBy: by,
          },
        },
        { upsert: true, new: true }
      );
      return { ...member, photo: media!._id };
    })
  );
  await upsert(TeamMember, teamWithPhotos, "name"); // no slug, no publishedAt
  const postsWithImages = await Promise.all(
    POSTS.map(async ({ imageUrl, ...post }) => {
      const media = await Media.findOneAndUpdate(
        { key: `external/blog/${post.slug}` },
        {
          $set: {
            key: `external/blog/${post.slug}`,
            url: imageUrl,
            filename: `${post.slug}.jpg`,
            mimeType: "image/jpeg",
            size: 0, // external asset — no local blob
            alt: post.title,
            folder: "blog",
            uploadedBy: by,
          },
        },
        { upsert: true, new: true }
      );
      return { ...post, featuredImage: media!._id, category: cat!._id, author: by };
    })
  );
  await upsert(Post, postsWithImages, "slug", now);
  await upsert(Job, JOBS, "slug", now);

  // Testimonials have no slug — key on clientName+company.
  const testimonials = await Promise.all(
    TESTIMONIALS.map((t) =>
      Testimonial.findOneAndUpdate(
        { clientName: t.clientName, company: t.company },
        { $set: { ...t, createdBy: by, updatedBy: by } },
        { upsert: true, new: true }
      )
    )
  );

  // Feature a handful on the home page.
  await HomePage.findOneAndUpdate(
    { key: "home" },
    {
      $set: {
        featuredServices: services.slice(0, 4).map((s) => s!._id),
        featuredProjects: projects.slice(0, 4).map((p) => p!._id),
        featuredTestimonials: testimonials.slice(0, 4).map((t) => t!._id),
        updatedBy: by,
      },
      $setOnInsert: { key: "home" },
    },
    { upsert: true }
  );

  logger.info(
    `seeded: ${services.length} services, ${projects.length} projects, ` +
      `${testimonials.length} testimonials, ${TEAM.length} team, ${POSTS.length} posts, ${JOBS.length} jobs`
  );
}

main()
  .catch((err) => {
    logger.error({ err }, "content seed failed");
    process.exitCode = 1;
  })
  .finally(disconnectDb);
