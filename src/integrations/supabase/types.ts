export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          category_ids: string[] | null
          contact_info: string | null
          created_at: string
          date: string | null
          description: string | null
          enabled: boolean | null
          id: number
          image: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          map_link: string | null
          price_range: string | null
          section_type: string | null
          tags: string[] | null
          time: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category_ids?: string[] | null
          contact_info?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: number
          image?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          map_link?: string | null
          price_range?: string | null
          section_type?: string | null
          tags?: string[] | null
          time?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category_ids?: string[] | null
          contact_info?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: number
          image?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          map_link?: string | null
          price_range?: string | null
          section_type?: string | null
          tags?: string[] | null
          time?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email_or_phone: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email_or_phone: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email_or_phone?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          phone?: string | null
        }
        Relationships: []
      }
      date_packages: {
        Row: {
          id: string
          title: string
          area: string | null
          description: string | null
          estimated_cost: number | null
          duration_minutes: number | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          area?: string | null
          description?: string | null
          estimated_cost?: number | null
          duration_minutes?: number | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          area?: string | null
          description?: string | null
          estimated_cost?: number | null
          duration_minutes?: number | null
          image?: string | null
          created_at?: string
        }
        Relationships: []
      }
      outing_packages: {
        Row: {
          id: string
          title: string
          category: string | null
          area: string | null
          description: string | null
          duration_minutes: number | null
          estimated_cost: number | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: string | null
          area?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_cost?: number | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string | null
          area?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_cost?: number | null
          image?: string | null
          created_at?: string
        }
        Relationships: []
      }
      package_stops: {
        Row: {
          id: string
          package_id: string
          package_type: Database["public"]["Enums"]["package_type_enum"]
          stop_order: number
          place_name: string
          latitude: number | null
          longitude: number | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          package_type: Database["public"]["Enums"]["package_type_enum"]
          stop_order: number
          place_name: string
          latitude?: number | null
          longitude?: number | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          package_type?: Database["public"]["Enums"]["package_type_enum"]
          stop_order?: number
          place_name?: string
          latitude?: number | null
          longitude?: number | null
          category?: string | null
          created_at?: string
        }
        Relationships: []
      }
      food_places: {
        Row: {
          id: string
          name: string
          area: string | null
          category: string | null
          rating: number | null
          price_range: string | null
          description: string | null
          latitude: number | null
          longitude: number | null
          image: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          area?: string | null
          category?: string | null
          rating?: number | null
          price_range?: string | null
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          image?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          area?: string | null
          category?: string | null
          rating?: number | null
          price_range?: string | null
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          image?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      meetups: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string | null
          latitude: number | null
          longitude: number | null
          date_time: string
          host_user_id: string | null
          max_people: number | null
          category: string | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          date_time: string
          host_user_id?: string | null
          max_people?: number | null
          category?: string | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          date_time?: string
          host_user_id?: string | null
          max_people?: number | null
          category?: string | null
          image?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetups_host_user_id_fkey"
            columns: ["host_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meetup_participants: {
        Row: {
          id: string
          meetup_id: string
          user_id: string
          status: Database["public"]["Enums"]["participant_status_enum"]
          created_at: string
        }
        Insert: {
          id?: string
          meetup_id: string
          user_id: string
          status?: Database["public"]["Enums"]["participant_status_enum"]
          created_at?: string
        }
        Update: {
          id?: string
          meetup_id?: string
          user_id?: string
          status?: Database["public"]["Enums"]["participant_status_enum"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_participants_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          }
        ]
      }
      connections: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          status: Database["public"]["Enums"]["connection_status_enum"]
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          status?: Database["public"]["Enums"]["connection_status_enum"]
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          status?: Database["public"]["Enums"]["connection_status_enum"]
          created_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          salary: string | null
          location: string | null
          description: string | null
          contact: string | null
          type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          salary?: string | null
          location?: string | null
          description?: string | null
          contact?: string | null
          type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          salary?: string | null
          location?: string | null
          description?: string | null
          contact?: string | null
          type?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ride_routes: {
        Row: {
          id: string
          source: string
          destination: string
          provider: string
          average_price: number | null
          deep_link: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          source: string
          destination: string
          provider: string
          average_price?: number | null
          deep_link?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          source?: string
          destination?: string
          provider?: string
          average_price?: number | null
          deep_link?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          id: number
          title: string | null
          image_url: string
          link_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          title?: string | null
          image_url: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          title?: string | null
          image_url?: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_meetup_participant_count: {
        Args: {
          meetup_uuid: string
        }
        Returns: number
      }
      is_meetup_full: {
        Args: {
          meetup_uuid: string
        }
        Returns: boolean
      }
      get_mutual_connections_count: {
        Args: {
          user1: string
          user2: string
        }
        Returns: number
      }
      verify_admin_credentials: {
        Args: {
          p_username: string
          p_password: string
        }
        Returns: {
          success: boolean
          message: string
          admin_id?: string
          username?: string
        }
      }
      create_admin_user: {
        Args: {
          p_username: string
          p_password: string
          p_email?: string
        }
        Returns: {
          success: boolean
          message: string
          admin_id?: string
        }
      }
      change_admin_password: {
        Args: {
          p_username: string
          p_old_password: string
          p_new_password: string
        }
        Returns: {
          success: boolean
          message: string
        }
      }
      admin_create_activity: {
        Args: {
          p_admin_id: string
          p_title: string
          p_description?: string | null
          p_image?: string | null
          p_price_range?: string | null
          p_location?: string | null
          p_date?: string | null
          p_time?: string | null
          p_map_link?: string | null
          p_contact_info?: string | null
          p_url?: string | null
          p_category_ids?: string[]
          p_tags?: string[]
          p_section_type?: string
          p_enabled?: boolean
        }
        Returns: {
          success: boolean
          message: string
          activity_id?: number
        }
      }
      admin_update_activity: {
        Args: {
          p_admin_id: string
          p_activity_id: number
          p_title?: string | null
          p_description?: string | null
          p_image?: string | null
          p_price_range?: string | null
          p_location?: string | null
          p_date?: string | null
          p_time?: string | null
          p_map_link?: string | null
          p_contact_info?: string | null
          p_url?: string | null
          p_category_ids?: string[] | null
          p_tags?: string[] | null
          p_section_type?: string | null
          p_enabled?: boolean | null
        }
        Returns: {
          success: boolean
          message: string
        }
      }
      admin_delete_activity: {
        Args: {
          p_admin_id: string
          p_activity_id: number
        }
        Returns: {
          success: boolean
          message: string
        }
      }
      is_valid_admin_session: {
        Args: {
          p_admin_id: string
        }
        Returns: boolean
      }
      admin_list_trending: {
        Args: Record<PropertyKey, never>
        Returns: {
          trending_id: number
          display_order: number
          added_at: string
          activity_id: number
          title: string
          image: string | null
          location: string | null
          price_range: string | null
          date: string | null
          url: string | null
        }[]
      }
      admin_add_trending: {
        Args: {
          p_activity_id: number
          p_admin_id: string
          p_order?: number
        }
        Returns: undefined
      }
      admin_remove_trending: {
        Args: {
          p_activity_id: number
          p_admin_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      package_type_enum: "date" | "outing"
      participant_status_enum: "joined" | "pending" | "cancelled"
      connection_status_enum: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      package_type_enum: ["date", "outing"] as const,
      participant_status_enum: ["joined", "pending", "cancelled"] as const,
      connection_status_enum: ["pending", "accepted", "rejected"] as const,
    },
  },
} as const
