import api from "./axios";
import type { Patient, Address } from "../types/patientType";

// Type for API payload (dob is string in API, Date in frontend)
export type CreatePatientPayload = Omit<Patient, "id" | "dob" | "addresses"> & {
  dob: string | null;
  address: Address;
};

export async function createPatient(patient: CreatePatientPayload) {
  const response = await api.post("/patients", patient);
  return response.data;
}

export async function getPatients() {
  const response = await api.get("/patients");
  console.log(response)
  return response.data;
}

export async function getPatientById(id: string) {
  console.log("Fetching patient with ID:", id);
  const response = await api.get(`/patients/${id}`);
  return response.data;
}

export async function updatePatient(id: string, patient: Partial<Patient>) {
  const response = await api.patch(`/patients/${id}`, patient);
  return response.data;
}

export async function deletePatient(id: string) {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
}
