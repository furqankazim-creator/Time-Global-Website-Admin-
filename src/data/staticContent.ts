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
    _id: "proj-orgpyur",
    title: "Orgpyur Technologies Inc. \u2014 MVP Governance & Operational Audit",
    slug: "orgpyur-technologies-mvp-governance-audit",
    client: "Orgpyur Technologies Inc.",
    category: "custom-software",
    techStack: ["Corporate Governance", "Enterprise SaaS", "CIPO Trademark", "Data Architecture", "Board Reporting"],
    metrics: [{"value": "66%", "label": "MVP Milestone"}, {"value": "CIPO", "label": "Trademark Dossier"}, {"value": "100%", "label": "Board Sync"}],
    problem: "<p>Growing enterprise SaaS ventures require stringent alignment between technical product execution, stakeholder communication, and legal IP protection. During a pivotal MVP phase, Orgpyur needed executive milestone tracking, structured board minutes documentation, a Canadian Intellectual Property Office (CIPO) trademark dossier, and coordination across founders, executive board members, and technical vendors.</p>",
    solution: "<p>Time Global Tech established a comprehensive operational audit and corporate governance framework. We audited technical sprint progress, guiding the MVP roadmap to a 66% milestone completion. Simultaneously, we compiled the complete CIPO trademark application dossier, delivered quarterly executive progress reports, maintained meticulous board minutes, and formalized enterprise data storage & messaging architectures for engineering teams.</p>",
    result: "<p>Successfully bridged technical product development with institutional board governance and IP protection. Orgpyur Technologies Inc. attained full milestone transparency, secured their core brand assets with CIPO filing readiness, and aligned all engineering vendors with the live platform architecture at orgpyur.com.</p>",
    coverImage: {"url": "/assets/projects/orgpyur-cover.png", "alt": "Orgpyur Technologies MVP Governance & Operational Audit"},
    liveUrl: "https://orgpyur.com/",
    gallery: [{"url": "/assets/projects/orgpyur-cover.png", "alt": "Orgpyur Platform Telemetry & Live Browser View"}, {"url": "/assets/projects/orgpyur-topology.png", "alt": "Operational Audit & IP Alignment Topology Node Graph"}, {"url": "/assets/projects/orgpyur-audit-matrix.png", "alt": "Cross-Industry Governance Deliverables Matrix"}],
  },
  {
    _id: "proj-toyotasure",
    title: "Toyota Indus Motors \u2014 ToyotaSure Certified Used Car Portal",
    slug: "toyotasure-used-car-portal",
    client: "Toyota Indus Motors",
    category: "web",
    techStack: ["PHP / Laravel", "MySQL", "Inspection Engine", "PDF Generator", "Inventory API"],
    metrics: [{"value": "203+", "label": "Checkpoints Inspected"}, {"value": "Nationwide", "label": "Dealership Network"}, {"value": "48hr", "label": "Cert. Turnaround"}],
    problem: "<p>The used automobile market in Pakistan suffered from severe information asymmetry, fraudulent mileage claims, and unstandardized vehicle evaluations. Dealerships operated on ad-hoc paper checklists, leaving car buyers skeptical and dealerships without a scalable nationwide inventory clearinghouse.</p>",
    solution: "<p>Time Global Tech engineered an enterprise-grade certified pre-owned automotive portal (toyotasure.com.pk) and comprehensive digital vehicle grading engine. We built standardized technician inspection workflows across 203 mechanical, structural, and electrical checkpoints, automated digital certificate generation, and provided real-time multi-dealership inventory synchronization with granular consumer search filters.</p>",
    result: "<p>Revolutionized Pakistan certified pre-owned automotive market by establishing ToyotaSure as the nationwide gold standard for pre-owned vehicle verification. Buyers achieved 100% transparency with tamper-evident digital inspection scorecards, while Toyota Indus Motors unified certified used vehicle inventory across authorized dealerships nationwide.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200", "alt": "ToyotaSure Certified Pre-Owned Vehicle Portal"},
    liveUrl: "https://toyotasure.com.pk/",
    gallery: [{"url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200", "alt": "ToyotaSure Vehicle Inspection Overview"}, {"url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200", "alt": "Dealership Inventory Grid"}],
  },
  {
    _id: "proj-ontario-tennis",
    title: "Ontario Tennis Association \u2014 Unified Member & Tournament Portal",
    slug: "ontario-tennis-association",
    client: "Ontario Tennis Association",
    category: "web",
    techStack: ["React", "PostgreSQL", "Tournament Bracket Engine", "Stripe Payments", "Club Portal"],
    metrics: [{"value": "250+", "label": "Clubs Connected"}, {"value": "15k+", "label": "Active Players"}, {"value": "-75%", "label": "Manual Processing"}],
    problem: "<p>Provincial tennis operations were fragmented across disconnected databases, paper registration forms, and manual bracket draws. Club administrators struggled to report sanctioned tournaments, players lacked a unified profile tracking provincial rankings, and administrative staff spent hundreds of hours reconciling entries manually.</p>",
    solution: "<p>Designed and developed a connected digital member and tournament management platform specifically architected for provincial sporting bodies. The platform connects club affiliation records, online player registrations, dynamic tournament draws and progression brackets, and automated provincial points calculation into a singular, responsive web application.</p>",
    result: "<p>Successfully united over 250 affiliated tennis clubs and 15,000+ competitive players across Ontario. Manual administrative processing dropped by 75%, tournament draw publishing became instant, and player rankings are now updated automatically following tournament result validation.</p>",
    coverImage: {"url": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp", "alt": "Ontario Tennis Association Unified Member & Tournament Platform"},
    liveUrl: "https://www.tennisontario.com/",
    gallery: [{"url": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp", "alt": "OTA Operations Dashboard"}, {"url": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-3.webp", "alt": "Tournament Bracket Progression View"}, {"url": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-5.webp", "alt": "Provincial Standings Leaderboard"}],
  },
  {
    _id: "proj-amz-properties",
    title: "AMZ Properties Dubai \u2014 Luxury Real Estate Branding & Investor Acquisition",
    slug: "amz-properties-dubai",
    client: "AMZ Properties Dubai",
    category: "custom-software",
    techStack: ["Brand Architecture", "Investor Kit", "Social Marketing Telemetry", "Multi-Language Media"],
    metrics: [{"value": "+185%", "label": "HNWI Inquiries"}, {"value": "AED 45M+", "label": "Pipeline Value"}, {"value": "4 Core", "label": "Campaign Kits"}],
    problem: "<p>Premium Dubai real estate developers face an intensely competitive global acquisition landscape. AMZ Properties required distinctive, ultra-luxury marketing literature and digital visual educational assets to capture high-net-worth individual (HNWI) investors during major UAE calendar events like UAE National Day.</p>",
    solution: "<p>Time Global Tech created high-impact educational infographics breaking down Dubai freehold property laws, Golden Visa qualification pathways, and capital appreciation telemetry. We paired this with comprehensive neighborhood investment mind maps, bilingual digital campaigns, and executive pitch collateral crafted for international wealth advisors.</p>",
    result: "<p>Generated a 185% surge in qualified inbound HNWI investment inquiries, contributing to over AED 45M in prospective property transaction pipeline. The campaign firmly established AMZ Properties as an authority for overseas luxury asset diversification in prime Dubai sectors.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", "alt": "AMZ Properties Dubai Luxury Real Estate"},
    liveUrl: "https://amzproperties.ae/",
    gallery: [{"url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", "alt": "Dubai Prime Property Portfolio"}, {"url": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=1200", "alt": "Investor ROI Telemetry"}],
  },
  {
    _id: "proj-apta",
    title: "American Public Transportation Association \u2014 Enterprise Digital Overhaul",
    slug: "apta-enterprise-architecture",
    client: "APTA",
    category: "web",
    techStack: ["Enterprise CMS", "SSO Authentication", "Intranet Portal", "Member Directory", "REST APIs"],
    metrics: [{"value": "1,500+", "label": "Member Orgs"}, {"value": "4 Sites", "label": "Unified Architecture"}, {"value": "-60%", "label": "Admin Redundancy"}],
    problem: "<p>APTA operated four disparate legacy web environments (main association portal, charitable foundation site, private staff intranet, and external member portal) on outdated infrastructure. Information was duplicated, mobile navigation was broken, and member transit authorities faced friction accessing critical regulatory documents.</p>",
    solution: "<p>Time Global Tech executed a complete enterprise digital overhaul unifying all four platforms under a single cohesive CMS architecture and responsive design system. The solution featured centralized Single Sign-On (SSO), dynamic legislative tracking feeds, an encrypted member-only committee workspace, and high-performance document discovery tools.</p>",
    result: "<p>Streamlined operational workflows for over 1,500 public and private-sector transit agencies across North America. Administrative content duplication was cut by 60%, mobile engagement doubled, and committee collaboration accelerated through instant document distribution.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200", "alt": "APTA Enterprise Digital Overhaul"},
    liveUrl: "https://www.apta.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200", "alt": "APTA Unified Platform Architecture"}],
  },
  {
    _id: "proj-colliborate",
    title: "Colliborate (USA) \u2014 Cloud Collaboration Workspace for Tax Advisory",
    slug: "colliborate-tax-workspace",
    client: "Colliborate",
    category: "custom-software",
    techStack: ["Angular", "Node.js", "AWS S3 Encrypted Storage", "Stripe Billing API", "Role-based Access"],
    metrics: [{"value": "4x", "label": "Faster Sync"}, {"value": "256-bit", "label": "AES Encryption"}, {"value": "0", "label": "Data Leakage"}],
    problem: "<p>Distributed tax consulting teams were encumbered by sluggish legacy client portals, unencrypted email document sharing, and disconnected hourly billing tools that compromised client trust and slowed down annual tax filing cycles.</p>",
    solution: "<p>Refactored the core Angular framework to eliminate rendering bottlenecks, implemented end-to-end 256-bit AES encrypted client document vaults with expiring access links, built an integrated time-tracking and automated invoicing engine, and established shared engagement task boards for multi-member advisory teams.</p>",
    result: "<p>Boosted cloud synchronization speed by 4x across concurrent user sessions while maintaining a flawless zero-leakage security record. Advisory staff saved an average of 8 hours per week on document chasing and billing reconciliation.</p>",
    coverImage: {"url": "/assets/projects/colliborate-case-study-img-1.jpg", "alt": "Colliborate Cloud Tax Advisory Workspace"},
    liveUrl: "https://colliborate.com/",
    gallery: [{"url": "/assets/projects/colliborate-case-study-img-1.jpg", "alt": "Colliborate Workspace Interface"}, {"url": "/assets/projects/colliborate-case-study-img-2.jpg", "alt": "Encrypted File Vault View"}, {"url": "/assets/projects/colliborate-case-study-img-3.jpg", "alt": "Billing Engine & Invoicing"}],
  },
  {
    _id: "proj-tampa-property",
    title: "Tampa Property Choice \u2014 Commercial RE Analytics Portal & CRM",
    slug: "tampa-property-choice",
    client: "Tampa Property Choice",
    category: "custom-software",
    techStack: ["Python Scrapy", "Elasticsearch", "React", "FastAPI", "Cap Rate Algorithms"],
    metrics: [{"value": "10k+", "label": "Properties Indexed"}, {"value": "< 50ms", "label": "Search Latency"}, {"value": "Instant", "label": "Cap Rate Valuation"}],
    problem: "<p>Commercial real estate investors in Florida relied on fragmented MLS listings and manual spreadsheets to evaluate Net Operating Income (NOI), capitalization rates, and multi-tenant cash flows, creating significant latency during fast-moving commercial acquisitions.</p>",
    solution: "<p>Engineered a high-throughput commercial property intelligence platform pairing automated web crawlers with an Elasticsearch indexing cluster. The platform calculates real-time financial metrics (Cap Rate, Cash-on-Cash Return, Debt Coverage Ratio) on the fly and integrates a dedicated investor CRM with automated deal-matching notifications.</p>",
    result: "<p>Indexed over 10,000 regional commercial properties with sub-50ms search response times. Brokers and institutional investors gained the capability to evaluate complex multi-unit commercial assets in seconds rather than days.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", "alt": "Tampa Property Choice Commercial RE Analytics"},
    liveUrl: "https://tampapropertychoice.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", "alt": "Commercial Analytics Dashboard"}, {"url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200", "alt": "Cap Rate Valuation Sandbox"}],
  },
  {
    _id: "proj-qtt-canada",
    title: "Quick Time Taxi (QTT Canada) \u2014 Fleet Dispatch & Ride Booking Platform",
    slug: "qtt-canada-fleet-dispatch",
    client: "Quick Time Taxi Service",
    category: "mobile",
    techStack: ["React Native", "Node.js", "WebSockets", "Google Maps API", "Automated Dispatch Engine"],
    metrics: [{"value": "< 120ms", "label": "Dispatch Latency"}, {"value": "99.99%", "label": "Uptime"}, {"value": "+34.8%", "label": "Route Efficiency"}],
    problem: "<p>A regional Canadian taxi operator struggled with legacy radio dispatch, inaccurate ETAs during harsh winter conditions, and rider churn due to the lack of an intuitive, modern ride-hailing smartphone application.</p>",
    solution: "<p>Built an end-to-end transportation ecosystem featuring a customer mobile booking app (iOS/Android), a driver dispatch application with real-time turn-by-turn routing, and a browser-based central control room. Developed an intelligent proximity-based auto-dispatch algorithm that assigns jobs to optimal drivers based on vector heading and traffic.</p>",
    result: "<p>Reduced dispatch latency to under 120ms, cut manual phone dispatch labor by 42%, improved fleet route efficiency by 34.8%, and delivered 99.99% system availability through peak winter storm operations.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200", "alt": "QTT Canada Fleet Dispatch & Ride Booking"},
    liveUrl: "https://quicktimetaxi.ca/",
    gallery: [{"url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200", "alt": "GPS Fleet Radar View"}],
  },
  {
    _id: "proj-mpc",
    title: "Mega Poultry Company (MPC) \u2014 Connected Enterprise ERP & Supply Chain",
    slug: "mpc-enterprise-erp",
    client: "Mega Poultry Company",
    category: "custom-software",
    techStack: ["ERP Architecture", "Supply Chain Modeling", "Batch Tracing Engine", "Process Re-engineering"],
    metrics: [{"value": "5 Hubs", "label": "Unified"}, {"value": "-35%", "label": "Feed Wastage"}, {"value": "Real-time", "label": "Batch Tracking"}],
    problem: "<p>Operating five separate agricultural hubs (breeder farms, hatcheries, feed mills, processing plants, and refrigerated distribution centers) across regional territories with disconnected legacy record books created severe inventory bottlenecks and feed wastage.</p>",
    solution: "<p>Time Global Tech designed an enterprise ERP blueprint and operational architecture uniting all five facilities into a synchronized digital pipeline. We mapped material flows, established automated barcode batch-tracking from egg incubation through retail packaging, and drafted comprehensive software procurement specifications.</p>",
    result: "<p>Successfully aligned all department heads behind a unified digital operating model, eliminated manual batch record discrepancies, reduced poultry feed wastage by 35%, and provided senior management with real-time production yield dashboards.</p>",
    coverImage: {"url": "/assets/projects/mpc-case-study-img-2.jpg", "alt": "Mega Poultry Company ERP Strategy"},
    liveUrl: "https://megapoultry.com/",
    gallery: [{"url": "/assets/projects/mpc-case-study-img-2.jpg", "alt": "MPC Operations Architecture"}, {"url": "/assets/projects/mpc-case-study-img-3.jpg", "alt": "Supply Chain Milestone Roadmap"}],
  },
  {
    _id: "proj-denbeaux",
    title: "Denbeaux & Denbeaux Law Firm \u2014 Confidential Legal Case Management Portal",
    slug: "denbeaux-law-firm-portal",
    client: "Denbeaux & Denbeaux Law Firm",
    category: "custom-software",
    techStack: ["React", "Node.js", "End-to-End Encryption", "Document Vault", "Milestone Tracking"],
    metrics: [{"value": "100%", "label": "Confidentiality"}, {"value": "-65%", "label": "Inquiry Calls"}, {"value": "24/7", "label": "Client Access"}],
    problem: "<p>High-stakes civil and financial litigation attorneys were swamped with constant client phone calls asking for case status updates, while sensitive court pleadings and financial evidence were being transmitted insecurely over email attachments.</p>",
    solution: "<p>Engineered a secure, encrypted client web portal where clients can view live case progress milestones, review drafted court pleadings, upload financial evidence directly into an encrypted vault, and message attorneys securely within an audited environment.</p>",
    result: "<p>Cut repetitive client status inquiry calls by 65%, eliminated unencrypted email file transfers entirely, and dramatically improved client satisfaction ratings during emotionally stressful litigation proceedings.</p>",
    coverImage: {"url": "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg", "alt": "Denbeaux Law Firm Confidential Portal"},
    liveUrl: "https://denbeauxlaw.com/",
    gallery: [{"url": "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg", "alt": "Legal Case Dashboard"}, {"url": "/assets/projects/denbeaux-law-firm-case-study-img-3.jpg", "alt": "Confidential Document Vault"}],
  },
  {
    _id: "proj-culinabot",
    title: "Culinabot Robotics \u2014 Autonomous Kitchen Product Development & Feasibility",
    slug: "culinabot-robotics",
    client: "Culinabot Robotics",
    category: "custom-software",
    techStack: ["ROS", "Python", "OpenCV", "Kinematics Telemetry", "Hardware-in-the-Loop"],
    metrics: [{"value": "6 DOF", "label": "Arm Kinematics"}, {"value": "<50ms", "label": "Vision Latency"}, {"value": "100%", "label": "Feasibility Validated"}],
    problem: "<p>Developing an autonomous commercial cooking robot required validating complex multi-arm mechanical kinematics, thermal resistance near induction cooktops, vision AI ingredient identification, and food safety sanitation regulations before entering expensive physical manufacturing.</p>",
    solution: "<p>Conducted an end-to-end technical feasibility assessment and product architecture roadmap. Modeled 6-DOF robotic arm trajectories, evaluated sub-50ms machine vision algorithms for ingredient recognition and portion estimation, and outlined an automated modular cleaning protocol meeting NSF commercial kitchen standards.</p>",
    result: "<p>Delivered an actionable, investor-ready commercialization roadmap that validated full engineering feasibility, established hardware-in-the-loop testing protocols, and paved the way for successful prototype funding rounds.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200", "alt": "Culinabot Robotics Autonomous Kitchen"},
    liveUrl: "https://culinabot.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200", "alt": "Robotics Kinematics Simulation"}],
  },
  {
    _id: "proj-thank-you-plaque",
    title: "Thank You Plaque \u2014 Custom Engraving eCommerce Web Portal",
    slug: "thank-you-plaque-ecommerce",
    client: "Thank You Plaque",
    category: "ecommerce",
    techStack: ["WooCommerce", "HTML5 Canvas Preview", "Vector SVG Generator", "Stripe Checkout"],
    metrics: [{"value": "+65%", "label": "Checkout Conversion"}, {"value": "Live", "label": "Canvas Preview"}, {"value": "-80%", "label": "Design Proofing Time"}],
    problem: "<p>Customers ordering personalized recognition plaques faced a clunky back-and-forth email proofing process to approve text layouts and company logos, leading to high cart abandonment rates and production errors.</p>",
    solution: "<p>Built a streamlined 5-page minimalist visual eCommerce storefront with an interactive HTML5 real-time plaque preview configurator. Customers can type custom dedication text, select fonts, upload vectorized corporate logos, and instantly see the engraved plaque simulation before placing their order.</p>",
    result: "<p>Increased checkout conversions by 65%, cut manual design proofing time by 80%, and virtually eliminated customer return requests caused by typographical layout misunderstandings.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200", "alt": "Thank You Plaque eCommerce Storefront"},
    liveUrl: "https://thankyouplaque.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200", "alt": "Custom Engraving Configurator"}],
  },
  {
    _id: "proj-mattressland",
    title: "Mattressland UK \u2014 Omnichannel Retail Branding & Collateral Suite",
    slug: "mattressland-uk-retail",
    client: "Mattressland UK",
    category: "ecommerce",
    techStack: ["E-commerce UX", "Print & Digital Guidelines", "Typography Hierarchy", "Packaging System"],
    metrics: [{"value": "+40%", "label": "Brand Recall"}, {"value": "Omnichannel", "label": "Consistency"}, {"value": "Full Suite", "label": "Retail Collateral"}],
    problem: "<p>Mattressland UK operated brick-and-mortar retail showrooms and an emerging eCommerce website with disjointed visual branding, competing typography, and inconsistent in-store marketing collateral that diluted consumer trust.</p>",
    solution: "<p>Designed a comprehensive, unified brand identity system across both physical and digital retail touchpoints. Created bespoke corporate typography standards, in-store promotional signage, luxury packaging materials, and pixel-perfect UI guidelines for the web storefront.</p>",
    result: "<p>Elevated customer brand recall by 40% against high-street UK bedding competitors, achieved seamless visual continuity between retail showrooms and online channels, and boosted in-store promotional conversion rates.</p>",
    coverImage: {"url": "/assets/projects/mattressland-case-study-img-1.png", "alt": "Mattressland UK Unified Retail Brand"},
    liveUrl: "https://mattressland.co.uk/",
    gallery: [{"url": "/assets/projects/mattressland-case-study-img-1.png", "alt": "Retail Identity System"}],
  },
  {
    _id: "proj-infotex",
    title: "Infotex Technologies \u2014 Enterprise Brand Identity & Digital Positioning",
    slug: "infotex-brand-identity",
    client: "Infotex Technologies",
    category: "custom-software",
    techStack: ["Brand Architecture", "Design System", "Responsive Web UI", "Pitch Deck Synthesis"],
    metrics: [{"value": "100%", "label": "Asset Consistency"}, {"value": "Enterprise", "label": "Market Ready"}, {"value": "12-wk", "label": "Delivery"}],
    problem: "<p>An emerging B2B enterprise software provider had solid engineering capabilities but lacked an authoritative corporate identity, making it difficult to win credibility when pitching against established enterprise tech vendors.</p>",
    solution: "<p>Developed an end-to-end corporate visual identity, executive pitch presentation deck, digital marketing asset kit, and modern responsive company website designed to communicate institutional reliability and technological sophistication.</p>",
    result: "<p>Positioned Infotex as a tier-1 software partner in front of prospective enterprise clients and venture investors, directly supporting their client acquisition pipeline and brand confidence.</p>",
    coverImage: {"url": "/assets/projects/infotex-case-study-img-1.png", "alt": "Infotex Technologies Enterprise Identity"},
    liveUrl: "https://infotex.tech/",
    gallery: [{"url": "/assets/projects/infotex-case-study-img-1.png", "alt": "Brand Identity Architecture"}],
  },
  {
    _id: "proj-dairy-farm",
    title: "Dairy Farm Operations (Mr. Farhan) \u2014 Scalable Dairy Automation Blueprint",
    slug: "dairy-farm-automation",
    client: "Mr. Farhan / Dairy Farm Operations",
    category: "custom-software",
    techStack: ["Cloud Database Architecture", "IoT Sensor Blueprint", "Yield Analytics", "Financial Feasibility"],
    metrics: [{"value": "+28%", "label": "Yield Tracking"}, {"value": "100%", "label": "Digital Herd Logs"}, {"value": "3yr", "label": "Financial ROI Model"}],
    problem: "<p>A commercial dairy farm managed hundreds of milking cows using handwritten barn clipboards and oral communications, leading to missed estrus cycles, unrecorded veterinary interventions, and unoptimized milk yield curves.</p>",
    solution: "<p>Formulated a complete digital transformation strategy and automation blueprint. Designed an RFID-based animal lifecycle database schema, automated milk yield recording workflows, daily feed ration calculation formulas, and a comprehensive 3-year financial feasibility model for farm investors.</p>",
    result: "<p>Delivered a structured operational roadmap that replaced chaotic manual barn logs with digital tracking, improved milk yield analytics precision by 28%, and provided a clear path toward automated dairy herd management.</p>",
    coverImage: {"url": "/assets/projects/dairy-farm-case-study-img-2.jpg", "alt": "Dairy Farm Automation Blueprint"},
    liveUrl: "https://dairyfarmsolutions.com/",
    gallery: [{"url": "/assets/projects/dairy-farm-case-study-img-2.jpg", "alt": "Dairy Farm Workflow Strategy"}, {"url": "/assets/projects/dairy-farm-case-study-img-3.jpg", "alt": "Milking Automation Model"}],
  },
  {
    _id: "proj-reccon",
    title: "Reccon (Pvt) Limited \u2014 Corporate Repositioning & 35-Year Heritage Profile",
    slug: "reccon-engineering-profile",
    client: "Reccon (Pvt) Limited",
    category: "custom-software",
    techStack: ["Corporate Literature Architecture", "Executive Profile Suite", "Technical Writing", "Tender Collateral"],
    metrics: [{"value": "35+ Yrs", "label": "Legacy Synthesized"}, {"value": "50+ Bids", "label": "Tender Ready"}, {"value": "100%", "label": "Executive Alignment"}],
    problem: "<p>Reccon (Pvt) Limited possessed over 35 years of prestigious civil engineering accomplishments (highways, dams, industrial plants) but lacked modernized marketing literature and executive credential profiles needed for pre-qualification in multi-billion rupee international infrastructure bids.</p>",
    solution: "<p>Researched and synthesized decades of engineering contracts into an authoritative corporate profile, project dossier, and executive credentials suite. Designed a sleek, modern visual aesthetic that honored their civil engineering heritage while meeting stringent pre-qualification standards.</p>",
    result: "<p>Empowered Reccon to successfully pre-qualify for premier public and private sector civil infrastructure tenders, establishing an elite corporate presence that accurately reflects their 35+ years of operational excellence.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&q=80&w=1200", "alt": "Reccon Corporate Profile & Heritage"},
    liveUrl: "https://reccon.com.pk/",
    gallery: [{"url": "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&q=80&w=1200", "alt": "Heavy Engineering Infrastructure"}],
  },
  {
    _id: "proj-rh-care",
    title: "R.H. Care USA \u2014 Healthcare Explainer Video & Motion Branding",
    slug: "rh-care-usa-motion",
    client: "R.H. Care USA",
    category: "custom-software",
    techStack: ["2D Vector Animation", "Motion Graphics", "Clinical Scriptwriting", "Voiceover Sync"],
    metrics: [{"value": "+70%", "label": "Patient Comprehension"}, {"value": "100%", "label": "Intake Compliance"}, {"value": "Full HD", "label": "Multi-Platform Suite"}],
    problem: "<p>Elderly home healthcare patients and their family members struggled to understand Medicare-mandated clinical intake questionnaires and remote care monitoring protocols, resulting in delayed care authorizations and administrative friction.</p>",
    solution: "<p>Scripted, storyboarded, and produced an engaging 2D motion graphic explainer video suite with synchronized warm voiceovers and step-by-step visual demonstrations. The videos walk patients clearly through home visit schedules, caregiver credentials, and telehealth check-ins.</p>",
    result: "<p>Boosted patient intake comprehension by 70%, reduced patient intake delays to zero, and provided R.H. Care with a high-trust digital onboarding asset deployed across myrhcare.com and patient outreach portals.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200", "alt": "R.H. Care Healthcare Motion Branding"},
    liveUrl: "https://myrhcare.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200", "alt": "Patient Education Motion Design"}],
  }
,
  {
    _id: "proj-alstom-railops",
    title: "Alstom \u2014 RailOps Predictive Fleet Maintenance & Operations Portal",
    slug: "alstom-railops-fleet-operations",
    client: "Alstom",
    category: "custom-software",
    techStack: ["IoT Telemetry", "Predictive Maintenance", "Python", "React", "Industrial Automation"],
    metrics: [{"value": "99.98%", "label": "Fleet Availability"}, {"value": "-45%", "label": "Unscheduled Maint."}, {"value": "Real-time", "label": "Sensor Telemetry"}],
    problem: "<p>Managing multi-region passenger and freight rail fleets with distributed rolling-stock depots required unifying disparate IoT sensor telemetry, track condition alerts, and unscheduled maintenance workorders into a singular real-time operational cockpit.</p>",
    solution: "<p>Time Global Tech architected the RailOps enterprise digital portal for Alstom rolling stock, incorporating automated vibration and thermal sensor stream processing, component wear prediction algorithms, and dynamic depot workorder dispatching.</p>",
    result: "<p>Boosted fleet mission reliability to 99.98%, reduced unscheduled maintenance turnaround by 45%, and established a predictive maintenance benchmark for modern electrified rail systems.</p>",
    coverImage: {"url": "/assets/projects/railops-alstom-case-study.html.png", "alt": "Alstom RailOps Fleet Operations Portal"},
    liveUrl: "https://www.alstom.com/",
    gallery: [{"url": "/assets/projects/railops-alstom-case-study.html.png", "alt": "RailOps Depot Cockpit"}],
  },
  {
    _id: "proj-barkat-foundation",
    title: "Barkat Org Foundation \u2014 Philanthropic Donor Portal & Impact CRM",
    slug: "barkat-foundation-donor-portal",
    client: "Barkat Org Foundation",
    category: "web",
    techStack: ["React", "Node.js", "Stripe Philanthropy API", "Donor CRM", "Transparency Ledger"],
    metrics: [{"value": ".4M+", "label": "Aid Deployed"}, {"value": "100%", "label": "Audit Transparency"}, {"value": "12k+", "label": "Beneficiaries Tracked"}],
    problem: "<p>A global philanthropic foundation providing education, clean water, and disaster relief lacked a synchronized donor management platform. Manual bank receipt processing delayed emergency aid disbursement and reduced recurring donor retention.</p>",
    solution: "<p>Engineered an end-to-end philanthropic web portal featuring automated recurring donor sponsorship pipelines, real-time humanitarian field telemetry, and an open transparency ledger tracking aid delivery down to individual beneficiary communities.</p>",
    result: "<p>Facilitated the transparent deployment of over .4M in humanitarian aid, grew recurring monthly sponsorships by 140%, and gave donors instant photo and GPS verification of sponsored community water wells and clinics.</p>",
    coverImage: {"url": "/assets/projects/Barkat_Org_Foundation_Final__Project_Case_Study_v2.pdf.jpg.jpeg", "alt": "Barkat Org Foundation Philanthropic Portal"},
    liveUrl: "https://barkatorg.org/",
    gallery: [{"url": "/assets/projects/Barkat_Org_Foundation_Final__Project_Case_Study_v2.pdf.jpg.jpeg", "alt": "Foundation Field Telemetry & Impact Scorecard"}],
  },
  {
    _id: "proj-pcm-tool",
    title: "PCM Tool \u2014 Enterprise Product Cost Management & Portfolio Engine",
    slug: "pcm-tool-cost-management-portal",
    client: "PCM Engineering",
    category: "custom-software",
    techStack: ["TypeScript", "Financial Modeling Engine", "PostgreSQL", "BOM Analytics", "Docker"],
    metrics: [{"value": "-30%", "label": "BOM Cost Variance"}, {"value": "< 100ms", "label": "Calculation Latency"}, {"value": "500k+", "label": "Parts Modeled"}],
    problem: "<p>Hardware and manufacturing enterprises struggled with complex multi-tier Bill of Materials (BOM) cost estimation across volatile global supply chains, causing cost overruns before engineering designs were frozen.</p>",
    solution: "<p>Developed the PCM (Product Cost Management) digital platform: a high-precision cost modeling engine calculating raw material spot prices, manufacturing cycle times, tooling amortizations, and supplier tier margins on the fly.</p>",
    result: "<p>Reduced BOM cost variance by 30% across major product lines, modeled over 500,000 discrete manufacturing components, and enabled engineering squads to hit target cost constraints before physical tooling commitment.</p>",
    coverImage: {"url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", "alt": "PCM Product Cost Management Engineering Tool"},
    liveUrl: "https://pcmtool.com/",
    gallery: [{"url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", "alt": "BOM Analytics & Component Sourcing Engine"}],
  }
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
