import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
} from "../components/ui/sheet";

import { Button } from "../components/ui/button";
import type { Patient } from "../types/patientType";
import { PatientTable } from "./PatientTable";
import { PatientDetails } from "./PatientDetails";
import PatientOnboardingForm from "./PatientOnboardingForm";
import AddProductForm from "./AddProductForm";
import { getPatients } from "../api/patients.api";

/* ✅ SAME WIDTH AS ORIGINAL PATIENT ONBOARDING */
const RIGHT_SHEET_CLASS = `
  w-full
  sm:w-[700px]
  lg:w-[900px]
  sm:max-w-[700px]
  lg:max-w-[700px]
  h-full
  overflow-hidden
  p-0
`;

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [productPatient, setProductPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const data = await getPatients();
    setPatients(
      data.map((p: any) => ({
        ...p,
        dob: p.dob ? new Date(p.dob) : null,
        address: p.addresses?.[0],
      }))
    );
  }

  function handleCreatePatient(patient: Patient) {
    setPatients((prev) => [patient, ...prev]);
    setOpenAddPatient(false);
  }

  function handleViewPatient(patient: Patient) {
    setSelectedPatient(patient);
    setOpenDetails(true);
  }

  function handleAddProduct(patient: Patient) {
    setProductPatient(patient);
    setOpenAddProduct(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Patients</h2>
        <Button
          className="bg-red-800 hover:bg-red-900"
          onClick={() => setOpenAddPatient(true)}
        >
          Add Patient
        </Button>
      </div>

      <PatientTable
        patients={patients}
        onView={handleViewPatient}
        onAddProduct={handleAddProduct}
      />

      {/* ---------- PATIENT DETAILS ---------- */}
      <Sheet open={openDetails} onOpenChange={setOpenDetails}>
        <SheetContent side="right" className={RIGHT_SHEET_CLASS}>
          <div
            className="border-b px-6 py-4"
            style={{ backgroundColor: "#f1cdd3ad" }}
          >
            <h2 className="font-semibold">Patient Details</h2>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            {selectedPatient && <PatientDetails patient={selectedPatient} />}
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------- ADD PATIENT ---------- */}
      <Sheet open={openAddPatient} onOpenChange={setOpenAddPatient}>
        <SheetContent side="right" className={RIGHT_SHEET_CLASS}>
          <div
            className="border-b px-6 py-4"
            style={{ backgroundColor: "#f1cdd3ad" }}
          >
            <h2 className="font-semibold">Add Patient</h2>
            <p className="text-sm text-muted-foreground">
              Fill the form and add new patient
            </p>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <PatientOnboardingForm onCreate={handleCreatePatient} />
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------- ADD PRODUCT ---------- */}
      <Sheet open={openAddProduct} onOpenChange={setOpenAddProduct}>
        <SheetContent side="right" className={RIGHT_SHEET_CLASS}>
          <div
            className="border-b px-6 py-4"
            style={{ backgroundColor: "#f1cdd3ad" }}
          >
            <h2 className="font-semibold">Add Product</h2>
            <p className="text-sm text-muted-foreground">
              Fill the form and add new product
            </p>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            {productPatient && (
              <AddProductForm
                patientId={productPatient.id}
                onSuccess={() => setOpenAddProduct(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
