export type ProjectStatus = "in_progress" | "completed";

export type ConstructionPhase =
  | "Site Excavation & Earthwork"
  | "Foundation & Column Casting"
  | "Brickwork, Lintels & Slab Casting"
  | "Plastering & Electrical Concealing"
  | "Flooring & Tile Work"
  | "Interior Finishing & Handover";

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  category: string;
  location: string;
  current_phase: ConstructionPhase | string | null;
  cover_image: string;
  gallery_images: string[];
  description: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Project, "id" | "created_at">>;
      };
    };
  };
};
