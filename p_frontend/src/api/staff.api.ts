import api from "./axios";
import type { Staff, Address } from "../types/staffType";

// Type for API payload
export type CreateStaffPayload = Omit<Staff, "id" | "addresses"> & {
  address: Address;
};

export async function createStaff(staff: CreateStaffPayload) {
  // 🔹 Include tenantId for tenant isolation
  const tenantId = localStorage.getItem("tenantId");
  const payload = { ...staff, tenantId };
  const response = await api.post("/users", payload);
  return response.data.data;
}

export async function getStaff() {
  // 🔹 Filter by tenantId and practitionerType for tenant isolation
  const tenantId = localStorage.getItem("tenantId");
  const params = new URLSearchParams();
  params.set("practitionerType", "Team Member");
  if (tenantId) {
    params.set("tenantId", tenantId);
  }
  const response = await api.get(`/users?${params.toString()}`);
  return response.data.data;
}

export async function getStaffById(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
}

export async function updateStaff(id: string, staff: Partial<Staff>) {
  const response = await api.patch(`/users/${id}`, staff);
  return response.data.data;
}

export async function deleteStaff(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data.data;
}
