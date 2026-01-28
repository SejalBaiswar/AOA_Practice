import api from "./axios";

/* ---------- Types (match backend response) ---------- */
export type Order = {
  order_id: string;
  patient_id: string;
  case_type: string;
  shade: string;
  tooth_numbers: string;
  priority: string;
  status: string;
  order_date: string;
  image: string;
};

/* ---------- Types (Create Order Payload) ---------- */
export type CreateOrderPayload = {
  patient_id: string;
  case_type: string;
  shade: string;
  tooth_numbers: number[];
  priority: string;           // backend enum
  order_date: string;         // ISO string
  expected_delivery: string;  // ISO string
  design_notes?: string;
};

/* ---------- APIs ---------- */

// Fetch orders for a particular patient
export async function getOrdersByPatientId(patientId: string) {
  const response = await api.get(`/orders/patient/${patientId}`);
  return response.data.data;
}

// Fetch single order (for details)
export async function getOrderById(orderId: string) {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.data;
}

// ✅ ADD PRODUCT (CREATE ORDER)
export async function createOrder(payload: FormData) {
  const response = await api.post("/orders", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

