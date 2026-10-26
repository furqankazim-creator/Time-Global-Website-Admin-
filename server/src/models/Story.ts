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
    const count = await Story.countDocuments();
    if (count > 0) return;

    const defaultStories = [
      {
        title: "From Crash-Prone Prototype to 100K Downloads",
        slug: "from-crash-prone-prototype-to-100k-downloads",
        type: "success",
        tag: "Mobile App",
        desc: "A health startup came to us with a half-built React Native app — 40+ crash reports open, no Android version, and an investor demo in 6 weeks. We took full ownership, rebuilt the core architecture, and shipped both iOS and Android on time. Within 60 days of launch, the app charted in the App Store's top 10 for Health & Fitness.",
        impact: "100K Downloads · Top 10 App Store",
        challenge: "Unstable codebase, no Android build, and a non-negotiable investor demo deadline threatening the next funding round.",
        solution: "Complete React Native rebuild with shared cross-platform logic, offline support, and a performance overhaul that cut load time by 65%.",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
        order: 1,
        status: "published",
      },
      {
        title: "A Checkout Redesign That Tripled Revenue",
        slug: "a-checkout-redesign-that-tripled-revenue",
        type: "success",
        tag: "E-commerce & UI/UX",
        desc: "A fashion retailer had strong brand recognition and steady traffic — but was bleeding customers at checkout. We redesigned the end-to-end shopping experience, from product discovery to payment confirmation, with a relentless focus on mobile. The numbers changed within the first month.",
        impact: "3× Conversion Rate · 58% Drop in Abandonment",
        challenge: "A 6-step desktop-only checkout that was losing 74% of mobile visitors before they ever reached payment.",
        solution: "Mobile-first Shopify redesign with one-tap checkout, smart product recommendations, and a streamlined 2-step purchase flow.",
        imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
        order: 2,
        status: "published",
      },
      {
        title: "The Launch That Went Down in 11 Minutes",
        slug: "the-launch-that-went-down-in-11-minutes",
        type: "lesson",
        tag: "Web Development",
        desc: "A client pushed hard to launch their web platform ahead of schedule. We agreed — and skipped the load testing phase to make the deadline. On launch day, a traffic spike eight times our projected peak took the entire backend offline in under 11 minutes. The client lost thousands in sales. We lost sleep.",
        impact: "Speed without resilience isn't delivery — it's a delayed disaster.",
        challenge: "No autoscaling configured, single-region deployment, and zero buffer for real-world traffic patterns.",
        solution: "We rebuilt the infrastructure with auto-scaling groups, multi-region failover, and CDN-level caching. Pre-launch stress testing is now mandatory on every project we ship.",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
        order: 3,
        status: "published",
      },
      {
        title: "The Beautiful Interface Nobody Could Use",
        slug: "the-beautiful-interface-nobody-could-use",
        type: "lesson",
        tag: "UI/UX Design",
        desc: "We were proud of a dashboard redesign we delivered for an operations client. Visually, it was our best work to date. We were so confident we skipped formal user testing. Within days of launch, every power user was confused. Workflows they'd relied on for years had moved or disappeared. The client rolled back within a week.",
        impact: "Great design is invisible. If users notice it, something is wrong.",
        challenge: "We optimised for aesthetics and modern patterns — ignoring the deeply ingrained mental models of users who had worked in the old UI for three years.",
        solution: "We rebuilt the design with real usability testing from the start. Now, no major UI ships without sessions with at least five actual users validating the flows.",
        imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=1200",
        order: 4,
        status: "published",
      },
    ];

    await Story.insertMany(defaultStories);
  } catch {}
}
