import api from "./axios";
import type { Patient } from "../types/patientType";

export type UserType = "PRACTICE_USER" | "LAB_USER";

export async function createUser(user: Patient & { type: UserType }) {
  const response = await api.post("/users", user);
  return response.data;
}

export async function getUsersByType(type: UserType) {
  const response = await api.get("/users", {
    params: { type },
  });
  return response.data;
}
