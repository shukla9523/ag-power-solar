import { DEFAULT_IN_LANGUAGE, getEntityId, normalizeUrl } from "../config"
import { devWarn } from "../validate"

export interface BlogPostingTemplateOptions {
  pageUrl: string
  baseUrl: string
  headline: string
  description?: string
  image?: string
  authorName?: string
  /** When the author is a known Person node (e.g. the founder), reference it by @id. */
  authorId?: string
  datePublished?: string
  dateModified?: string
  articleSection?: string
  keywords?: string[]
  wordCount?: number
  isPartOf?: Record<string, any>
}

/**
 * Creates BlogPosting schema.
 * @id format: {pageUrl}#article
 * Publisher points to {baseUrl}/#organization
 * Author: a Person @id reference when authorId is given (founder), a named Person when only
 * authorName exists, otherwise a reference to the Organization.
 * Warns if headline exceeds 110 chars (never truncates silently).
 */
export function createBlogPostingSchema(options: BlogPostingTemplateOptions): Record<string, any> {
  const {
    pageUrl,
    baseUrl,
    headline,
    description,
    image,
    authorName,
    authorId,
    datePublished,
    dateModified,
    articleSection,
    keywords,
    wordCount,
    isPartOf,
  } = options

  if (headline && headline.length > 110) {
    devWarn(`Blog headline exceeds recommended 110 characters (${headline.length} chars): "${headline}"`)
  }

  const articleId = getEntityId(pageUrl, "#article")
  const webpageId = getEntityId(pageUrl, "#webpage")
  const orgId = getEntityId(baseUrl, "#organization")

  const authorNode: Record<string, any> = authorId
    ? { "@id": authorId }
    : authorName && authorName.trim()
      ? {
          "@type": "Person",
          name: authorName.trim(),
        }
      : { "@id": orgId }

  const articleNode: Record<string, any> = {
    "@type": "BlogPosting",
    "@id": articleId,
    headline,
    url: pageUrl,
    mainEntityOfPage: {
      "@id": webpageId,
    },
    author: authorNode,
    publisher: {
      "@id": orgId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }

  if (description && description.trim()) {
    articleNode.description = description.trim()
  }

  if (image && image.trim()) {
    articleNode.image = normalizeUrl(image, baseUrl)
  }

  if (datePublished && datePublished.trim()) {
    articleNode.datePublished = datePublished.trim()
  }

  if (dateModified && dateModified.trim()) {
    articleNode.dateModified = dateModified.trim()
  }

  if (articleSection && articleSection.trim()) {
    articleNode.articleSection = articleSection.trim()
  }

  if (keywords && keywords.length > 0) {
    const cleanKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      articleNode.keywords = cleanKeywords.join(", ")
    }
  }

  if (wordCount !== undefined && wordCount > 0) {
    articleNode.wordCount = wordCount
  }

  if (isPartOf) {
    articleNode.isPartOf = isPartOf
  }

  return articleNode
}
