import { Schema, model, type Model, type Types } from "mongoose";
import { STATUSES, type Status } from "./Service.js";

export const STORY_TYPES = ["success", "lesson"] as const;
export type StoryType = (typeof STORY_TYPES)[number];

export interface IStory {
  title: string;
  slug: string;
  type: StoryType;
  tag: string;
  desc: string;
  impact: string;
  challenge: string;
  solution: string;
  image: Types.ObjectId | null;
  imageUrl: string;
  order: number;
  featured: boolean;
  status: Status;
  publishedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory, Model<IStory>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: STORY_TYPES, default: "success", index: true },
    tag: { type: String, default: "", trim: true, maxlength: 100 },
    desc: { type: String, default: "", trim: true },
    impact: { type: String, default: "", trim: true, maxlength: 200 },
    challenge: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    image: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    imageUrl: { type: String, default: "", trim: true },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: STATUSES, default: "published", index: true },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export const Story = model<IStory>("Story", storySchema);

export async function seedInitialStories() {
  try {
    // Purge outdated dummy stories
    await Story.deleteMany({
      slug: {
        $in: [
          "from-crash-prone-prototype-to-100k-downloads",
          "a-checkout-redesign-that-tripled-revenue",
          "the-launch-that-went-down-in-11-minutes",
          "the-beautiful-interface-nobody-could-use",
        ],
      },
    });

    const count = await Story.countDocuments();
    if (count > 0) return;

    const defaultStories = [
      {
        title: "Quick Time Taxi (QTT Canada) — Dispatch Latency Slashed by 42%",
        slug: "qtt-canada-dispatch-latency-slashed",
        type: "success",
        tag: "Mobile App & Fleet Dispatch",
        desc: "A Canadian taxi fleet operator faced severe radio dispatch delays, inaccurate winter ETAs, and lost bookings. Time Global Tech built a unified mobile booking ecosystem (rider + driver) with sub-second WebSocket telemetry and automated geospatial dispatch algorithms, dropping latency below 120ms.",
        impact: "<120ms Latency · +34.8% Route Efficiency",
        challenge: "Manual radio dispatch workflows causing driver confusion, delayed customer pickups, and lost rides during peak Canadian winter commutes.",
        solution: "Engineered a dual-app mobile ecosystem (rider + driver) with sub-second WebSocket telemetry and automated geospatial driver-matching algorithms.",
        imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
        order: 1,
        status: "published",
      },
      {
        title: "ToyotaSure — Nationwide 203-Point Certified Inspection Engine",
        slug: "toyotasure-nationwide-inspection-engine",
        type: "success",
        tag: "Enterprise Automotive Portal",
        desc: "Toyota Indus Motors needed to establish nationwide consumer trust in Pakistan's certified pre-owned vehicle market. We built a standardized 203-checkpoint technician inspection engine, tamper-evident digital certificate generation, and nationwide real-time dealer marketplace portal.",
        impact: "203 Checkpoints · Nationwide Dealership Network",
        challenge: "Manual paper inspection checklists across disparate dealerships with zero unified transparency for used car buyers.",
        solution: "Built a centralized 203-point vehicle grading algorithm, digital inspection certification pipeline, and real-time dealer marketplace portal.",
        imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
        order: 2,
        status: "published",
      },
      {
        title: "Ontario Tennis Association — Unified Tournament & Club Ecosystem",
        slug: "ontario-tennis-association-unified-ecosystem",
        type: "success",
        tag: "Sports Management & Member Portal",
        desc: "Provincial tennis operations were bottlenecked by disconnected club records, paper tournament entries, and manual ranking computations. We engineered an integrated digital platform connecting player profiles, automated tournament draw brackets, and live provincial rankings.",
        impact: "250+ Clubs · 15k+ Players · -75% Manual Work",
        challenge: "Fragmented club directories, manual paper draws, and siloed tournament registrations causing delays and administrative overhead.",
        solution: "Built a connected digital operations platform uniting player ratings, automated tournament bracket scheduling, and club membership management.",
        imageUrl: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
        order: 3,
        status: "published",
      },
      {
        title: "Tampa Property Choice — Instant Cap Rate & Commercial RE Analytics",
        slug: "tampa-property-choice-commercial-analytics",
        type: "success",
        tag: "Big Data & Commercial PropTech",
        desc: "Commercial real estate brokers were losing valuable acquisition hours manually parsing county filings and spreadsheets. We engineered automated Python scrapers feeding an Elasticsearch index with on-the-fly mathematical Cap Rate valuations and integrated investor CRM pipelines.",
        impact: "10k+ Properties · <50ms Valuation Latency",
        challenge: "Commercial real estate brokers spending hours cross-referencing MLS listings, county tax records, and zoning laws to compute simple capitalization rates.",
        solution: "Automated distributed Python scrapers feeding an Elasticsearch index with live mathematical investment modeling and automated investor CRM pipelines.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
        order: 4,
        status: "published",
      },
      {
        title: "Mega Poultry Company (MPC) — Why Process Architecture Must Precede Code",
        slug: "mpc-why-process-architecture-must-precede-code",
        type: "lesson",
        tag: "Enterprise Architecture",
        desc: "A massive agricultural enterprise pushed to fast-track commercial off-the-shelf ERP software across five hubs without formal cross-departmental process mapping. We intervened to pause software procurement and conduct exhaustive on-ground workflow audits from hatcheries to cold chain distribution.",
        impact: "Architecture First · Zero ERP Rework",
        challenge: "A rapid urge to deploy commercial off-the-shelf ERP software across 5 operational hubs without formal cross-departmental process mapping.",
        solution: "We paused software procurement to conduct exhaustive on-ground workflow audits from hatcheries to cold storage, preventing millions in mismatched software licensing.",
        imageUrl: "/assets/projects/mpc-case-study-img-2.jpg",
        order: 5,
        status: "published",
      },
      {
        title: "Colliborate USA — Data Privacy & Compliance in Distributed Tax Advisory",
        slug: "colliborate-usa-data-privacy-compliance",
        type: "lesson",
        tag: "FinTech Compliance & Cloud Security",
        desc: "Distributed accounting advisory teams were relying on ad-hoc cloud file sharing links for sensitive IRS tax filings. We re-architected the file exchange system into zero-trust client vaults with cryptographic audit trails, granular role permissions, and auto-expiring document access.",
        impact: "Zero Data Leakage · 256-bit AES Vault",
        challenge: "Distributed accounting teams sharing sensitive IRS filings via ad-hoc cloud links, risking regulatory non-compliance.",
        solution: "Re-architected cloud storage into zero-trust client vaults with cryptographic audit trails, granular role permissions, and auto-expiring document access.",
        imageUrl: "/assets/projects/colliborate-case-study-img-1.jpg",
        order: 6,
        status: "published",
      },
    ];

    await Story.insertMany(defaultStories);
  } catch {}
}
