import { Service } from "./services"
import { ALL_FAQ_CATEGORIES } from "./all-faqs"

function getFaqsForSlug(slug: string) {
  const cat = ALL_FAQ_CATEGORIES.find((c) => c.id === slug || c.id === slug.replace("-marketing", ""))
  if (!cat || !cat.faqs) return []
  return cat.faqs.map((f) => ({ question: f.question, answer: f.answer }))
}

export const FALLBACK_SERVICES: Record<string, Service> = {
  "residential-solar": {
    slug: "residential-solar",
    title: "Residential Rooftop Solar Installation",
    shortLabel: "Residential Solar",
    description: "Turnkey rooftop solar solutions for independent homes, villas, and kothis. Slash electricity bills by up to 90% with PM Surya Ghar central subsidies.",
    intro: "Transform your home rooftop into an independent clean energy generator. With customized system capacities from 1 kW to 10 kW, Tier-1 Mono PERC & TOPCon modules, and direct central government subsidies up to ₹78,000, AG POWER makes solar adoption seamless.",
    image: "/og/services/residential-solar.jpg",
    heroImage: "/images/services/residential-solar.webp",
    points: [
      "1 kW to 10 kW custom system capacities engineered for your roof",
      "Tier-1 Mono PERC and N-Type TOPCon panels with 25-30 year linear warranty",
      "PM Surya Ghar Muft Bijli Yojana subsidy processing up to ₹78,000",
      "Non-penetrating, wind-rated mounting structures protecting roof waterproofing",
      "DISCOM net-metering synchronization and turnkey paperwork execution",
    ],
    outcomes: [
      "Up to 90% reduction in recurring monthly grid power bills",
      "Complete capital payback achieved in 3 to 4 years",
      "Protection against rising residential electricity tariffs for 25+ years",
    ],
    whyItMatters: [
      "Solar increases your property valuation while eliminating peak summer AC bill spikes.",
      "Government subsidies significantly lower upfront capital outlay.",
      "Net-metering credits surplus daytime power back to the DISCOM grid.",
    ],
    faqs: getFaqsForSlug("residential-solar"),
  },

  "commercial-solar": {
    slug: "commercial-solar",
    title: "Commercial & Industrial Solar Solutions",
    shortLabel: "Commercial Solar",
    description: "High-yield solar power plants for factories, industrial sheds, commercial complexes, and warehouses. Cut OpEx and leverage 40% accelerated depreciation.",
    intro: "Commercial and industrial power tariffs in India are among the highest operational expenses for growing enterprises. AG POWER engineers turnkey 10 kW to 500+ kW solar installations that deliver immediate bottom-line cost reductions and rapid capital recovery.",
    image: "/og/services/commercial-solar.jpg",
    heroImage: "/images/services/commercial-solar.webp",
    points: [
      "10 kW to 500+ kW engineered EPC installations customized for C&I roofs",
      "Custom anodized aluminum clamping for trapezoidal and curved metal sheds",
      "40% accelerated depreciation tax benefits under Section 32 of Income Tax Act",
      "High-efficiency N-Type TOPCon bifacial modules with dual-side generation",
      "Remote SCADA string monitoring and zero-downtime installation execution",
    ],
    outcomes: [
      "Rapid capital payback within 2.5 to 4 years",
      "Dramatic reduction in operational overhead and peak demand tariff penalties",
      "Compliance with corporate ESG and sustainable green manufacturing standards",
    ],
    whyItMatters: [
      "Guarantees predictability in operating energy costs for 25+ years.",
      "Tax depreciation shields profits while reducing electricity bills simultaneously.",
      "Enhances brand sustainability credentials for domestic and export clients.",
    ],
    faqs: getFaqsForSlug("commercial-solar"),
  },

  "housing-society-solar": {
    slug: "housing-society-solar",
    title: "Housing Society Solar Installation",
    shortLabel: "Housing Society Solar",
    description: "Rooftop solar for apartment complexes, RWAs, and residential societies. Offset common area electricity for lifts, water pumps, corridors, and clubhouses.",
    intro: "Common area electricity bills for elevators, multi-stage water pumping, parking security, and clubhouses are a continuous financial burden on housing society maintenance budgets. AG POWER delivers engineered solar installations that offset up to 80% of common utility bills.",
    image: "/og/services/housing-society-solar.jpg",
    heroImage: "/images/services/housing-society-solar.webp",
    points: [
      "Tailored solar systems from 15 kW to 100+ kW for apartment common areas",
      "Powers heavy inductive loads including lifts, pumps, and fire systems safely",
      "Complete assistance with RWA General Body presentations and approvals",
      "Bulk DISCOM net-metering documentation and regulatory clearances",
      "Heavy-duty elevated structural design retaining usable rooftop terrace area",
    ],
    outcomes: [
      "Reduces common area society maintenance expenditure by 70% to 85%",
      "Shields apartment residents from recurring maintenance fee hikes",
      "Increases society prestige and green building certification status",
    ],
    whyItMatters: [
      "Elevated structure designs allow residents to continue using terrace space for recreation.",
      "Turnkey liaison removes administrative stress from RWA committee members.",
      "Surplus generation credits directly offset society common meter charges.",
    ],
    faqs: getFaqsForSlug("housing-society-solar"),
  },

  "performance-marketing": {
    slug: "performance-marketing",
    title: "Performance Marketing - Meta Ads & Google Ads",
    shortLabel: "Performance",
    description: "Profit-focused ad systems across Meta and Google, backed by audience targeting, creative testing, and relentless optimization.",
    intro: "Every rupee you spend on advertising should translate into measurable revenue, qualified leads, or profitable purchases. We build data-driven performance campaigns engineered for sustainable scaling.",
    image: "/og/services/performance-marketing.jpg",
    heroImage: "/images/services/performance-marketing.webp",
    points: [
      "Meta Ads & Google Ads end-to-end management",
      "Algorithmic audience segmentation & intent modeling",
      "Multi-variant creative testing (Reels, Statics, UGC)",
      "ROAS & CAC optimization with daily cohort analysis",
      "Custom server-side conversion tracking & attribution",
    ],
    outcomes: [
      "2.8x - 4.5x average blended ROAS across active campaigns",
      "35%+ reduction in Customer Acquisition Cost (CAC)",
      "Transparent live reporting dashboards without vanity metrics",
    ],
    whyItMatters: [
      "Eliminates wasted ad spend by cutting underperforming ad sets early.",
      "Scales winning creatives systematically without audience burnout.",
      "Connects paid acquisition seamlessly with your retention and SEO funnels.",
    ],
    faqs: getFaqsForSlug("performance-marketing"),
  },

  "social-media-marketing": {
    slug: "social-media-marketing",
    title: "Social Media Marketing - SMO & Content Creation",
    shortLabel: "Social Media",
    description: "Consistent brand visibility, high-retention short-form video, and community engagement designed to build real audience trust.",
    intro: "Posting daily without a clear growth strategy burns out your team without driving revenue. We craft strategic social content calendars that stop the scroll and turn viewers into loyal brand advocates.",
    image: "/og/services/social-media-marketing.jpg",
    heroImage: "/images/services/social-media-marketing.webp",
    points: [
      "Strategic content calendars aligned with product launches",
      "High-converting Instagram Reels, Carousels & Stories",
      "Community engagement, comment handling & brand voice governance",
      "Creator collaboration and influencer seeding campaigns",
      "Profile architecture & bio link conversion optimization",
    ],
    outcomes: [
      "3x - 5x increase in organic engagement and profile visits",
      "Consistent 30-day content pipeline planned in advance",
      "Higher brand affinity leading to elevated organic search volume",
    ],
    whyItMatters: [
      "Strong social proof dramatically lowers paid advertising CAC.",
      "Builds an owned organic audience that compounds in value over time.",
      "Keeps your brand top-of-mind across your target demographic.",
    ],
    faqs: getFaqsForSlug("social-media-marketing"),
  },

  "search-engine-optimization": {
    slug: "search-engine-optimization",
    title: "SEO, AEO & GEO - Search Engine Optimization",
    shortLabel: "SEO & AEO",
    description: "Rank for high-intent queries across Google search, AI answer engines (ChatGPT, Perplexity), and generative overviews.",
    intro: "Modern search is no longer just ten blue links on Google. We optimize your website for traditional SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) so buyers find your brand wherever they ask questions.",
    image: "/og/services/search-engine-optimization.jpg",
    heroImage: "/images/services/search-engine-optimization.webp",
    points: [
      "Full technical SEO architecture & Core Web Vitals audit",
      "High-intent commercial keyword mapping & clustering",
      "AEO & GEO optimization for AI search engines & LLMs",
      "Schema.org connected graph markup for rich snippets",
      "Strategic high-authority backlink acquisition & digital PR",
    ],
    outcomes: [
      "Top-3 Google rankings for high-intent transactional keywords",
      "Rich snippet cards and Knowledge Graph visibility in search",
      "Direct attribution in ChatGPT, Perplexity, and Google AI Overviews",
    ],
    whyItMatters: [
      "Organic search delivers compounding traffic without per-click costs.",
      "Future-proofs your brand against shifts toward AI search interfaces.",
      "Establishes institutional domain authority in your industry vertical.",
    ],
    faqs: getFaqsForSlug("seo"),
  },

  "d2c-branding-scale-growth": {
    slug: "d2c-branding-scale-growth",
    title: "D2C Branding & Scale Growth",
    shortLabel: "Branding",
    description: "End-to-end brand identity, packaging guidance, visual guidelines, and positioning strategy to dominate competitive D2C markets.",
    intro: "A distinct brand voice and elevated visual identity separate enduring market leaders from commoditized sellers. We shape your brand narrative, design language, and positioning to command premium margins.",
    image: "/og/services/d2c-branding-scale-growth.jpg",
    heroImage: "/images/services/d2c-branding-scale-growth.webp",
    points: [
      "Comprehensive brand identity & positioning blueprint",
      "Typography, color psychology & responsive design tokens",
      "Packaging, unboxing experience & insert card direction",
      "Tone of voice guidelines & brand messaging playbooks",
      "Cross-channel visual consistency audits",
    ],
    outcomes: [
      "Command premium price points with reduced price sensitivity",
      "Consistent, recognizable presence across all consumer touchpoints",
      "Higher repeat customer rate and word-of-mouth advocacy",
    ],
    whyItMatters: [
      "Strong brand equity insulates your business from aggressive ad cost spikes.",
      "Dramatically improves conversion rates across landing pages and product listings.",
      "Attracts higher-tier retail partnerships and marketplace features.",
    ],
    faqs: getFaqsForSlug("general"),
  },

  "conversion-rate-optimization": {
    slug: "conversion-rate-optimization",
    title: "CRO - Conversion Rate Optimization",
    shortLabel: "CRO",
    description: "Turn more website visitors into paying customers through rigorous funnel audits, UX enhancements, and data-backed A/B testing.",
    intro: "Doubling your conversion rate produces the exact same revenue impact as doubling your marketing budget, but at a fraction of the cost. We optimize every step from landing page to checkout.",
    image: "/og/services/conversion-rate-optimization.jpg",
    heroImage: "/images/services/conversion-rate-optimization.webp",
    points: [
      "Heatmap, session recording & funnel drop-off analysis",
      "Cart and checkout UX friction removal",
      "High-impact A/B headline, offer & layout split testing",
      "Mobile responsiveness & micro-interaction refinement",
      "Social proof, urgency & trust architecture implementation",
    ],
    outcomes: [
      "20% - 45% uplift in ecommerce checkout conversion rates",
      "Immediate increase in Average Order Value (AOV)",
      "Zero additional ad spend required to capture new revenue",
    ],
    whyItMatters: [
      "Every dollar invested in CRO amplifies the return of all advertising channels.",
      "Prevents high-bounce drop-offs on mobile and slow network connections.",
      "Creates a frictionless shopping experience that encourages repeat orders.",
    ],
    faqs: getFaqsForSlug("cro"),
  },

  "script-copywriting": {
    slug: "script-copywriting",
    title: "Script & Copywriting for Video & Ads",
    shortLabel: "Copywriting",
    description: "Hook-driven video scripts, high-converting ad copy, landing page messaging, and email sequences engineered to persuade and sell.",
    intro: "Words determine whether a prospect keeps watching or scrolls past. We combine psychological triggers, customer pain points, and direct response copywriting frameworks to craft messages that drive action.",
    image: "/og/services/script-copywriting.jpg",
    heroImage: "/images/services/script-copywriting.webp",
    points: [
      "3-second pattern-interrupt video hooks & concepts",
      "Full video scripts with visual cue directions for creators",
      "Direct-response landing page copy and value propositions",
      "High-converting Meta & Google ad headlines and body text",
      "Automated email welcome sequences & abandoned cart flows",
    ],
    outcomes: [
      "Significant increase in 3-second video hook retention",
      "Higher click-through rates (CTR) on paid social creatives",
      "Clear, persuasive messaging that articulates product superiority",
    ],
    whyItMatters: [
      "Great visuals fail without compelling messaging to drive intent.",
      "Systematic copy testing surfaces winning hooks that scale for months.",
      "Reduces creative fatigue with fresh angles on proven buyer objections.",
    ],
    faqs: getFaqsForSlug("copywriting"),
  },

  "strategy-consulting": {
    slug: "strategy-consulting",
    title: "Growth Strategy & Consulting",
    shortLabel: "Consulting",
    description: "Clear roadmaps, unit economics reviews, channel allocation strategies, and executive advisory for founders seeking steady growth.",
    intro: "Scaling a brand requires coordinated execution across acquisition, retention, product margins, and cash flow. Our advisory service provides senior strategic guidance to eliminate bottlenecks and accelerate momentum.",
    image: "/og/services/strategy-consulting.jpg",
    heroImage: "/images/services/strategy-consulting.webp",
    points: [
      "Comprehensive business growth audit & channel prioritization",
      "Unit economics, margin analysis & CAC/LTV modeling",
      "Quarterly roadmap planning with measurable milestone targets",
      "Tech stack evaluation & operational workflow optimization",
      "Direct founder advisory & campaign review sessions",
    ],
    outcomes: [
      "Clarity on where to deploy marketing capital for maximum return",
      "Elimination of wasteful software subscriptions and disjointed agencies",
      "Predictable growth model aligned with profitability targets",
    ],
    whyItMatters: [
      "Avoids costly strategic missteps in channel expansion.",
      "Aligns creative, media buying, and product teams under one unified goal.",
      "Provides seasoned executive perspective backed by cross-industry benchmark data.",
    ],
    faqs: getFaqsForSlug("strategy-consulting"),
  },

  "web-app-development": {
    slug: "web-app-development",
    title: "Web & App Development - Fast & Scalable",
    shortLabel: "Development",
    description: "Blazing fast ecommerce websites, headless stores, Next.js web applications, and custom business platforms built for high conversions.",
    intro: "Slow websites kill conversion rates. We engineer custom, ultra-fast web applications with modern Next.js App Router, Supabase PostgreSQL, and clean APIs designed to deliver 95+ Google Lighthouse scores.",
    image: "/og/services/web-app-development.jpg",
    heroImage: "/images/services/web-app-development.webp",
    points: [
      "Custom Next.js 15 App Router & React full-stack development",
      "Sub-second Core Web Vitals (LCP < 1.8s, CLS < 0.05)",
      "Supabase PostgreSQL database architecture & RLS security",
      "Automated ISR caching with instant tag revalidation",
      "Headless checkout, payment gateway & webhook integrations",
    ],
    outcomes: [
      "Ultra-fast loading times leading to measurable conversion gains",
      "Zero dependency on slow monolithic ecommerce themes",
      "Enterprise security architecture with automated deployment pipelines",
    ],
    whyItMatters: [
      "Google ranks fast, accessible websites higher across search results.",
      "Lower bounce rates on mobile networks directly increase ROAS.",
      "Modular codebase enables rapid iteration of new features and marketing tests.",
    ],
    faqs: getFaqsForSlug("web-development"),
  },

  "ai-automation": {
    slug: "ai-automation",
    title: "AI Automation & Workflow Engineering",
    shortLabel: "Automation",
    description: "Streamline repetitive operations, automate customer journeys, synchronize data, and integrate n8n workflows with your core stack.",
    intro: "Automate manual tasks and connect your marketing, CRM, inventory, and support tools with custom AI pipelines. Reclaim hundreds of team hours while ensuring zero operational errors.",
    image: "/og/services/ai-automation.jpg",
    heroImage: "/images/services/ai-automation.webp",
    points: [
      "Custom n8n and Zapier automated workflow architecture",
      "Automated lead capture, qualification & CRM synchronization",
      "AI-driven content generation and multi-channel publishing",
      "Inventory alerts, fulfillment notifications & return automations",
      "Error-resilient webhook pipelines with automatic retry logic",
    ],
    outcomes: [
      "Save 40+ hours per week of manual operational data entry",
      "Sub-minute response times for inbound sales and customer inquiries",
      "Seamless data flow between ecommerce backends and analytics platforms",
    ],
    whyItMatters: [
      "Allows lean teams to operate with the capacity of enterprise organizations.",
      "Eliminates human data entry mistakes in orders and customer records.",
      "Operates 24/7/365 without staffing overhead.",
    ],
    faqs: getFaqsForSlug("ai-automation"),
  },

  "ai-agentic-service": {
    slug: "ai-agentic-service",
    title: "AI Agentic Services & Autonomous Agents",
    shortLabel: "AI Agents",
    description: "Deploy autonomous AI agents that handle multi-step business logic, complex data synthesis, automated customer support, and decisions.",
    intro: "Move beyond simple chatbots. Our autonomous AI agents interact with your databases, execute API calls, reason across multiple contextual steps, and resolve customer and operational requests autonomously.",
    image: "/og/services/ai-agentic-service.jpg",
    heroImage: "/images/services/ai-agentic-service.webp",
    points: [
      "Domain-specific autonomous agent architectures with memory",
      "Secure API tool calling and external database retrieval",
      "Multi-turn conversational customer support with escalation rules",
      "Automated competitive intelligence and pricing monitoring agents",
      "Strict safety guardrails, Zod schema validation & prompt grounding",
    ],
    outcomes: [
      "Automate 70%+ of tier-1 customer inquiries without human intervention",
      "Instantaneous, hyper-personalized customer recommendations",
      "Reliable autonomous execution backed by deterministic code guardrails",
    ],
    whyItMatters: [
      "Provides enterprise-grade customer experience at fraction of call center costs.",
      "Learns and adapts from your internal product knowledge base securely.",
      "Enables proactive customer engagement based on browsing and purchase signals.",
    ],
    faqs: getFaqsForSlug("ai-agentic"),
  },

  "ai-video-generation": {
    slug: "ai-video-generation",
    title: "AI Video Generation for Ads & Social",
    shortLabel: "AI Video",
    description: "Generate photorealistic product videos, digital avatar presenters, explainer videos, and social reels using cutting-edge AI tools.",
    intro: "Produce high-volume video creatives at a fraction of traditional shoot costs. We leverage modern generative video pipelines to create engaging ad variations that keep CAC low.",
    image: "/og/services/ai-video-generation.jpg",
    heroImage: "/images/services/ai-video-generation.webp",
    points: [
      "Text-to-video & image-to-video generative creative generation",
      "Realistic AI avatar presenters in multiple languages and accents",
      "Product showcase videos with dynamic lighting and camera motions",
      "Automated video localization and caption generation",
      "Rapid creative testing variations for Meta & TikTok ads",
    ],
    outcomes: [
      "Cut video production timelines from weeks to under 48 hours",
      "Test 10x more video hooks and variations on the same creative budget",
      "Higher engagement on paid social feeds with fresh visual formats",
    ],
    whyItMatters: [
      "Solves creative fatigue by delivering an endless stream of fresh video assets.",
      "Eliminates the cost of expensive studio rentals, gear, and filming sets.",
      "Enables rapid iteration based on real-time ROAS feedback.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },

  "content-video-scripting": {
    slug: "content-video-scripting",
    title: "Content & Video Scripting",
    shortLabel: "Scripting",
    description: "Engaging video scripting for YouTube, Reels, podcasts, and digital campaigns crafted to retain attention from opening to CTA.",
    intro: "A great video starts with an airtight script. We structure video narratives that hook the viewer in the first 3 seconds, deliver continuous value, and seamlessly transition into compelling calls to action.",
    image: "/og/services/content-video-scripting.jpg",
    heroImage: "/images/services/content-video-scripting.webp",
    points: [
      "Narrative pacing and retention curve structuring",
      "Opening hook formulations backed by viewer retention data",
      "Detailed B-roll direction and visual action instructions",
      "Tone calibration for founders, creators, and corporate brands",
      "Episode frameworks for recurring podcast and YouTube shows",
    ],
    outcomes: [
      "Higher average watch time and completion rates on short and long form",
      "Effortless filming experience for presenters with clear script prompts",
      "Consistent storytelling that builds lasting brand authority",
    ],
    whyItMatters: [
      "Fixes the root cause of high viewer drop-off within the first 10 seconds.",
      "Saves filming hours by eliminating aimless rambling on camera.",
      "Standardizes content quality across an entire season or campaign.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },

  "video-editing": {
    slug: "video-editing",
    title: "High-Converting Video Editing",
    shortLabel: "Editing",
    description: "Pacing-driven video editing for short-form Reels, TikToks, YouTube long-form, and ad creatives designed to maximize watch time.",
    intro: "Raw footage transformed into sleek, engaging video content. Our video editing team implements precise cuts, dynamic sound design, subtitles, and motion elements that keep audiences engaged throughout.",
    image: "/og/services/video-editing.jpg",
    heroImage: "/images/services/video-editing.webp",
    points: [
      "Dynamic jump cuts, zoom cuts & pacing optimization",
      "Custom kinetic typography, subtitles & animated emojis",
      "Sound design, Foley audio enhancement & royalty-free music mixing",
      "Color grading, exposure correction & visual polish",
      "Optimized exports formatted for 9:16 vertical and 16:9 widescreen",
    ],
    outcomes: [
      "Measurably higher view-through rates on paid video ads",
      "Consistent visual identity and branding across all published videos",
      "Turnaround within 48 to 72 hours for continuous publishing",
    ],
    whyItMatters: [
      "Professional sound design and pacing separate amateur videos from high-performing ads.",
      "Subtitles guarantee messaging delivery even with sound muted.",
      "Frees founders and marketing leaders to focus on core business operations.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },

  "ai-video-editing": {
    slug: "ai-video-editing",
    title: "AI-Powered Video Editing",
    shortLabel: "AI Editing",
    description: "Automated silence removal, smart reframing, intelligent scene selection, and algorithmic enhancement to speed up creative delivery.",
    intro: "Combine human creative direction with AI editing acceleration. We use modern AI tools to automate tedious clipping, subtitle generation, and framing, delivering polished video assets faster.",
    image: "/og/services/ai-video-editing.jpg",
    heroImage: "/images/services/ai-video-editing.webp",
    points: [
      "Algorithmic silence removal and filler word elimination",
      "AI speaker detection and auto-reframing for vertical social formats",
      "Instant word-by-word synchronized animated captions",
      "Intelligent highlight reel generation from long-form recordings",
      "Voice cleanup, noise suppression & studio sound emulation",
    ],
    outcomes: [
      "50%+ faster creative delivery without sacrificing quality",
      "Repurpose 1 hour long podcasts into 10+ short-form viral clips",
      "Studio-grade audio clarity from standard desktop microphone recordings",
    ],
    whyItMatters: [
      "Maximizes the ROI of every long-form recording session.",
      "Rapid turnaround keeps your social channels consistently active.",
      "Cost-effective content repurposing for multi-platform distribution.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },

  "podcast-editing": {
    slug: "podcast-editing",
    title: "Podcast Audio & Video Editing",
    shortLabel: "Podcast",
    description: "Complete post-production for audio and video podcasts: multi-cam switching, audio mastering, intro/outro, and viral clip generation.",
    intro: "Launch and grow a standout podcast without spending hours in editing software. We handle multi-camera video cuts, audio mastering, show notes, and promotional social snippets end-to-end.",
    image: "/og/services/podcast-editing.jpg",
    heroImage: "/images/services/podcast-editing.webp",
    points: [
      "Multi-camera synchronized switching based on active speaker",
      "Broadcast-standard audio mastering (LUFS calibration & equalization)",
      "Branded intro, outro, lower-thirds & chapter marker integration",
      "Show notes, timestamp generation & episode summaries",
      "Micro-content clip extraction for YouTube Shorts & Reels",
    ],
    outcomes: [
      "Pristine, professional audio that meets Spotify and Apple Podcasts standards",
      "Ready-to-publish full episodes delivered on a predictable schedule",
      "Expanded episode reach through viral short-form social distribution",
    ],
    whyItMatters: [
      "Listeners abandon podcasts with poor audio quality immediately.",
      "Short clips on social media are the primary discovery engine for new listeners.",
      "Standardizes release schedules to build dedicated audience listening habits.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },

  "motion-graphics": {
    slug: "motion-graphics",
    title: "Motion Graphics & 2D/3D Animation",
    shortLabel: "Motion",
    description: "Custom animated explainers, 3D product renders, logo stings, and kinetic interface animations that elevate brand perception.",
    intro: "Illustrate complex concepts and showcase products with fluid motion graphics. We design animated brand assets and explainer sequences that simplify product mechanics and capture attention.",
    image: "/og/services/motion-graphics.jpg",
    heroImage: "/images/services/motion-graphics.webp",
    points: [
      "2D kinetic typography & infographic motion design",
      "3D product modeling, rendering & exploded view animations",
      "Custom branded logo animation & video stingers",
      "Interactive UI motion prototypes and product demo animations",
      "High-resolution vector animation for web and marketing campaigns",
    ],
    outcomes: [
      "Clear visual explanation of complex software or product features",
      "Premium brand perception that builds trust with high-value clients",
      "Engaging visual assets with high replay and shareability value",
    ],
    whyItMatters: [
      "Animation communicates product value faster than static imagery or text.",
      "Perfect for pre-launch products before physical production finishes.",
      "Elevates overall brand aesthetic across pitch decks, websites, and ads.",
    ],
    faqs: getFaqsForSlug("video-production"),
  },
}

export function getFallbackService(slug: string): Service | null {
  if (!slug) return null
  return FALLBACK_SERVICES[slug.toLowerCase().trim()] || null
}
