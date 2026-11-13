export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      body_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          notes: string | null
          updated_at: string
          user_id: string
          waist_cm: number
          water_ml: number
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          waist_cm?: number
          water_ml?: number
          weight_kg?: number
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          waist_cm?: number
          water_ml?: number
          weight_kg?: number
        }
        Relationships: []
      }
      card_expenses: {
        Row: {
          amount: number
          card_id: string | null
          category: string
          created_at: string
          description: string
          expense_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          card_id?: string | null
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          card_id?: string | null
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_expenses_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          bank: string
          created_at: string
          current_invoice: number
          due_day: number
          id: string
          limit_amount: number
          nickname: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank?: string
          created_at?: string
          current_invoice?: number
          due_day?: number
          id?: string
          limit_amount?: number
          nickname?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank?: string
          created_at?: string
          current_invoice?: number
          due_day?: number
          id?: string
          limit_amount?: number
          nickname?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          day: number
          end_hour: number
          id: string
          start_hour: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          day?: number
          end_hour?: number
          id?: string
          start_hour?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          day?: number
          end_hour?: number
          id?: string
          start_hour?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          category: string
          created_at: string
          deadline: string | null
          id: string
          image_url: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          deadline?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          deadline?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          area: string
          created_at: string
          description: string
          due: string
          id: string
          priority: string
          progress: number
          status: string
          tasks: Json
          title: string
          updated_at: string
          user_id: string
          vision: string
        }
        Insert: {
          area?: string
          created_at?: string
          description?: string
          due?: string
          id?: string
          priority?: string
          progress?: number
          status?: string
          tasks?: Json
          title: string
          updated_at?: string
          user_id: string
          vision?: string
        }
        Update: {
          area?: string
          created_at?: string
          description?: string
          due?: string
          id?: string
          priority?: string
          progress?: number
          status?: string
          tasks?: Json
          title?: string
          updated_at?: string
          user_id?: string
          vision?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          area: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          area?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          broker: string | null
          category: string
          created_at: string
          id: string
          name: string
          return_pct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          broker?: string | null
          category?: string
          created_at?: string
          id?: string
          name?: string
          return_pct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          broker?: string | null
          category?: string
          created_at?: string
          id?: string
          name?: string
          return_pct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          energy: number
          entry_date: string
          gratitude: string
          highlight: string
          id: string
          learning: string
          linked_goal: string | null
          mood: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy?: number
          entry_date?: string
          gratitude?: string
          highlight?: string
          id?: string
          learning?: string
          linked_goal?: string | null
          mood?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy?: number
          entry_date?: string
          gratitude?: string
          highlight?: string
          id?: string
          learning?: string
          linked_goal?: string | null
          mood?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_items: {
        Row: {
          collection: string
          created_at: string
          id: string
          note: string
          tags: string[]
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection?: string
          created_at?: string
          id?: string
          note?: string
          tags?: string[]
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection?: string
          created_at?: string
          id?: string
          note?: string
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number
          created_at: string
          goal: string
          id: string
          meal_type: string
          name: string
          notes: string | null
          protein: number
          updated_at: string
          user_id: string
          weekday: string
        }
        Insert: {
          calories?: number
          created_at?: string
          goal?: string
          id?: string
          meal_type?: string
          name?: string
          notes?: string | null
          protein?: number
          updated_at?: string
          user_id: string
          weekday?: string
        }
        Update: {
          calories?: number
          created_at?: string
          goal?: string
          id?: string
          meal_type?: string
          name?: string
          notes?: string | null
          protein?: number
          updated_at?: string
          user_id?: string
          weekday?: string
        }
        Relationships: []
      }
      news_topics: {
        Row: {
          created_at: string
          id: string
          sector: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sector?: string
          topic?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sector?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          body: string
          created_at: string
          favorite: boolean
          folder: string
          id: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          favorite?: boolean
          folder?: string
          id?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          favorite?: boolean
          folder?: string
          id?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          person: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          person?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          person?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayers: {
        Row: {
          body: string | null
          category: string
          created_at: string
          favorite: boolean
          id: string
          minutes: number
          period: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          favorite?: boolean
          id?: string
          minutes?: number
          period?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          favorite?: boolean
          id?: string
          minutes?: number
          period?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          handle: string | null
          id: string
          onboarding_status: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          handle?: string | null
          id: string
          onboarding_status?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          handle?: string | null
          id?: string
          onboarding_status?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_news: {
        Row: {
          created_at: string
          favorite: boolean
          id: string
          source: string | null
          summary: string | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite?: boolean
          id?: string
          source?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          favorite?: boolean
          id?: string
          source?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          category: string
          created_at: string
          done: boolean
          id: string
          name: string
          quantity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          done?: boolean
          id?: string
          name?: string
          quantity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          done?: boolean
          id?: string
          name?: string
          quantity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          category: string
          created_at: string
          goal: string | null
          hours_done: number
          hours_target: number
          id: string
          material: string | null
          progress: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          goal?: string | null
          hours_done?: number
          hours_target?: number
          id?: string
          material?: string | null
          progress?: number
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          goal?: string | null
          hours_done?: number
          hours_target?: number
          id?: string
          material?: string | null
          progress?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          cities: string[]
          code: string
          country: string
          created_at: string
          dates: string
          id: string
          memory: string
          rating: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cities?: string[]
          code?: string
          country: string
          created_at?: string
          dates?: string
          id?: string
          memory?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cities?: string[]
          code?: string
          country?: string
          created_at?: string
          dates?: string
          id?: string
          memory?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vision_items: {
        Row: {
          category: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          image_url: string | null
          progress: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress?: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          done: boolean
          duration_min: number
          id: string
          load_kg: number
          modality: string
          name: string
          performance: string | null
          updated_at: string
          user_id: string
          weekday: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          duration_min?: number
          id?: string
          load_kg?: number
          modality?: string
          name?: string
          performance?: string | null
          updated_at?: string
          user_id: string
          weekday?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          duration_min?: number
          id?: string
          load_kg?: number
          modality?: string
          name?: string
          performance?: string | null
          updated_at?: string
          user_id?: string
          weekday?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
