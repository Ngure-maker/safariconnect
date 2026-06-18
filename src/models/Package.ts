export interface Package {
  id?: number;
  package_name: string;
  duration: number;
  price: number;
  description?: string;
  activities_included?: string;
  created_at?: Date;
  updated_at?: Date;
}
