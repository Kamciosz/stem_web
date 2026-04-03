/* =============================================================================
 * Database Types for Supabase
 * Auto-generated types should eventually replace this file.
 * For now, these are manually defined based on the schema.
 * =========================================================================== */

export type Category = "robotyka" | "mechatronika" | "programowanie" | "inne";
export type ProjectStatus = "draft" | "published";
export type PartnerType = "partner" | "sponsor";
export type MediaType = "image" | "presentation" | "video";

export interface Member {
    id: string;
    slug: string;
    name: string;
    nickname: string | null;
    avatar_url: string | null;
    bio_pl: string | null;
    bio_en: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    email: string | null;
    role: string;
    display_order: number;
    is_visible: boolean;
    created_at: string;
}

export interface Project {
    id: string;
    slug: string;
    title_pl: string;
    title_en: string | null;
    short_desc_pl: string;
    short_desc_en: string | null;
    full_desc_pl: string | null;
    full_desc_en: string | null;
    category: Category;
    github_repo: string | null;
    website_url: string | null;
    is_featured: boolean;
    display_order: number | null;
    popularity: number;
    is_group_project: boolean;
    group_id: string | null;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
}

export interface ProjectMember {
    id: string;
    project_id: string;
    member_id: string;
    role_in_project: string | null;
    display_order: number;
    member?: Member;
}

export interface ProjectMedia {
    id: string;
    project_id: string;
    url: string;
    type: MediaType;
    alt_text: string | null;
    display_order: number;
    created_at: string;
}

export interface Group {
    id: string;
    slug: string;
    name: string;
    logo_url: string | null;
    description_pl: string | null;
    description_en: string | null;
    is_permanent: boolean;
    is_visible: boolean;
    created_at: string;
}

export interface GroupMember {
    group_id: string;
    member_id: string;
    role: string | null;
    member?: Member;
}

export interface Partner {
    id: string;
    name: string;
    logo_url: string;
    website_url: string | null;
    description_pl: string | null;
    description_en: string | null;
    type: PartnerType;
    tier: string | null;
    display_order: number;
    is_visible: boolean;
    created_at: string;
}

export interface Award {
    id: string;
    title_pl: string;
    title_en: string | null;
    description_pl: string | null;
    description_en: string | null;
    date: string | null;
    image_url: string | null;
    display_order: number;
    created_at: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface SiteSetting {
    key: string;
    value: Record<string, unknown>;
}

/* Supabase Database type for client generics */
export interface Database {
    public: {
        Tables: {
            members: {
                Row: Member;
                Insert: Omit<Member, "id" | "created_at"> & { id?: string; created_at?: string };
                Update: Partial<Omit<Member, "id">>;
            };
            projects: {
                Row: Project;
                Insert: Omit<Project, "id" | "created_at" | "updated_at"> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Omit<Project, "id">>;
            };
            project_members: {
                Row: ProjectMember;
                Insert: Omit<ProjectMember, "id" | "member"> & { id?: string };
                Update: Partial<Omit<ProjectMember, "id" | "member">>;
            };
            project_media: {
                Row: ProjectMedia;
                Insert: Omit<ProjectMedia, "id" | "created_at"> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Omit<ProjectMedia, "id">>;
            };
            groups: {
                Row: Group;
                Insert: Omit<Group, "id" | "created_at"> & { id?: string; created_at?: string };
                Update: Partial<Omit<Group, "id">>;
            };
            group_members: {
                Row: GroupMember;
                Insert: Omit<GroupMember, "member">;
                Update: Partial<Omit<GroupMember, "member">>;
            };
            partners: {
                Row: Partner;
                Insert: Omit<Partner, "id" | "created_at"> & { id?: string; created_at?: string };
                Update: Partial<Omit<Partner, "id">>;
            };
            awards: {
                Row: Award;
                Insert: Omit<Award, "id" | "created_at"> & { id?: string; created_at?: string };
                Update: Partial<Omit<Award, "id">>;
            };
            contact_messages: {
                Row: ContactMessage;
                Insert: Omit<ContactMessage, "id" | "created_at" | "is_read"> & {
                    id?: string;
                    created_at?: string;
                    is_read?: boolean;
                };
                Update: Partial<Omit<ContactMessage, "id">>;
            };
            site_settings: {
                Row: SiteSetting;
                Insert: SiteSetting;
                Update: Partial<SiteSetting>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            category: Category;
            project_status: ProjectStatus;
            partner_type: PartnerType;
            media_type: MediaType;
        };
    };
}
