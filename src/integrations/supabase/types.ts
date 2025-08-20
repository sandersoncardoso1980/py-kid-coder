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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          points: number | null
          title: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          points?: number | null
          title: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          points?: number | null
          title?: string
        }
        Relationships: []
      }
      library_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          thumbnail_url: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          birth_date: string | null
          created_at: string | null
          current_streak: number | null
          exercises_completed: number | null
          full_name: string
          id: string
          lessons_completed: number | null
          level: string | null
          points: number | null
          school_grade: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          current_streak?: number | null
          exercises_completed?: number | null
          full_name?: string
          id: string
          lessons_completed?: number | null
          level?: string | null
          points?: number | null
          school_grade?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          current_streak?: number | null
          exercises_completed?: number | null
          full_name?: string
          id?: string
          lessons_completed?: number | null
          level?: string | null
          points?: number | null
          school_grade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_exercise_answers: {
        Row: {
          answer: string | null
          completed_at: string | null
          exercise_id: string
          id: string
          is_correct: boolean | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          completed_at?: string | null
          exercise_id: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          answer?: string | null
          completed_at?: string | null
          exercise_id?: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_answers_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library_progress: {
        Row: {
          completed: boolean | null
          id: string
          last_accessed: string | null
          library_item_id: string
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          id?: string
          last_accessed?: string | null
          library_item_id: string
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          id?: string
          last_accessed?: string | null
          library_item_id?: string
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_progress_library_item_id_fkey"
            columns: ["library_item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
        ]
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
