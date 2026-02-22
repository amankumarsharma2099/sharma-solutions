export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          service_id: string | null;
          service_name: string | null;
          status: "pending" | "processing" | "completed";
          price: number | null;
          document_urls: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id?: string | null;
          service_name?: string | null;
          status?: "pending" | "processing" | "completed";
          price?: number | null;
          document_urls?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string | null;
          service_name?: string | null;
          status?: "pending" | "processing" | "completed";
          price?: number | null;
          document_urls?: string[];
          created_at?: string;
        };
      };
    };
  };
}

export type UserProfile = Database["public"]["Tables"]["users"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderStatus = Order["status"];
