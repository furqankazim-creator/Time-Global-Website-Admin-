import type {
  CmsProject,
  CmsPost,
  CmsService,
  CmsTestimonial,
  CmsJob,
  CmsTeamMember,
  CmsHome,
  CmsImage,
} from "@/lib/cms";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SERVICES
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_SERVICES: CmsService[] = [
  {
    _id: "svc-1",
    title: "Web Application Development",
    slug: "web-application-development",
    icon: "Code2",
    shortDescription:
      "Scalable, secure web apps built on React, Node.js and cloud-native architecture — from SPAs to full-stack platforms.",
    fullDescription:
      "<p>We build production-grade web applications designed for reliability, scale, and high-conversion user experiences. From complex SaaS dashboards and reactive single-page applications to high-throughput multi-tenant platforms, our engineering team ensures clean code, strict type safety, and seamless API integrations.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      alt: "Web Application Development",
    },
  },
  {
    _id: "svc-2",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    icon: "Smartphone",
    shortDescription:
      "Native and cross-platform apps with Swift, Kotlin and React Native. Clean UI, native performance, solid backends.",
    fullDescription:
      "<p>Mobile experiences that delight users and withstand heavy enterprise workloads. We specialize in React Native, Flutter, Swift, and Kotlin, building fluid animations, offline-first sync mechanisms, biometric authentication, and robust push notification infrastructure.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
      alt: "Mobile App Development",
    },
  },
  {
    _id: "svc-3",
    title: "Cloud & DevOps Consulting",
    slug: "cloud-devops-consulting",
    icon: "Cloud",
    shortDescription:
      "Migrate, scale and automate on AWS, GCP and Azure with CI/CD pipelines and infrastructure as code.",
    fullDescription:
      "<p>Eliminate bottlenecks and stabilize deployments. We design resilient cloud infrastructures using Terraform, Docker, Kubernetes, and automated CI/CD pipelines. Our FinOps audits consistently cut monthly infrastructure costs by 30-50% while boosting system uptime to 99.99%.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
      alt: "Cloud & DevOps Consulting",
    },
  },
  {
    _id: "svc-4",
    title: "AI & Computer Vision",
    slug: "ai-computer-vision",
    icon: "Cpu",
    shortDescription:
      "Custom models, LLM integration and computer-vision pipelines taken from prototype to production.",
    fullDescription:
      "<p>Harness the power of machine learning and large language models tailored to your business data. We build document extraction systems, smart search engines, recommendation algorithms, and real-time computer vision classifiers that run efficiently on both cloud GPUs and edge devices.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
      alt: "AI & Computer Vision",
    },
  },
  {
    _id: "svc-5",
    title: "Enterprise Automation",
    slug: "enterprise-automation",
    icon: "Workflow",
    shortDescription:
      "Streamline operations with workflow automation, system integration and BI dashboards that pay for themselves.",
    fullDescription:
      "<p>Replace manual data wrangling and disjointed tools with unified, automated workflows. We connect ERPs, CRMs, accounting systems, and warehouse logistics into synchronized pipelines with custom real-time telemetry dashboards.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      alt: "Enterprise Automation",
    },
  },
  {
    _id: "svc-6",
    title: "UI/UX & Product Design",
    slug: "uiux-product-design",
    icon: "Palette",
    shortDescription:
      "Research-led design systems and prototypes that turn complex products into interfaces people enjoy using.",
    fullDescription:
      "<p>Design that balances visual elegance with behavioral psychology. We conduct user research, craft scalable design systems in Figma, and build accessible, interactive prototypes that guide development teams with zero ambiguity.</p>",
    image: {
      url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
      alt: "UI/UX & Product Design",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROJECTS / CASE STUDIES
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_PROJECTS: (CmsProject & {
  problem: string;
  solution: string;
  result: string;
  liveUrl?: string;
  gallery: CmsImage[];
  clientLogo?: CmsImage | null;
})[] = [
  {
    _id: "proj-1",
    title: "Bonnet — EV Charging Platform",
    slug: "bonnet-ev-charging-platform",
    client: "Bonnet",
    category: "mobile",
    techStack: ["React Native", "Node.js", "PostgreSQL", "Stripe"],
    metrics: [
      { value: "3x", label: "User Growth" },
      { value: "45%", label: "Fewer Failures" },
      { value: "40+", label: "Networks" },
    ],
    problem:
      "<p>Fragmented charging networks made it painful for electric vehicle drivers to find, access, and pay for charging across competing providers. Drivers were forced to download 10+ different apps and manage multiple separate balances just to commute reliably.</p>",
    solution:
      "<p>We engineered a unified mobile application aggregating 40+ independent EV networks behind a single payment wallet and roaming API. The app features real-time charger status monitoring, automated tariff comparison, and seamless in-app session initiation with background billing.</p>",
    result:
      "<p>Scaled to over 3x user growth within the first 12 months, reduced failed charging sessions by 45%, and secured Bonnet as one of Europe's top-rated EV utility platforms.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
      alt: "Bonnet EV Charging Platform",
    },
    liveUrl: "https://joinbonnet.com",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        alt: "Charger map & real-time telemetry",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        alt: "Wallet management & invoicing",
      },
    ],
  },
  {
    _id: "proj-2",
    title: "CANet — Clinical Research Portal",
    slug: "canet-clinical-research-portal",
    client: "CANet",
    category: "web",
    techStack: ["Next.js", "Python", "AWS", "FHIR"],
    metrics: [
      { value: "60%", label: "Less Data Prep" },
      { value: "12", label: "Hospitals" },
      { value: "HIPAA", label: "Compliant" },
    ],
    problem:
      "<p>Cardiac research data was scattered across disparate spreadsheets, outdated legacy databases, and paper charts with no central audit trail, slowing vital medical research and risking compliance violations.</p>",
    solution:
      "<p>Architected a HIPAA-compliant clinical research portal centralizing electronic health records using the HL7 FHIR standard. Implemented role-based access control, encrypted patient anonymization pipelines, and real-time trial cohort filtering.</p>",
    result:
      "<p>Cut manual data preparation time by 60% across 12 participating hospitals, accelerated clinical trial recruitment by 4 months, and achieved 100% compliance audit clearance.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
      alt: "CANet Clinical Research Portal",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
        alt: "Patient cohort analytics dashboard",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        alt: "Audit trail and clinical metrics",
      },
    ],
  },
  {
    _id: "proj-3",
    title: "Helvar — IoT Lighting Dashboard",
    slug: "helvar-iot-lighting-dashboard",
    client: "Helvar",
    category: "custom-software",
    techStack: ["React", "Go", "TimescaleDB", "MQTT"],
    metrics: [
      { value: "3,000+", label: "Devices" },
      { value: "20%", label: "Energy Saved" },
      { value: "Real-time", label: "Telemetry" },
    ],
    problem:
      "<p>Commercial facilities lacked a unified view across thousands of IoT lighting sensors, ballasts, and motion detectors. Energy waste went undetected and maintenance teams could only react after components broke down.</p>",
    solution:
      "<p>Engineered a high-concurrency IoT monitoring suite powered by Go and MQTT brokers feeding into TimescaleDB. Built a React dashboard with 60fps floorplan heatmaps and predictive ballast life monitoring.</p>",
    result:
      "<p>Achieved documented 20% commercial energy savings across client facilities and reduced technician dispatch trips by 35% through proactive automated fault alerts.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
      alt: "Helvar IoT Lighting Dashboard",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        alt: "Sensor heatmap and floor plan view",
      },
    ],
  },
  {
    _id: "proj-4",
    title: "TipTop — B2B Marketplace",
    slug: "tiptop-b2b-marketplace",
    client: "TipTop",
    category: "ecommerce",
    techStack: ["Next.js", "NestJS", "MongoDB", "Elasticsearch"],
    metrics: [
      { value: "200k", label: "Daily Txns" },
      { value: "0", label: "Downtime" },
      { value: "40x", label: "Scale Growth" },
    ],
    problem:
      "<p>Manual quoting and phone-based negotiating created a 4-day lag on wholesale trade orders, capping merchant growth and causing constant pricing discrepancies.</p>",
    solution:
      "<p>Developed a self-service B2B marketplace featuring instant volume-tiered quoting, automated credit term escrow, Elasticsearch-backed faceted catalog search, and real-time inventory reservation.</p>",
    result:
      "<p>Scaled smoothly from 5k to 200k daily transactions with zero unplanned downtime during peak holiday trading windows.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      alt: "TipTop B2B Marketplace",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
        alt: "B2B catalog and bulk ordering cart",
      },
    ],
  },
  {
    _id: "proj-5",
    title: "SpecTec — Fleet Maintenance Suite",
    slug: "spectec-fleet-maintenance-suite",
    client: "SpecTec",
    category: "web",
    techStack: ["Angular", "Java", "Oracle"],
    metrics: [
      { value: "Ahead", label: "Of Schedule" },
      { value: "Modular", label: "Architecture" },
      { value: "Predictive", label: "Maintenance" },
    ],
    problem:
      "<p>Maritime fleet managers relied on legacy on-premise software that couldn't sync reliable maintenance records to ships operating in low-bandwidth satellite conditions.</p>",
    solution:
      "<p>Modernized the fleet asset suite into a modular web application with offline-first local synchronization, predictive engine part replacement schedules, and automated regulatory compliance reporting.</p>",
    result:
      "<p>Delivered 3 weeks ahead of schedule, enabling over 450 commercial vessels to transition to cloud-synchronized logbooks seamlessly.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      alt: "SpecTec Fleet Maintenance Suite",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
        alt: "Vessel maintenance schedule & engine telemetry",
      },
    ],
  },
  {
    _id: "proj-6",
    title: "FinPay — Cross-Border Payments App",
    slug: "finpay-cross-border-payments-app",
    client: "FinPay",
    category: "mobile",
    techStack: ["Flutter", "NestJS", "PostgreSQL", "Plaid"],
    metrics: [
      { value: "1.2M", label: "Transfers/mo" },
      { value: "60%", label: "Cheaper FX" },
      { value: "9", label: "Countries" },
    ],
    problem:
      "<p>Migrant workers were losing 6–8% of every remittance transfer home to legacy hidden bank fees and multi-day clearing delays.</p>",
    solution:
      "<p>Engineered a high-performance cross-border payment app with real-time FX price locking, biometric KYC verification under 90 seconds, and instant local settlement across 9 international corridors.</p>",
    result:
      "<p>Processed over 1.2M monthly transfers with a 4.9 App Store rating and saved families over $14M in unnecessary banking fees.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
      alt: "FinPay Cross-Border Payments App",
    },
    liveUrl: "https://finpay.app",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
        alt: "Live exchange rates and transfer confirmation",
      },
    ],
  },
  {
    _id: "proj-7",
    title: "Renlo — Property Management Platform",
    slug: "renlo-property-management-platform",
    client: "Renlo",
    category: "web",
    techStack: ["React", "Django", "PostgreSQL", "Stripe Connect"],
    metrics: [
      { value: "8,500+", label: "Units Managed" },
      { value: "70%", label: "Less Paperwork" },
      { value: "4.7★", label: "Tenant Rating" },
    ],
    problem:
      "<p>Property managers juggled fragmented spreadsheets, emails, and paper checks to manage rent collection and contractor maintenance requests.</p>",
    solution:
      "<p>Delivered an all-in-one portal consolidating digital lease signing, automated ACH rent collection, vendor dispatch ticketing, and real-time financial reporting for landlords.</p>",
    result:
      "<p>Now powers 8,500+ residential units across North America, cutting administrative overhead by 70% and boosting on-time rent payments to 98%.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200",
      alt: "Renlo Property Management Platform",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200",
        alt: "Tenant portal and maintenance ticketing",
      },
    ],
  },
  {
    _id: "proj-8",
    title: "RouteWise — Delivery Route Optimizer",
    slug: "routewise-delivery-route-optimizer",
    client: "RouteWise",
    category: "custom-software",
    techStack: ["Python", "OR-Tools", "Kafka", "PostGIS"],
    metrics: [
      { value: "31%", label: "Fewer Miles" },
      { value: "18%", label: "Fuel Saved" },
      { value: "Real-time", label: "Re-routing" },
    ],
    problem:
      "<p>Last-mile couriers were running static, manually planned routes that ignored sudden traffic jams, order cancellations, and time-window deadlines.</p>",
    solution:
      "<p>Designed a constraint-solving vehicle routing engine using Google OR-Tools and Kafka event streams. The system continually optimizes multi-stop routes dynamically as new orders and driver locations arrive.</p>",
    result:
      "<p>Fleet operators achieved an immediate 31% reduction in cumulative miles driven and 18% fuel spend savings in Q1 alone.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
      alt: "RouteWise Delivery Route Optimizer",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
        alt: "Driver route visualization and GPS tracking",
      },
    ],
  },
  {
    _id: "proj-9",
    title: "UrbanCart — Same-Day Grocery Marketplace",
    slug: "urbancart-same-day-grocery-marketplace",
    client: "UrbanCart",
    category: "ecommerce",
    techStack: ["Next.js", "Node.js", "Redis", "Mapbox"],
    metrics: [
      { value: "45 min", label: "Avg Delivery" },
      { value: "3.2x", label: "Order Growth" },
      { value: "99.9%", label: "Order Accuracy" },
    ],
    problem:
      "<p>UrbanCart's initial storefront struggled with inventory sync latency across 40 dark stores, causing frequent out-of-stock items and customer complaints.</p>",
    solution:
      "<p>Built a lightning-fast Next.js marketplace backed by Redis pub/sub for sub-second inventory sync, paired with automated dark-store picker routing and live courier delivery tracking.</p>",
    result:
      "<p>Slashed average delivery time to 45 minutes, increased order volume by 3.2x, and maintained a 99.9% inventory fulfillment accuracy.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
      alt: "UrbanCart Same-Day Grocery Marketplace",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
        alt: "Storefront catalog and express checkout",
      },
    ],
  },
  {
    _id: "proj-10",
    title: "EduSpark — Cohort-Based Learning Platform",
    slug: "eduspark-cohort-based-learning-platform",
    client: "EduSpark",
    category: "web",
    techStack: ["Next.js", "Ruby on Rails", "PostgreSQL", "Mux"],
    metrics: [
      { value: "40k+", label: "Learners" },
      { value: "92%", label: "Completion Rate" },
      { value: "35", label: "Countries" },
    ],
    problem:
      "<p>Instructors ran cohort courses across disorganized video links and spreadsheets, which limited class capacity and caused an 80% student drop-off rate.</p>",
    solution:
      "<p>Engineered an interactive cohort learning platform with live video classroom integration, automated peer code reviews, calendar sync, and interactive milestone trackers.</p>",
    result:
      "<p>Enrolled over 40,000 students across 35 countries with an unprecedented 92% course completion rate.</p>",
    coverImage: {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
      alt: "EduSpark Cohort-Based Learning Platform",
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
        alt: "Interactive code exercise and classroom stream",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. BLOG POSTS
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_POSTS: (CmsPost & { content: string })[] = [
  {
    _id: "post-1",
    title: "Scaling to 10M Users Without Breaking the Bank",
    slug: "scaling-to-10m-users-without-breaking-the-bank",
    excerpt:
      "How we architected a serverless system that handles massive scale with minimal operational overhead — and the trade-offs we made along the way.",
    content:
      "<h2>The challenge</h2><p>Growth is a great problem until the bill arrives. When one of our fintech clients went from 40k to 2M monthly users in a single quarter, their cloud infrastructure spend was projected to surge 30x while gross revenue grew 8x.</p><h2>What we changed</h2><p>We shifted high-concurrency read paths to edge serverless functions with aggressive CDN caching, utilized spot instances for non-latency-sensitive batch tasks, and optimized Postgres indexing. The result: total infrastructure costs grew only 2.1x while serving 20x the traffic volume.</p><h2>The trade-offs</h2><p>Cold starts are a real consideration. We kept latency-critical payment paths on provisioned concurrency while tolerating slight delays on administrative dashboards nobody notices. Solid engineering is always about deliberate trade-offs.</p>",
    readingTime: 8,
    publishedAt: "2024-03-15T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      alt: "Scaling to 10M Users Without Breaking the Bank",
    },
    category: { name: "Architecture", slug: "architecture" },
    tags: [
      { name: "Serverless", slug: "serverless" },
      { name: "DevOps", slug: "devops" },
    ],
    author: { name: "Alex Chen" },
  },
  {
    _id: "post-2",
    title: "The AI Hype Cycle vs. Real Business Impact",
    slug: "the-ai-hype-cycle-vs-real-business-impact",
    excerpt:
      "Cutting through the noise: which AI investments actually move the needle for businesses, and which are expensive distractions.",
    content:
      "<h2>Signal over noise</h2><p>Not every enterprise workflow needs an LLM. The organizations extracting genuine, measurable returns from AI share one fundamental habit: they anchor their initiatives in a quantifiable operational bottleneck rather than chasing shiny technology.</p><h2>Where it pays off today</h2><p>Document triage, unstructured data extraction, automated customer support resolution, and predictive inventory forecasting reliably yield compounding dividends. A 30% reduction in manual data processing often pays for implementation within 90 days.</p><h2>Where it burns capital</h2><p>Generic chatbots bolted onto apps without domain knowledge, and sweeping 'AI transformation' agendas lacking measurable KPIs. Always identify the exact metric you expect to improve before allocating capital.</p>",
    readingTime: 6,
    publishedAt: "2024-03-08T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
      alt: "The AI Hype Cycle vs. Real Business Impact",
    },
    category: { name: "Strategy", slug: "strategy" },
    tags: [
      { name: "Artificial Intelligence", slug: "ai" },
      { name: "Product", slug: "product" },
    ],
    author: { name: "Daniel Weber" },
  },
  {
    _id: "post-3",
    title: "Zero-Downtime Migrations at Scale",
    slug: "zero-downtime-migrations-at-scale",
    excerpt:
      "A practical playbook for migrating production databases with no maintenance window and no lost writes.",
    content:
      "<h2>The four-step playbook</h2><p>Dual writes, historical backfill, checksum verification, and graceful cutover. Every zero-downtime migration we execute adheres strictly to these phases — and the true discipline lies in the rigorous verification phase.</p><h2>Dual writes first</h2><p>Start writing to both stores behind a feature flag before any application reads from the new system. Bugs discovered during this phase are completely safe and reversible.</p><h2>Verify with checksums</h2><p>Row count checks are insufficient. We execute sliding-window hash diffing and replay shadow production queries against both databases before transferring production readers.</p>",
    readingTime: 10,
    publishedAt: "2024-02-28T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
      alt: "Zero-Downtime Migrations at Scale",
    },
    category: { name: "DevOps", slug: "devops" },
    tags: [
      { name: "Databases", slug: "databases" },
      { name: "Migration", slug: "migration" },
    ],
    author: { name: "Marcus Rivera" },
  },
  {
    _id: "post-4",
    title: "Why Your ERP Rollout Failed (and the Second One Won't)",
    slug: "why-your-erp-rollout-failed",
    excerpt:
      "Most ERP failures aren't technology failures — they're adoption failures. Here's what a decade of implementations taught us.",
    content:
      "<h2>The uncomfortable truth</h2><p>The system worked technically; people just refused to adopt it. In over 80% of legacy ERP rescues we've conducted, the software itself functioned as specified. The true roadblock was steep learning curves and fragmented workflows.</p><h2>What successful rollouts do</h2><p>They migrate one department at a time, keep legacy systems in read-only mode during transition, and embed power users on the implementation team from day one.</p>",
    readingTime: 7,
    publishedAt: "2024-02-15T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      alt: "Why Your ERP Rollout Failed",
    },
    category: { name: "Enterprise", slug: "enterprise" },
    tags: [
      { name: "ERP", slug: "erp" },
      { name: "Automation", slug: "automation" },
    ],
    author: { name: "Priya Sharma" },
  },
  {
    _id: "post-5",
    title: "Flutter vs React Native in 2026: What We Tell Clients",
    slug: "flutter-vs-react-native-in-2026",
    excerpt:
      "We ship both. The honest answer to 'which framework?' depends on three questions about your team and your roadmap.",
    content:
      "<h2>The three questions</h2><p>Who maintains the codebase after launch? What languages does your engineering team excel in? How bespoke is your UI design?</p><h2>When Flutter shines</h2><p>Graphics-heavy mobile apps requiring pixel-identical rendering on iOS and Android alike. Flutter's canvas engine makes complex animations affordable.</p><h2>When React Native wins</h2><p>Teams already proficient in TypeScript who maintain a parallel React web application. Reusing business logic and design tokens across web and mobile is unmatched.</p>",
    readingTime: 9,
    publishedAt: "2024-01-28T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
      alt: "Flutter vs React Native in 2026",
    },
    category: { name: "Mobile", slug: "mobile" },
    tags: [
      { name: "React Native", slug: "react-native" },
      { name: "Flutter", slug: "flutter" },
    ],
    author: { name: "HasnainHadi" },
  },
  {
    _id: "post-6",
    title: "The Hidden Cost of Off-the-Shelf Software",
    slug: "the-hidden-cost-of-off-the-shelf-software",
    excerpt:
      "Licenses look cheap next to custom builds — until you count the workarounds, the exports, and the processes you bent to fit the tool.",
    content:
      "<h2>The spreadsheet shadow system</h2><p>Every generic SaaS tool eventually spawns a shadow ecosystem of spreadsheets to bridge feature gaps. That unversioned spreadsheet is where your actual core process is stuck.</p><h2>When bespoke software wins</h2><p>When the workflow directly drives your core competitive advantage. Nobody should build custom email, but the proprietary engine that sets your business apart deserves dedicated software designed specifically for it.</p>",
    readingTime: 5,
    publishedAt: "2024-01-12T00:00:00.000Z",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
      alt: "The Hidden Cost of Off-the-Shelf Software",
    },
    category: { name: "Strategy", slug: "strategy" },
    tags: [
      { name: "Software Development", slug: "custom-dev" },
      { name: "Architecture", slug: "architecture" },
    ],
    author: { name: "Alex Chen" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_TESTIMONIALS: CmsTestimonial[] = [
  {
    _id: "test-1",
    clientName: "Patrick Reich",
    company: "Bonnet",
    position: "Co-Founder & CEO",
    quote:
      "The expectations for quality were very high and the developers were qualified enough to deliver the vision. Communication stayed transparent throughout the whole engagement.",
    rating: 5,
    caseStudyUrl: "/work/bonnet-ev-charging-platform",
    photo: null,
    companyLogo: null,
  },
  {
    _id: "test-2",
    clientName: "Dimitri Popolov",
    company: "CANet",
    position: "Research Data Manager",
    quote:
      "We had a tight deadline and they found another developer overnight to keep us on track. When the partner is this good, things just quietly get done.",
    rating: 5,
    caseStudyUrl: "/work/canet-clinical-research-portal",
    photo: null,
    companyLogo: null,
  },
  {
    _id: "test-3",
    clientName: "Matti Vesterinen",
    company: "Helvar",
    position: "Solution Development Manager",
    quote:
      "Quality has been consistently good and on the level we expected. Great visibility, clear communication, and a reliable partner for extra engineering resources.",
    rating: 5,
    caseStudyUrl: "/work/helvar-iot-lighting-dashboard",
    photo: null,
    companyLogo: null,
  },
  {
    _id: "test-4",
    clientName: "Tim Rosenberger",
    company: "SpecTec",
    position: "Director, Global R&D",
    quote:
      "Impressed by the skillset and the flexibility to ramp up quickly. They scaled the team on short notice without any drop in delivery quality.",
    rating: 5,
    caseStudyUrl: "/work/spectec-fleet-maintenance-suite",
    photo: null,
    companyLogo: null,
  },
  {
    _id: "test-5",
    clientName: "Nadine Walther",
    company: "SpexAI",
    position: "Co-Founder & CEO",
    quote:
      "The team is dependable with time and budget, consistently staying within the agreed scope while still pushing the product forward every sprint.",
    rating: 5,
    caseStudyUrl: "/work",
    photo: null,
    companyLogo: null,
  },
  {
    _id: "test-6",
    clientName: "Sebastian Belle",
    company: "Lawpilots",
    position: "VP of Engineering",
    quote:
      "They deliver on time and on budget, and proactively ask how they can support our roadmap rather than waiting to be told what to build next.",
    rating: 5,
    caseStudyUrl: "/work",
    photo: null,
    companyLogo: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. CAREER JOBS
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_JOBS: CmsJob[] = [
  {
    _id: "job-1",
    title: "Senior Full-Stack Engineer",
    slug: "senior-full-stack-engineer",
    department: "development",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>You'll own features end-to-end across our client engagements — React/Next.js on the front, Node.js or Python on the back, deployed to real production traffic within your first sprint.</p><h2>What we're looking for</h2><ul><li>5+ years shipping production web applications</li><li>Comfortable owning a feature from database schema to deployed UI</li><li>Clear written communication — most of our teams are async and remote-first</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
  {
    _id: "job-2",
    title: "AI / ML Specialist",
    slug: "ai-ml-specialist",
    department: "development",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>Take client ML work from notebook to production — model serving, evaluation pipelines, and the data plumbing that makes a model actually useful.</p><h2>What we're looking for</h2><ul><li>Hands-on experience shipping an ML or LLM feature to real users</li><li>Comfortable with Python, PyTorch, and basic MLOps</li><li>Can explain model trade-offs clearly to non-technical stakeholders</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
  {
    _id: "job-3",
    title: "Lead UI/UX Designer",
    slug: "lead-uiux-designer",
    department: "design",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>Lead design across multiple client engagements — research, wireframes, high-fidelity UI and the handoff that keeps engineering from guessing.</p><h2>What we're looking for</h2><ul><li>A portfolio showing shipped product work, not just concepts</li><li>Fluent in modern design systems (Figma + component tokens)</li><li>Comfortable running client design critique sessions</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
  {
    _id: "job-4",
    title: "Cloud Architect (AWS/GCP)",
    slug: "cloud-architect",
    department: "development",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>Design the infrastructure behind client platforms handling real production load — migrations, cost optimization, and CI/CD pipelines.</p><h2>What we're looking for</h2><ul><li>Production experience on AWS or GCP at meaningful scale</li><li>Infrastructure-as-code fluency (Terraform or equivalent)</li><li>Track record of cutting cloud spend without breaking reliability</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
  {
    _id: "job-5",
    title: "Product Manager",
    slug: "product-manager",
    department: "management",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>Sit between client stakeholders and engineering, turning business goals into a shipped roadmap with clear milestones.</p><h2>What we're looking for</h2><ul><li>3+ years managing product for an agency or tech startup</li><li>Strong discovery and customer interview skills</li><li>Bias toward shipping real iterative value</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
  {
    _id: "job-6",
    title: "Technical Sales Lead",
    slug: "technical-sales-lead",
    department: "marketing",
    type: "full-time",
    location: "Remote",
    description:
      "<h2>About the role</h2><p>Own new client relationships from first call to signed statement of work — speaking credibly about architecture, timelines and trade-offs.</p><h2>What we're looking for</h2><ul><li>Background in solutions engineering or technical sales</li><li>Can scope projects realistically alongside engineering leads</li><li>Clear quota track record in software services</li></ul>",
    applyEmail: "careers@timeglobaltech.com",
    closesAt: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. TEAM MEMBERS
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_TEAM: CmsTeamMember[] = [
  {
    _id: "team-1",
    name: "Alex Chen",
    role: "Principal Architect",
    department: "development",
    bio: "I've spent 15 years designing distributed systems, and this is the first place where deep work is genuinely protected. We solve scaling problems that matter without burning people out.",
    photo: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      alt: "Alex Chen",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-2",
    name: "Sarah Okonkwo",
    role: "Head of Design",
    department: "design",
    bio: "Design here isn't decoration — every decision is backed by research and data, and I have the technical freedom to push for truly pixel-perfect interfaces.",
    photo: {
      url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300",
      alt: "Sarah Okonkwo",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-3",
    name: "Marcus Rivera",
    role: "Engineering Lead",
    department: "development",
    bio: "Scaling global infrastructure needs a certain mindset. I'm empowered to automate everything and build resilient systems serving clients across four continents.",
    photo: {
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
      alt: "Marcus Rivera",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-4",
    name: "Priya Sharma",
    role: "Product Manager",
    department: "management",
    bio: "Continuous learning isn't a perk here, it's the DNA. The mentorship I've had took me from mid-level to leading product on our biggest accounts.",
    photo: {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      alt: "Priya Sharma",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-5",
    name: "Daniel Weber",
    role: "AI Research Lead",
    department: "development",
    bio: "We take models from paper to production. Shipping applied ML that clients actually use, with a team that reviews the maths as carefully as the code.",
    photo: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      alt: "Daniel Weber",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-6",
    name: "Lena Fischer",
    role: "Growth Marketing Lead",
    department: "marketing",
    bio: "Marketing with engineers who ship fast means every experiment I design is live within days — data-driven growth is real here, not a slide deck.",
    photo: {
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      alt: "Lena Fischer",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-7",
    name: "Zahoor Jamali",
    role: "Full-Stack Developer",
    department: "development",
    bio: "Every sprint here teaches me something new — pairing with senior engineers on real client systems accelerated my growth faster than any course could.",
    photo: {
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      alt: "Zahoor Jamali",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
  {
    _id: "team-8",
    name: "HasnainHadi",
    role: "Frontend Developer",
    department: "development",
    bio: "Shipping polished interfaces for clients across four continents, with code reviews that genuinely make you better every single week.",
    photo: {
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
      alt: "HasnainHadi",
    },
    socials: { linkedin: "#", twitter: "#", github: "#", website: "#" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. HOME HERO & SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_HOME: CmsHome = {
  hero: {
    headline: "We Architect, Engineer & Ship Software That Scales",
    subheadline:
      "Enterprise web applications, native mobile apps, and intelligent cloud systems delivered by elite engineering squads.",
    ctaText: "Start a Project",
    ctaUrl: "/contact",
    backgroundMedia: null,
  },
  featuredServices: STATIC_SERVICES.slice(0, 4).map((s) => ({
    _id: s._id,
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription,
    icon: s.icon,
  })),
  featuredProjects: STATIC_PROJECTS.slice(0, 4).map((p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    client: p.client,
    category: p.category,
  })),
  featuredTestimonials: STATIC_TESTIMONIALS.slice(0, 3).map((t) => ({
    _id: t._id,
    clientName: t.clientName,
    company: t.company,
    position: t.position,
    quote: t.quote,
    rating: t.rating,
  })),
  stats: [
    { label: "Projects Delivered", value: "200", suffix: "+" },
    { label: "Global Clients", value: "40", suffix: "+" },
    { label: "Client Retention", value: "98", suffix: "%" },
    { label: "Years Delivering", value: "12", suffix: "+" },
  ],
};
