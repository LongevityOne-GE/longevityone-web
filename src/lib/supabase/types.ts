/**
 * Supabase types matching the migrations in supabase/migrations/
 * (through 20260912020000_lead_status_and_notes.sql).
 * Regenerate after schema changes:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 */

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
      founder_circle_leads: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          lang: string
          consent: boolean
          source: string | null
          created_at: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          gclid: string | null
          fbclid: string | null
          landing_page: string | null
          referrer: string | null
          form_type: string
          last_utm_source: string | null
          last_utm_medium: string | null
          last_utm_campaign: string | null
          last_utm_content: string | null
          last_utm_term: string | null
          last_gclid: string | null
          last_fbclid: string | null
          last_landing_page: string | null
          last_referrer: string | null
          touch_count: number | null
          status: string
          notes: string | null
          status_updated_at: string | null
          submitted_from: string | null
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          lang?: string
          consent?: boolean
          source?: string | null
          created_at?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          gclid?: string | null
          fbclid?: string | null
          landing_page?: string | null
          referrer?: string | null
          form_type?: string
          last_utm_source?: string | null
          last_utm_medium?: string | null
          last_utm_campaign?: string | null
          last_utm_content?: string | null
          last_utm_term?: string | null
          last_gclid?: string | null
          last_fbclid?: string | null
          last_landing_page?: string | null
          last_referrer?: string | null
          touch_count?: number | null
          status?: string
          notes?: string | null
          status_updated_at?: string | null
          submitted_from?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          lang?: string
          consent?: boolean
          source?: string | null
          created_at?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          gclid?: string | null
          fbclid?: string | null
          landing_page?: string | null
          referrer?: string | null
          form_type?: string
          last_utm_source?: string | null
          last_utm_medium?: string | null
          last_utm_campaign?: string | null
          last_utm_content?: string | null
          last_utm_term?: string | null
          last_gclid?: string | null
          last_fbclid?: string | null
          last_landing_page?: string | null
          last_referrer?: string | null
          touch_count?: number | null
          status?: string
          notes?: string | null
          status_updated_at?: string | null
          submitted_from?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          auth_user_id: string | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
        }
        Relationships: []
      }
      consent_log: {
        Row: {
          id: string
          patient_id: string
          consent_type: string
          consented: boolean
          consented_at: string
          ip_address: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          patient_id: string
          consent_type: string
          consented: boolean
          consented_at?: string
          ip_address?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          patient_id?: string
          consent_type?: string
          consented?: boolean
          consented_at?: string
          ip_address?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          id: string
          patient_id: string
          assessment_type: string
          score: number | null
          notes: string | null
          conducted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          assessment_type: string
          score?: number | null
          notes?: string | null
          conducted_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          assessment_type?: string
          score?: number | null
          notes?: string | null
          conducted_at?: string
          created_at?: string
        }
        Relationships: []
      }
      biomarker_readings: {
        Row: {
          id: string
          patient_id: string
          biomarker: string
          value: number
          unit: string
          reference_low: number | null
          reference_high: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          biomarker: string
          value: number
          unit: string
          reference_low?: number | null
          reference_high?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          biomarker?: string
          value?: number
          unit?: string
          reference_low?: number | null
          reference_high?: number | null
          recorded_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
