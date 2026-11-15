/**
 * Purpose: code defaults for every editable EDITZ section — exactly the content the /editz
 * page rendered before it became editable. Admin overrides (product_pages.content) replace
 * a section; anything not overridden falls back to these values. Line breaks in headings
 * are written as "\n" and rendered with renderLines() (see ./lines.tsx).
 */

import type { EditzContent } from "@lib/validation/product-pages"
import { MARQUEE_ITEMS, PROJECTS, SERVICES, TESTIMONIALS } from "./data"

export const EDITZ_DEFAULTS: EditzContent = {
  hero: {
    badge: "Accepting New Projects",
    headlineAccent: "Video Editing",
    headline: "Built for\nGrowth & Performance",
    subtitle:
      "Helping creators and brands grow through strategic video editing, strong retention storytelling, and high-impact content.",
    ctaLabel: "Let's Grow Your Content",
    ctaHref: "/editz/contact",
    videos: [
      {
        videoUrl: "/video1.mp4",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      },
      {
        videoUrl: "/video2.mp4",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
      {
        videoUrl: "/video3.mp4",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  marquee: { items: [...MARQUEE_ITEMS] },
  services: {
    badge: "Services",
    heading: "How we help you grow",
    items: SERVICES.map((s) => ({ title: s.title, description: s.description })),
  },
  brands: {
    heading: "BRANDS WE HELP GROW",
    logos: [
      { name: "Jalvayu", src: "/logo1.webp" },
      { name: "MLA", src: "/logo2.webp" },
      { name: "Altie Reality", src: "/logo3.webp" },
      { name: "Electro Global", src: "/logo4.webp" },
      { name: "Poodles", src: "/logo5.webp" },
      { name: "Brand 6", src: "/logo6.webp" },
      { name: "Brand 7", src: "/logo7.webp" },
      { name: "Brand 8", src: "/logo8.webp" },
    ],
  },
  benefits: {
    badge: "Benefits",
    heading: "Why we're the smart\nchoice for growth",
    chartTitle: "Content Built to Drive\nResults That Matter",
    chartChip1: "Avg Watch Time 32%",
    chartChip2: "Engagement Rate 45%",
    chartHighlight: "$350K",
    turnaroundTitle: "Quick Turnaround",
    turnaroundDescription: "Fast and reliable delivery, usually within just 24–48 hours.",
    videoUrl: "/video4.mp4",
    videoTitle: "Professional, High-Quality Edits",
    platformTitle: "Optimized for Every\nPlatform, Every Format",
    platformDescription: "Every video is adapted to fit platform, format, and audience it's made.",
    trustedTitle: "Trusted by 100+\nCreators & Brands",
    revisionsTitle: "Unlimited Revisions",
    revisionsDescription: "Every detail is carefully refined to ensure your video meets expectations.",
  },
  projects: {
    badge: "Projects",
    heading: "Results our clients love",
    items: PROJECTS.slice(0, 6).map((p) => ({
      title: p.title,
      handle: p.handle,
      views: p.views,
      metric: p.metric,
      videoUrl: p.videoUrl ?? "",
      thumbnail: p.thumbnail,
    })),
  },
  audience: {
    badge: "Who It's For",
    heading: "Built for those who want\ntheir content to perform",
    items: [
      { title: "Content Creators", description: "Short-form and long-form creators making regular video content.", image: "/aud1.webp" },
      { title: "YouTubers & Podcasters", description: "Creators focused on clear structure, pacing, and viewer retention.", image: "/aud2.webp" },
      { title: "Short-Form Specialists", description: "Creators producing high-volume videos for Reels, Shorts, and feeds.", image: "/aud3.webp" },
      { title: "Personal Brands", description: "Individuals using video to build trust, authority, and online presence.", image: "/aud4.webp" },
    ],
  },
  process: {
    badge: "Process",
    heading: "Our simple process",
    steps: [
      {
        number: "01",
        title: "Share Your Footage",
        description: "Send your raw files, references, and goals. We align on style, platform, and expectations before editing.",
      },
      {
        number: "02",
        title: "Edit, Review & Refine",
        description: "We craft the first cut and refine it using your feedback until every single frame feels right.",
      },
      {
        number: "03",
        title: "Deliver & Track Results",
        description: "Final videos are delivered fully optimized for your target platform to maximize retention and growth.",
      },
    ],
  },
  testimonials: {
    badge: "Testimonials",
    heading: "Trusted by creators & brands\ndriving real growth",
    items: TESTIMONIALS.map((t) => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
      metric: t.metric,
      avatar: t.avatar,
    })),
  },
  cta: {
    headingAccent: "Content",
    heading: "Starts Here",
    description: "Bring your footage or ideas, we'll craft videos that look better, engage viewers, and support your growth.",
    buttonLabel: "Let's Grow Your Content",
    buttonHref: "mailto:contact@agpower.in",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
    tiktokUrl: "https://tiktok.com",
  },
}
