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
      profiles: {
        Row: {
          id: string
          interests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          interests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          interests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 