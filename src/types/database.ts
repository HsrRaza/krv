export type ProjectStatus = "in_progress" | "completed";

export type ConstructionPhase =
  | "Site Clearance"
  | "Earth Work Excavation"
  | "Foundation and Footing Construction"
  | "Plinth Work"
  | "Block Works Completion"
  | "Centring to RCC Roof Slab"
  | "Bar Bending to RCC Roof Slab"
  | "RCC Roof Slab Casting"
  | "Plumbing Works"
  | "Electrical Works"
  | "Internal Plastering"
  | "External Plastering"
  | "Internal Painting"
  | "External Painting"
  | "Tiles Work"
  | "Fixing of Doors & Windows"
  | "Fining Work";

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
