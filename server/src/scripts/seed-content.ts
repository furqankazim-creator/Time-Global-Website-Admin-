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
  {
    "imageUrl": "/assets/projects/orgpyur-cover.png",
    "title": "Orgpyur Technologies Inc. \u2014 MVP Governance & Operational Audit",
    "metrics": [
      {
        "value": "66%",
        "label": "MVP Milestone"
      },
      {
        "value": "CIPO",
        "label": "Trademark Dossier"
      },
      {
        "value": "100%",
        "label": "Board Sync"
      }
    ],
    "client": "Orgpyur Technologies Inc.",
    "category": "custom-software",
    "techStack": [
      "Corporate Governance",
      "Enterprise SaaS",
      "CIPO Trademark",
      "Data Architecture",
      "Board Reporting"
    ],
    "problem": "<p>Growing enterprise SaaS ventures require stringent alignment between technical product execution, stakeholder communication, and legal IP protection. During a pivotal MVP phase, Orgpyur needed executive milestone tracking, structured board minutes documentation, a Canadian Intellectual Property Office (CIPO) trademark dossier, and coordination across founders, executive board members, and technical vendors.</p>",
    "solution": "<p>Time Global Tech established a comprehensive operational audit and corporate governance framework. We audited technical sprint progress, guiding the MVP roadmap to a 66% milestone completion. Simultaneously, we compiled the complete CIPO trademark application dossier, delivered quarterly executive progress reports, maintained meticulous board minutes, and formalized enterprise data storage & messaging architectures for engineering teams.</p>",
    "result": "<p>Successfully bridged technical product development with institutional board governance and IP protection. Orgpyur Technologies Inc. attained full milestone transparency, secured their core brand assets with CIPO filing readiness, and aligned all engineering vendors with the live platform architecture at orgpyur.com.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://orgpyur.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    "title": "Toyota Indus Motors \u2014 ToyotaSure Certified Used Car Portal",
    "metrics": [
      {
        "value": "203+",
        "label": "Checkpoints Inspected"
      },
      {
        "value": "Nationwide",
        "label": "Dealership Network"
      },
      {
        "value": "48hr",
        "label": "Cert. Turnaround"
      }
    ],
    "client": "Toyota Indus Motors",
    "category": "web",
    "techStack": [
      "PHP / Laravel",
      "MySQL",
      "Inspection Engine",
      "PDF Generator",
      "Inventory API"
    ],
    "problem": "<p>The used automobile market in Pakistan suffered from severe information asymmetry, fraudulent mileage claims, and unstandardized vehicle evaluations. Dealerships operated on ad-hoc paper checklists, leaving car buyers skeptical and dealerships without a scalable nationwide inventory clearinghouse.</p>",
    "solution": "<p>Time Global Tech engineered an enterprise-grade certified pre-owned automotive portal (toyotasure.com.pk) and comprehensive digital vehicle grading engine. We built standardized technician inspection workflows across 203 mechanical, structural, and electrical checkpoints, automated digital certificate generation, and provided real-time multi-dealership inventory synchronization with granular consumer search filters.</p>",
    "result": "<p>Revolutionized Pakistan certified pre-owned automotive market by establishing ToyotaSure as the nationwide gold standard for pre-owned vehicle verification. Buyers achieved 100% transparency with tamper-evident digital inspection scorecards, while Toyota Indus Motors unified certified used vehicle inventory across authorized dealerships nationwide.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://toyotasure.com.pk/"
  },
  {
    "imageUrl": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
    "title": "Ontario Tennis Association \u2014 Unified Member & Tournament Portal",
    "metrics": [
      {
        "value": "250+",
        "label": "Clubs Connected"
      },
      {
        "value": "15k+",
        "label": "Active Players"
      },
      {
        "value": "-75%",
        "label": "Manual Processing"
      }
    ],
    "client": "Ontario Tennis Association",
    "category": "web",
    "techStack": [
      "React",
      "PostgreSQL",
      "Tournament Bracket Engine",
      "Stripe Payments",
      "Club Portal"
    ],
    "problem": "<p>Provincial tennis operations were fragmented across disconnected databases, paper registration forms, and manual bracket draws. Club administrators struggled to report sanctioned tournaments, players lacked a unified profile tracking provincial rankings, and administrative staff spent hundreds of hours reconciling entries manually.</p>",
    "solution": "<p>Designed and developed a connected digital member and tournament management platform specifically architected for provincial sporting bodies. The platform connects club affiliation records, online player registrations, dynamic tournament draws and progression brackets, and automated provincial points calculation into a singular, responsive web application.</p>",
    "result": "<p>Successfully united over 250 affiliated tennis clubs and 15,000+ competitive players across Ontario. Manual administrative processing dropped by 75%, tournament draw publishing became instant, and player rankings are now updated automatically following tournament result validation.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://www.tennisontario.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    "title": "AMZ Properties Dubai \u2014 Luxury Real Estate Branding & Investor Acquisition",
    "metrics": [
      {
        "value": "+185%",
        "label": "HNWI Inquiries"
      },
      {
        "value": "AED 45M+",
        "label": "Pipeline Value"
      },
      {
        "value": "4 Core",
        "label": "Campaign Kits"
      }
    ],
    "client": "AMZ Properties Dubai",
    "category": "custom-software",
    "techStack": [
      "Brand Architecture",
      "Investor Kit",
      "Social Marketing Telemetry",
      "Multi-Language Media"
    ],
    "problem": "<p>Premium Dubai real estate developers face an intensely competitive global acquisition landscape. AMZ Properties required distinctive, ultra-luxury marketing literature and digital visual educational assets to capture high-net-worth individual (HNWI) investors during major UAE calendar events like UAE National Day.</p>",
    "solution": "<p>Time Global Tech created high-impact educational infographics breaking down Dubai freehold property laws, Golden Visa qualification pathways, and capital appreciation telemetry. We paired this with comprehensive neighborhood investment mind maps, bilingual digital campaigns, and executive pitch collateral crafted for international wealth advisors.</p>",
    "result": "<p>Generated a 185% surge in qualified inbound HNWI investment inquiries, contributing to over AED 45M in prospective property transaction pipeline. The campaign firmly established AMZ Properties as an authority for overseas luxury asset diversification in prime Dubai sectors.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://amzproperties.ae/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200",
    "title": "American Public Transportation Association \u2014 Enterprise Digital Overhaul",
    "metrics": [
      {
        "value": "1,500+",
        "label": "Member Orgs"
      },
      {
        "value": "4 Sites",
        "label": "Unified Architecture"
      },
      {
        "value": "-60%",
        "label": "Admin Redundancy"
      }
    ],
    "client": "APTA",
    "category": "web",
    "techStack": [
      "Enterprise CMS",
      "SSO Authentication",
      "Intranet Portal",
      "Member Directory",
      "REST APIs"
    ],
    "problem": "<p>APTA operated four disparate legacy web environments (main association portal, charitable foundation site, private staff intranet, and external member portal) on outdated infrastructure. Information was duplicated, mobile navigation was broken, and member transit authorities faced friction accessing critical regulatory documents.</p>",
    "solution": "<p>Time Global Tech executed a complete enterprise digital overhaul unifying all four platforms under a single cohesive CMS architecture and responsive design system. The solution featured centralized Single Sign-On (SSO), dynamic legislative tracking feeds, an encrypted member-only committee workspace, and high-performance document discovery tools.</p>",
    "result": "<p>Streamlined operational workflows for over 1,500 public and private-sector transit agencies across North America. Administrative content duplication was cut by 60%, mobile engagement doubled, and committee collaboration accelerated through instant document distribution.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://www.apta.com/"
  },
  {
    "imageUrl": "/assets/projects/colliborate-case-study-img-1.jpg",
    "title": "Colliborate (USA) \u2014 Cloud Collaboration Workspace for Tax Advisory",
    "metrics": [
      {
        "value": "4x",
        "label": "Faster Sync"
      },
      {
        "value": "256-bit",
        "label": "AES Encryption"
      },
      {
        "value": "0",
        "label": "Data Leakage"
      }
    ],
    "client": "Colliborate",
    "category": "custom-software",
    "techStack": [
      "Angular",
      "Node.js",
      "AWS S3 Encrypted Storage",
      "Stripe Billing API",
      "Role-based Access"
    ],
    "problem": "<p>Distributed tax consulting teams were encumbered by sluggish legacy client portals, unencrypted email document sharing, and disconnected hourly billing tools that compromised client trust and slowed down annual tax filing cycles.</p>",
    "solution": "<p>Refactored the core Angular framework to eliminate rendering bottlenecks, implemented end-to-end 256-bit AES encrypted client document vaults with expiring access links, built an integrated time-tracking and automated invoicing engine, and established shared engagement task boards for multi-member advisory teams.</p>",
    "result": "<p>Boosted cloud synchronization speed by 4x across concurrent user sessions while maintaining a flawless zero-leakage security record. Advisory staff saved an average of 8 hours per week on document chasing and billing reconciliation.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://colliborate.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    "title": "Tampa Property Choice \u2014 Commercial RE Analytics Portal & CRM",
    "metrics": [
      {
        "value": "10k+",
        "label": "Properties Indexed"
      },
      {
        "value": "< 50ms",
        "label": "Search Latency"
      },
      {
        "value": "Instant",
        "label": "Cap Rate Valuation"
      }
    ],
    "client": "Tampa Property Choice",
    "category": "custom-software",
    "techStack": [
      "Python Scrapy",
      "Elasticsearch",
      "React",
      "FastAPI",
      "Cap Rate Algorithms"
    ],
    "problem": "<p>Commercial real estate investors in Florida relied on fragmented MLS listings and manual spreadsheets to evaluate Net Operating Income (NOI), capitalization rates, and multi-tenant cash flows, creating significant latency during fast-moving commercial acquisitions.</p>",
    "solution": "<p>Engineered a high-throughput commercial property intelligence platform pairing automated web crawlers with an Elasticsearch indexing cluster. The platform calculates real-time financial metrics (Cap Rate, Cash-on-Cash Return, Debt Coverage Ratio) on the fly and integrates a dedicated investor CRM with automated deal-matching notifications.</p>",
    "result": "<p>Indexed over 10,000 regional commercial properties with sub-50ms search response times. Brokers and institutional investors gained the capability to evaluate complex multi-unit commercial assets in seconds rather than days.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://tampapropertychoice.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
    "title": "Quick Time Taxi (QTT Canada) \u2014 Fleet Dispatch & Ride Booking Platform",
    "metrics": [
      {
        "value": "< 120ms",
        "label": "Dispatch Latency"
      },
      {
        "value": "99.99%",
        "label": "Uptime"
      },
      {
        "value": "+34.8%",
        "label": "Route Efficiency"
      }
    ],
    "client": "Quick Time Taxi Service",
    "category": "mobile",
    "techStack": [
      "React Native",
      "Node.js",
      "WebSockets",
      "Google Maps API",
      "Automated Dispatch Engine"
    ],
    "problem": "<p>A regional Canadian taxi operator struggled with legacy radio dispatch, inaccurate ETAs during harsh winter conditions, and rider churn due to the lack of an intuitive, modern ride-hailing smartphone application.</p>",
    "solution": "<p>Built an end-to-end transportation ecosystem featuring a customer mobile booking app (iOS/Android), a driver dispatch application with real-time turn-by-turn routing, and a browser-based central control room. Developed an intelligent proximity-based auto-dispatch algorithm that assigns jobs to optimal drivers based on vector heading and traffic.</p>",
    "result": "<p>Reduced dispatch latency to under 120ms, cut manual phone dispatch labor by 42%, improved fleet route efficiency by 34.8%, and delivered 99.99% system availability through peak winter storm operations.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://quicktimetaxi.ca/"
  },
  {
    "imageUrl": "/assets/projects/mpc-case-study-img-2.jpg",
    "title": "Mega Poultry Company (MPC) \u2014 Connected Enterprise ERP & Supply Chain",
    "metrics": [
      {
        "value": "5 Hubs",
        "label": "Unified"
      },
      {
        "value": "-35%",
        "label": "Feed Wastage"
      },
      {
        "value": "Real-time",
        "label": "Batch Tracking"
      }
    ],
    "client": "Mega Poultry Company",
    "category": "custom-software",
    "techStack": [
      "ERP Architecture",
      "Supply Chain Modeling",
      "Batch Tracing Engine",
      "Process Re-engineering"
    ],
    "problem": "<p>Operating five separate agricultural hubs (breeder farms, hatcheries, feed mills, processing plants, and refrigerated distribution centers) across regional territories with disconnected legacy record books created severe inventory bottlenecks and feed wastage.</p>",
    "solution": "<p>Time Global Tech designed an enterprise ERP blueprint and operational architecture uniting all five facilities into a synchronized digital pipeline. We mapped material flows, established automated barcode batch-tracking from egg incubation through retail packaging, and drafted comprehensive software procurement specifications.</p>",
    "result": "<p>Successfully aligned all department heads behind a unified digital operating model, eliminated manual batch record discrepancies, reduced poultry feed wastage by 35%, and provided senior management with real-time production yield dashboards.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://megapoultry.com/"
  },
  {
    "imageUrl": "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg",
    "title": "Denbeaux & Denbeaux Law Firm \u2014 Confidential Legal Case Management Portal",
    "metrics": [
      {
        "value": "100%",
        "label": "Confidentiality"
      },
      {
        "value": "-65%",
        "label": "Inquiry Calls"
      },
      {
        "value": "24/7",
        "label": "Client Access"
      }
    ],
    "client": "Denbeaux & Denbeaux Law Firm",
    "category": "custom-software",
    "techStack": [
      "React",
      "Node.js",
      "End-to-End Encryption",
      "Document Vault",
      "Milestone Tracking"
    ],
    "problem": "<p>High-stakes civil and financial litigation attorneys were swamped with constant client phone calls asking for case status updates, while sensitive court pleadings and financial evidence were being transmitted insecurely over email attachments.</p>",
    "solution": "<p>Engineered a secure, encrypted client web portal where clients can view live case progress milestones, review drafted court pleadings, upload financial evidence directly into an encrypted vault, and message attorneys securely within an audited environment.</p>",
    "result": "<p>Cut repetitive client status inquiry calls by 65%, eliminated unencrypted email file transfers entirely, and dramatically improved client satisfaction ratings during emotionally stressful litigation proceedings.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://denbeauxlaw.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    "title": "Culinabot Robotics \u2014 Autonomous Kitchen Product Development & Feasibility",
    "metrics": [
      {
        "value": "6 DOF",
        "label": "Arm Kinematics"
      },
      {
        "value": "<50ms",
        "label": "Vision Latency"
      },
      {
        "value": "100%",
        "label": "Feasibility Validated"
      }
    ],
    "client": "Culinabot Robotics",
    "category": "custom-software",
    "techStack": [
      "ROS",
      "Python",
      "OpenCV",
      "Kinematics Telemetry",
      "Hardware-in-the-Loop"
    ],
    "problem": "<p>Developing an autonomous commercial cooking robot required validating complex multi-arm mechanical kinematics, thermal resistance near induction cooktops, vision AI ingredient identification, and food safety sanitation regulations before entering expensive physical manufacturing.</p>",
    "solution": "<p>Conducted an end-to-end technical feasibility assessment and product architecture roadmap. Modeled 6-DOF robotic arm trajectories, evaluated sub-50ms machine vision algorithms for ingredient recognition and portion estimation, and outlined an automated modular cleaning protocol meeting NSF commercial kitchen standards.</p>",
    "result": "<p>Delivered an actionable, investor-ready commercialization roadmap that validated full engineering feasibility, established hardware-in-the-loop testing protocols, and paved the way for successful prototype funding rounds.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://culinabot.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
    "title": "Thank You Plaque \u2014 Custom Engraving eCommerce Web Portal",
    "metrics": [
      {
        "value": "+65%",
        "label": "Checkout Conversion"
      },
      {
        "value": "Live",
        "label": "Canvas Preview"
      },
      {
        "value": "-80%",
        "label": "Design Proofing Time"
      }
    ],
    "client": "Thank You Plaque",
    "category": "ecommerce",
    "techStack": [
      "WooCommerce",
      "HTML5 Canvas Preview",
      "Vector SVG Generator",
      "Stripe Checkout"
    ],
    "problem": "<p>Customers ordering personalized recognition plaques faced a clunky back-and-forth email proofing process to approve text layouts and company logos, leading to high cart abandonment rates and production errors.</p>",
    "solution": "<p>Built a streamlined 5-page minimalist visual eCommerce storefront with an interactive HTML5 real-time plaque preview configurator. Customers can type custom dedication text, select fonts, upload vectorized corporate logos, and instantly see the engraved plaque simulation before placing their order.</p>",
    "result": "<p>Increased checkout conversions by 65%, cut manual design proofing time by 80%, and virtually eliminated customer return requests caused by typographical layout misunderstandings.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://thankyouplaque.com/"
  },
  {
    "imageUrl": "/assets/projects/mattressland-case-study-img-1.png",
    "title": "Mattressland UK \u2014 Omnichannel Retail Branding & Collateral Suite",
    "metrics": [
      {
        "value": "+40%",
        "label": "Brand Recall"
      },
      {
        "value": "Omnichannel",
        "label": "Consistency"
      },
      {
        "value": "Full Suite",
        "label": "Retail Collateral"
      }
    ],
    "client": "Mattressland UK",
    "category": "ecommerce",
    "techStack": [
      "E-commerce UX",
      "Print & Digital Guidelines",
      "Typography Hierarchy",
      "Packaging System"
    ],
    "problem": "<p>Mattressland UK operated brick-and-mortar retail showrooms and an emerging eCommerce website with disjointed visual branding, competing typography, and inconsistent in-store marketing collateral that diluted consumer trust.</p>",
    "solution": "<p>Designed a comprehensive, unified brand identity system across both physical and digital retail touchpoints. Created bespoke corporate typography standards, in-store promotional signage, luxury packaging materials, and pixel-perfect UI guidelines for the web storefront.</p>",
    "result": "<p>Elevated customer brand recall by 40% against high-street UK bedding competitors, achieved seamless visual continuity between retail showrooms and online channels, and boosted in-store promotional conversion rates.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://mattressland.co.uk/"
  },
  {
    "imageUrl": "/assets/projects/infotex-case-study-img-1.png",
    "title": "Infotex Technologies \u2014 Enterprise Brand Identity & Digital Positioning",
    "metrics": [
      {
        "value": "100%",
        "label": "Asset Consistency"
      },
      {
        "value": "Enterprise",
        "label": "Market Ready"
      },
      {
        "value": "12-wk",
        "label": "Delivery"
      }
    ],
    "client": "Infotex Technologies",
    "category": "custom-software",
    "techStack": [
      "Brand Architecture",
      "Design System",
      "Responsive Web UI",
      "Pitch Deck Synthesis"
    ],
    "problem": "<p>An emerging B2B enterprise software provider had solid engineering capabilities but lacked an authoritative corporate identity, making it difficult to win credibility when pitching against established enterprise tech vendors.</p>",
    "solution": "<p>Developed an end-to-end corporate visual identity, executive pitch presentation deck, digital marketing asset kit, and modern responsive company website designed to communicate institutional reliability and technological sophistication.</p>",
    "result": "<p>Positioned Infotex as a tier-1 software partner in front of prospective enterprise clients and venture investors, directly supporting their client acquisition pipeline and brand confidence.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://infotex.tech/"
  },
  {
    "imageUrl": "/assets/projects/dairy-farm-case-study-img-2.jpg",
    "title": "Dairy Farm Operations (Mr. Farhan) \u2014 Scalable Dairy Automation Blueprint",
    "metrics": [
      {
        "value": "+28%",
        "label": "Yield Tracking"
      },
      {
        "value": "100%",
        "label": "Digital Herd Logs"
      },
      {
        "value": "3yr",
        "label": "Financial ROI Model"
      }
    ],
    "client": "Mr. Farhan / Dairy Farm Operations",
    "category": "custom-software",
    "techStack": [
      "Cloud Database Architecture",
      "IoT Sensor Blueprint",
      "Yield Analytics",
      "Financial Feasibility"
    ],
    "problem": "<p>A commercial dairy farm managed hundreds of milking cows using handwritten barn clipboards and oral communications, leading to missed estrus cycles, unrecorded veterinary interventions, and unoptimized milk yield curves.</p>",
    "solution": "<p>Formulated a complete digital transformation strategy and automation blueprint. Designed an RFID-based animal lifecycle database schema, automated milk yield recording workflows, daily feed ration calculation formulas, and a comprehensive 3-year financial feasibility model for farm investors.</p>",
    "result": "<p>Delivered a structured operational roadmap that replaced chaotic manual barn logs with digital tracking, improved milk yield analytics precision by 28%, and provided a clear path toward automated dairy herd management.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://dairyfarmsolutions.com/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&q=80&w=1200",
    "title": "Reccon (Pvt) Limited \u2014 Corporate Repositioning & 35-Year Heritage Profile",
    "metrics": [
      {
        "value": "35+ Yrs",
        "label": "Legacy Synthesized"
      },
      {
        "value": "50+ Bids",
        "label": "Tender Ready"
      },
      {
        "value": "100%",
        "label": "Executive Alignment"
      }
    ],
    "client": "Reccon (Pvt) Limited",
    "category": "custom-software",
    "techStack": [
      "Corporate Literature Architecture",
      "Executive Profile Suite",
      "Technical Writing",
      "Tender Collateral"
    ],
    "problem": "<p>Reccon (Pvt) Limited possessed over 35 years of prestigious civil engineering accomplishments (highways, dams, industrial plants) but lacked modernized marketing literature and executive credential profiles needed for pre-qualification in multi-billion rupee international infrastructure bids.</p>",
    "solution": "<p>Researched and synthesized decades of engineering contracts into an authoritative corporate profile, project dossier, and executive credentials suite. Designed a sleek, modern visual aesthetic that honored their civil engineering heritage while meeting stringent pre-qualification standards.</p>",
    "result": "<p>Empowered Reccon to successfully pre-qualify for premier public and private sector civil infrastructure tenders, establishing an elite corporate presence that accurately reflects their 35+ years of operational excellence.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://reccon.com.pk/"
  },
  {
    "imageUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
    "title": "R.H. Care USA \u2014 Healthcare Explainer Video & Motion Branding",
    "metrics": [
      {
        "value": "+70%",
        "label": "Patient Comprehension"
      },
      {
        "value": "100%",
        "label": "Intake Compliance"
      },
      {
        "value": "Full HD",
        "label": "Multi-Platform Suite"
      }
    ],
    "client": "R.H. Care USA",
    "category": "custom-software",
    "techStack": [
      "2D Vector Animation",
      "Motion Graphics",
      "Clinical Scriptwriting",
      "Voiceover Sync"
    ],
    "problem": "<p>Elderly home healthcare patients and their family members struggled to understand Medicare-mandated clinical intake questionnaires and remote care monitoring protocols, resulting in delayed care authorizations and administrative friction.</p>",
    "solution": "<p>Scripted, storyboarded, and produced an engaging 2D motion graphic explainer video suite with synchronized warm voiceovers and step-by-step visual demonstrations. The videos walk patients clearly through home visit schedules, caregiver credentials, and telehealth check-ins.</p>",
    "result": "<p>Boosted patient intake comprehension by 70%, reduced patient intake delays to zero, and provided R.H. Care with a high-trust digital onboarding asset deployed across myrhcare.com and patient outreach portals.</p>",
    "featured": true,
    "status": "published",
    "liveUrl": "https://myrhcare.com/"
  }
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
