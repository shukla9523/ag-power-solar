export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppRole = 'owner' | 'editor'

export interface Profile {
  id: string
  email: string
  role: AppRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface SiteSetting {
  id: string
  site_name: string
  legal_name?: string | null
  tagline?: string | null
  base_url: string
  logo_url: string | null
  default_og_image: string | null
  timezone: string
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  google_maps_url?: string | null
  instagram_url?: string | null
  linkedin_url?: string | null
  facebook_url?: string | null
  youtube_url?: string | null
  twitter_url?: string | null
  updated_at: string
}

export type ContentStatus = 'draft' | 'published'

export interface FAQItem {
  question: string
  answer: string
}

export interface ContentEntity {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  status: ContentStatus
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  primary_keyword: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  faq: FAQItem[] | Json
  custom_json_ld: Record<string, unknown> | Json
  created_at: string
  updated_at: string
}

export type PageRow = ContentEntity
export type BlogPostRow = ContentEntity
export type ServiceRow = ContentEntity
export type CaseStudyRow = ContentEntity

export type LeadStatus = 'new' | 'contacted' | 'closed'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source_page: string | null
  status: LeadStatus
  is_read: boolean
  notes: string | null
  created_at: string
}

export interface SeoAudit {
  id: string
  average_score: number
  total_pages: number
  total_errors: number
  total_warnings: number
  created_at: string
}

export interface SeoIssue {
  id: string
  audit_id: string
  page_path: string
  issue_type: string
  severity: 'error' | 'warning' | 'info'
  message: string
  fix_url: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
      site_settings: {
        Row: SiteSetting
        Insert: Omit<SiteSetting, 'id' | 'updated_at'> & { id?: string; updated_at?: string }
        Update: Partial<Omit<SiteSetting, 'id'>>
      }
      pages: {
        Row: PageRow
        Insert: Omit<PageRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<PageRow, 'id'>>
      }
      blog_posts: {
        Row: BlogPostRow
        Insert: Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<BlogPostRow, 'id'>>
      }
      services: {
        Row: ServiceRow
        Insert: Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<ServiceRow, 'id'>>
      }
      case_studies: {
        Row: CaseStudyRow
        Insert: Omit<CaseStudyRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<CaseStudyRow, 'id'>>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Lead, 'id'>>
      }
      seo_audits: {
        Row: SeoAudit
        Insert: Omit<SeoAudit, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<SeoAudit, 'id'>>
      }
      seo_issues: {
        Row: SeoIssue
        Insert: Omit<SeoIssue, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<SeoIssue, 'id'>>
      }
    }
    Views: Record<string, never>
    Functions: {
      get_auth_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_owner: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: AppRole
      content_status: ContentStatus
      lead_status: LeadStatus
    }
  }
}
