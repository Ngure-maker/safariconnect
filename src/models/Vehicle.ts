export interface Vehicle {
  id?: number;
  vehicle_name: string;
  registration_number: string;
  capacity: number;
  driver_assigned?: string;
  availability: boolean;
  created_at?: Date;
  updated_at?: Date;
}
