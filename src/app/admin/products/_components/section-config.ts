/**
 * Purpose: describes the admin form for every editable product section (EDITZ, Blog AI):
 * which fields exist, how they are edited (text, textarea, toggle, lists) and their labels.
 * Keys must match the Zod schemas in src/lib/validation/product-pages.ts.
 */

import type { ProductSlug } from "@lib/validation/product-pages"

export type ScalarField = { key: string; label: string; kind: "text" | "textarea"; hint?: string }
export type BooleanField = { key: string; label: string; kind: "boolean"; hint?: string }
export type StringListField = { key: string; label: string; kind: "stringList"; itemLabel: string; hint?: string }
export type ObjectListField = {
  key: string
  label: string
  kind: "objectList"
  itemLabel: string
  /** Field shown as the item's title in the list header. */
  titleKey: string
  fields: ScalarField[]
  hint?: string
}
export type FieldDef = ScalarField | BooleanField | StringListField | ObjectListField

export type SectionDef = { key: string; label: string; description?: string; fields: FieldDef[] }

const LINE_BREAK_HINT = "Press Enter to start a new line where the heading breaks on desktop."
const MEDIA_HINT = "A site path such as /video1.mp4 or a full https:// URL."
const LINK_HINT = "A path (/contact), an anchor (#contact), https://, mailto: or tel: link."

const text = (key: string, label: string, hint?: string): ScalarField => ({ key, label, kind: "text", hint })
const area = (key: string, label: string, hint?: string): ScalarField => ({ key, label, kind: "textarea", hint })

const EDITZ_EDITORS: SectionDef[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Top of the page: status badge, headline, subtitle, button and the three video cards.",
    fields: [
      text("badge", "Status badge"),
      text("headlineAccent", "Headline — highlighted words (red)"),
      area("headline", "Headline — rest", LINE_BREAK_HINT),
      area("subtitle", "Subtitle"),
      text("ctaLabel", "Button label"),
      text("ctaHref", "Button link", LINK_HINT),
      {
        key: "videos",
        label: "Video cards (max 3)",
        kind: "objectList",
        itemLabel: "Video",
        titleKey: "videoUrl",
        fields: [text("videoUrl", "Video file", MEDIA_HINT), text("image", "Poster image", MEDIA_HINT)],
      },
    ],
  },
  {
    key: "marquee",
    label: "Hero ticker",
    description: "The scrolling pill under the hero video cards.",
    fields: [{ key: "items", label: "Ticker items", kind: "stringList", itemLabel: "Item" }],
  },
  {
    key: "services",
    label: "Services",
    fields: [
      text("badge", "Section badge"),
      text("heading", "Heading"),
      {
        key: "items",
        label: "Service cards",
        kind: "objectList",
        itemLabel: "Service",
        titleKey: "title",
        fields: [text("title", "Title"), area("description", "Description")],
        hint: "Card icons follow the order (film, video, megaphone, lightbulb).",
      },
    ],
  },
  {
    key: "brands",
    label: "Brand logos",
    description: "Logo strip under Services (also shown on the home page).",
    fields: [
      text("heading", "Label"),
      {
        key: "logos",
        label: "Logos",
        kind: "objectList",
        itemLabel: "Logo",
        titleKey: "name",
        fields: [text("name", "Brand name (alt text)"), text("src", "Logo image", MEDIA_HINT)],
      },
    ],
  },
  {
    key: "benefits",
    label: "Benefits",
    description: "The bento grid. Layout, chart bars, clock and avatars stay fixed; the texts are editable.",
    fields: [
      text("badge", "Section badge"),
      area("heading", "Heading", LINE_BREAK_HINT),
      area("chartTitle", "Chart card — title", LINE_BREAK_HINT),
      text("chartChip1", "Chart card — first stat"),
      text("chartChip2", "Chart card — second stat"),
      text("chartHighlight", "Chart card — highlighted bar label"),
      text("turnaroundTitle", "Turnaround card — title"),
      area("turnaroundDescription", "Turnaround card — text"),
      text("videoUrl", "Video card — video file", MEDIA_HINT),
      text("videoTitle", "Video card — title"),
      area("platformTitle", "Platforms card — title", LINE_BREAK_HINT),
      area("platformDescription", "Platforms card — text"),
      area("trustedTitle", "Trusted-by card — title", LINE_BREAK_HINT),
      text("revisionsTitle", "Revisions card — title"),
      area("revisionsDescription", "Revisions card — text"),
    ],
  },
  {
    key: "projects",
    label: "Projects",
    fields: [
      text("badge", "Section badge"),
      text("heading", "Heading"),
      {
        key: "items",
        label: "Project cards (max 6)",
        kind: "objectList",
        itemLabel: "Project",
        titleKey: "title",
        fields: [
          text("title", "Title (shown in the video popup)"),
          text("handle", "Handle"),
          text("views", "Views"),
          text("metric", "Result"),
          text("videoUrl", "Video file (optional)", MEDIA_HINT),
          text("thumbnail", "Thumbnail image", MEDIA_HINT),
        ],
      },
    ],
  },
  {
    key: "audience",
    label: "Who it's for",
    fields: [
      text("badge", "Section badge"),
      area("heading", "Heading", LINE_BREAK_HINT),
      {
        key: "items",
        label: "Audience cards",
        kind: "objectList",
        itemLabel: "Card",
        titleKey: "title",
        fields: [text("title", "Title"), area("description", "Description"), text("image", "Image", MEDIA_HINT)],
      },
    ],
  },
  {
    key: "process",
    label: "Process",
    fields: [
      text("badge", "Section badge"),
      text("heading", "Heading"),
      {
        key: "steps",
        label: "Steps",
        kind: "objectList",
        itemLabel: "Step",
        titleKey: "title",
        fields: [text("number", "Step number"), text("title", "Title"), area("description", "Description")],
      },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    fields: [
      text("badge", "Section badge"),
      area("heading", "Heading", LINE_BREAK_HINT),
      {
        key: "items",
        label: "Testimonials",
        kind: "objectList",
        itemLabel: "Testimonial",
        titleKey: "author",
        fields: [
          area("quote", "Quote"),
          text("author", "Name"),
          text("role", "Role"),
          text("company", "Company / audience"),
          text("metric", "Result pill"),
          text("avatar", "Photo", MEDIA_HINT),
        ],
      },
    ],
  },
  {
    key: "cta",
    label: "Final call to action",
    fields: [
      text("headingAccent", "Heading — highlighted word (red)"),
      text("heading", "Heading — rest"),
      area("description", "Text"),
      text("buttonLabel", "Button label"),
      text("buttonHref", "Button link", LINK_HINT),
      text("instagramUrl", "Instagram link"),
      text("youtubeUrl", "YouTube link"),
      text("tiktokUrl", "TikTok link"),
    ],
  },
]

const BLOG_AI_EDITORS: SectionDef[] = [
  {
    key: "hero",
    label: "Hero",
    fields: [
      text("badge", "Badge"),
      text("titlePrefix", "Title"),
      text("titleAccent", "Title — gradient word"),
      area("description", "Description"),
      text("ctaLabel", "Button label"),
      text("ctaHref", "Button link", LINK_HINT),
    ],
  },
  {
    key: "leadForm",
    label: "Lead form",
    description: "Optional contact form under the hero. Leads arrive in the inbox with source “blog-ai”. Off by default.",
    fields: [
      { key: "enabled", label: "Show the lead form on /blog-ai", kind: "boolean" },
      text("heading", "Heading (optional)"),
      area("description", "Text (optional)"),
    ],
  },
]

export const PRODUCT_EDITORS: Record<ProductSlug, SectionDef[]> = {
  editz: EDITZ_EDITORS,
  "blog-ai": BLOG_AI_EDITORS,
}

export const PRODUCT_TABS: { slug: ProductSlug; label: string }[] = [
  { slug: "editz", label: "EDITZ" },
  { slug: "blog-ai", label: "Blog AI" },
]
