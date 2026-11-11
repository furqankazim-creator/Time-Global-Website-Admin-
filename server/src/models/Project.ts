import { Schema, model, type Model, type Types } from "mongoose";
import { STATUSES, seoSchema, type Status } from "./Service.js";

export const PROJECT_CATEGORIES = ["web", "mobile", "custom-software", "ecommerce"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface IProject {
  title: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  coverImage: Types.ObjectId | null;
  gallery: Types.ObjectId[];
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  /** Headline outcomes shown on the case-study card, e.g. 42% / Cost Reduction. */
  metrics: { value: string; label: string }[];
  clientLogo: Types.ObjectId | null;
  liveUrl: string;
  featured: boolean;
  order: number;
  status: Status;
  publishedAt: Date | null;
  seo: Record<string, unknown>;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject, Model<IProject>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    client: { type: String, default: "", trim: true, maxlength: 160 },
    category: { type: String, enum: PROJECT_CATEGORIES, default: "web", index: true },

    coverImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    gallery: [{ type: Schema.Types.ObjectId, ref: "Media" }],

    // Sanitized HTML (Problem → Solution → Result write-up)
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    result: { type: String, default: "" },

    techStack: [{ type: String, trim: true, maxlength: 40 }],
    metrics: [
      {
        _id: false,
        value: { type: String, required: true, trim: true, maxlength: 20 },
        label: { type: String, required: true, trim: true, maxlength: 40 },
      },
    ],
    clientLogo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    liveUrl: { type: String, default: "", trim: true },

    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: STATUSES, default: "published", index: true },
    publishedAt: { type: Date, default: null },
    seo: { type: seoSchema, default: () => ({}) },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

projectSchema.index({ title: "text", client: "text" });

export const Project = model<IProject>("Project", projectSchema);

export async function seedInitialProjects() {
  try {
    // Purge outdated dummy projects
    await Project.deleteMany({
      slug: {
        $in: [
          "bonnet-ev-charging-platform",
          "canet-clinical-research-portal",
          "helvar-iot-lighting-dashboard",
          "tiptop-b2b-marketplace",
          "spectec-fleet-maintenance-suite",
          "finpay-cross-border-payments-app",
          "renlo-property-management-platform",
          "routewise-delivery-route-optimizer",
          "urbancart-same-day-grocery-marketplace",
          "eduspark-cohort-based-learning-platform",
        ],
      },
    });

    const realProjects = [
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
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
        featured: true,
        status: 'published'
      },
      {
        title: "Alstom — RailOps Predictive Fleet Maintenance & Operations Portal",
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
        featured: true,
        status: 'published'
      },
      {
        title: "Barkat Org Foundation — Philanthropic Donor Portal & Impact CRM",
        slug: "barkat-foundation-donor-portal",
        client: "Barkat Org Foundation",
        category: "web",
        techStack: ["React", "Node.js", "Stripe Philanthropy API", "Donor CRM", "Transparency Ledger"],
        metrics: [{"value": "$2.4M+", "label": "Aid Deployed"}, {"value": "100%", "label": "Audit Transparency"}, {"value": "12k+", "label": "Beneficiaries Tracked"}],
        problem: "<p>A global philanthropic foundation providing education, clean water, and disaster relief lacked a synchronized donor management platform. Manual bank receipt processing delayed emergency aid disbursement and reduced recurring donor retention.</p>",
        solution: "<p>Engineered an end-to-end philanthropic web portal featuring automated recurring donor sponsorship pipelines, real-time humanitarian field telemetry, and an open transparency ledger tracking aid delivery down to individual beneficiary communities.</p>",
        result: "<p>Facilitated the transparent deployment of over $2.4M in humanitarian aid, grew recurring monthly sponsorships by 140%, and gave donors instant photo and GPS verification of sponsored community water wells and clinics.</p>",
        coverImage: {"url": "/assets/projects/Barkat_Org_Foundation_Final__Project_Case_Study_v2.pdf.jpg.jpeg", "alt": "Barkat Org Foundation Philanthropic Portal"},
        liveUrl: "https://barkatorg.org/",
        featured: true,
        status: 'published'
      },
      {
        title: "PCM Tool — Enterprise Product Cost Management & Portfolio Engine",
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
        featured: true,
        status: 'published'
      }
    ];

    for (const p of realProjects) {
      const exists = await Project.findOne({ slug: p.slug });
      if (!exists) {
        await Project.create(p);
      }
    }
  } catch {}
}
