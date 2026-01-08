export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string
          user_id: string | null
          slug: string
          name: string
          avatar_url: string | null
          country: string | null
          city: string | null
          lat: number | null
          lng: number | null
          primary_signal: string | null
          signals: string[]
          content_formats: string[]
          trajectory: string | null
          no_conference_circuit: boolean
          editorial_reason: string | null
          x_handle: string | null
          kaito_id: string | null
          website_url: string | null
          is_claimed: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          slug: string
          name: string
          avatar_url?: string | null
          country?: string | null
          city?: string | null
          lat?: number | null
          lng?: number | null
          primary_signal?: string | null
          signals?: string[]
          content_formats?: string[]
          trajectory?: string | null
          no_conference_circuit?: boolean
          editorial_reason?: string | null
          x_handle?: string | null
          kaito_id?: string | null
          website_url?: string | null
          is_claimed?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          slug?: string
          name?: string
          avatar_url?: string | null
          country?: string | null
          city?: string | null
          lat?: number | null
          lng?: number | null
          primary_signal?: string | null
          signals?: string[]
          content_formats?: string[]
          trajectory?: string | null
          no_conference_circuit?: boolean
          editorial_reason?: string | null
          x_handle?: string | null
          kaito_id?: string | null
          website_url?: string | null
          is_claimed?: boolean
          is_published?: boolean
          updated_at?: string
        }
      }
      artifacts: {
        Row: {
          id: string
          creator_id: string
          type: 'youtube' | 'x' | 'github' | 'substack' | 'website' | 'talk' | 'podcast' | 'article'
          title: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          type: 'youtube' | 'x' | 'github' | 'substack' | 'website' | 'talk' | 'podcast' | 'article'
          title: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          type?: 'youtube' | 'x' | 'github' | 'substack' | 'website' | 'talk' | 'podcast' | 'article'
          title?: string
          url?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          creator_id: string
          recommender_name: string
          context: string
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          recommender_name: string
          context: string
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          recommender_name?: string
          context?: string
        }
      }
      submissions: {
        Row: {
          id: string
          submitter_id: string | null
          data: Json
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          submitter_id?: string | null
          data: Json
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          submitter_id?: string | null
          data?: Json
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          reviewed_at?: string | null
        }
      }
      bookmarks: {
        Row: {
          user_id: string
          creator_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          creator_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          creator_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          x_handle: string | null
          kaito_id: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          x_handle?: string | null
          kaito_id?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          x_handle?: string | null
          kaito_id?: string | null
          is_admin?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

