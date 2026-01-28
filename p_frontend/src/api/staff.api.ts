import api from "./axios";
import type { Staff, Address } from "../types/staffType";

// Type for API payload
export type CreateStaffPayload = Omit<Staff, "id" | "addresses"> & {
  address: Address;
};

export async function createStaff(staff: CreateStaffPayload) {
  const response = await api.post("/users", staff);
  return response.data;
}

export async function getStaff() {
  const response = await api.get("/users");
  return response.data;
}

export async function getStaffById(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateStaff(id: string, staff: Partial<Staff>) {
  const response = await api.patch(`/users/${id}`, staff);
  return response.data;
}

export async function deleteStaff(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
