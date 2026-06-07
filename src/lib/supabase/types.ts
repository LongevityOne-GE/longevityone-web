/**
 * Supabase types matching the initial migration (20260501000000_initial_schema.sql).
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
        }
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
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
