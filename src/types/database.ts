export type ProjectStatus = "in_progress" | "completed";

export type ConstructionPhase =
  | "Site Clearance"
  | "Earth Work Excavation"
  | "Foundation and Footing Construction"
  | "Plinth Work"
  | "Ground Floor Block Works Completion"
  | "Ground Floor Slab Completion"
  | "First Floor Block Works Completion"
  | "First Floor Slab Completion"
  | "Electrical Works"
  | "Plumbing Works"
  | "Ground Floor Internal Plastering Completion"
  | "First Floor Internal Plastering Completion"
  | "Ground Floor External Plastering Completion"
  | "First Floor External Plastering Completion"
  | "Tiles Works Completion"
  | "External Painting Completion"
  | "Internal Painting Completion"
  | "All Finishing Works Completion"
  | "Parapet Wall"
  | "Compound Wall"
  | "Elevation Design Construction";

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
