export interface Visit {
  id: number;
  patient_id: string | null;
  name: string;
  email: string;
  phone: string;
  location: string;
  location_id?: string | null;
  visit_date: string;
  visit_time: string;
  status: string;
  message: string | null;
  source?: string | null;
}
