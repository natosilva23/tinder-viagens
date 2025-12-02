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
          email: string
          name: string
          age: number
          bio: string | null
          photo_url: string | null
          languages: string[]
          interests: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          age: number
          bio?: string | null
          photo_url?: string | null
          languages?: string[]
          interests?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          age?: number
          bio?: string | null
          photo_url?: string | null
          languages?: string[]
          interests?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          destination: string
          destination_country: string
          start_date: string
          end_date: string
          travel_style: string[]
          interests: string[]
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination: string
          destination_country: string
          start_date: string
          end_date: string
          travel_style?: string[]
          interests?: string[]
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          destination?: string
          destination_country?: string
          start_date?: string
          end_date?: string
          travel_style?: string[]
          interests?: string[]
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      swipes: {
        Row: {
          id: string
          user_id: string
          target_user_id: string
          trip_id: string
          action: 'like' | 'pass'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_user_id: string
          trip_id: string
          action: 'like' | 'pass'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_user_id?: string
          trip_id?: string
          action?: 'like' | 'pass'
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          trip_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          trip_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          trip_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
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
