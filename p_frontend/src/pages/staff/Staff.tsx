import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";

import StaffOnboardingForm from "./StaffOnboardingForm";

import { Button } from "../../components/ui/button";
import type { Staff } from "../../types/staffType";
import { StaffTable } from "./StaffTable";
import { StaffDetails } from "./StaffDetails";
import { getStaff } from "../../api/staff.api";

export default function StaffPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(Boolean(location.state?.openOnboarding));

  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [details, setDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff from API on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      setLoading(true);
      setError(null);
      const data = await getStaff();
      // Handle addresses for frontend
      const staffWithAddresses = data.map((staffMember: any) => ({
        ...staffMember,
        address:
          staffMember.addresses && staffMember.addresses.length > 0
            ? staffMember.addresses[0]
            : staffMember.address,
      }));
      setStaff(staffWithAddresses);
    } catch (err: any) {
      console.error("Error fetching staff:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load staff. Please refresh the page.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (location.state?.openOnboarding) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  function handleCreateStaff(staffMember: Staff) {
    // Add to local state
    setStaff((prev) => [staffMember, ...prev]);
    setOpen(false);
  }

  function handleViewStaff(staffMember: Staff) {
    setSelectedStaff(staffMember);
    setDetails(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black-500">Staff</h2>

        <Button
          className="bg-red-800 text-white hover:bg-red-900"
          onClick={() => setOpen(true)}
        >
          Add Staff
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading staff...</div>
      ) : (
        <StaffTable staff={staff} onView={handleViewStaff} />
      )}

      <Sheet open={details} onOpenChange={setDetails}>
        <SheetContent
          className="
          w-full
          sm:w-[700px]
          lg:w-[900px]
          sm:max-w-[700px]
          lg:max-w-[900px]
          h-full
          overflow-hidden
          p-0
        "
        >
          <SheetHeader className="px-6 py-4 border-b flex-shrink-0" style={{ backgroundColor: "#f1cdd3ad" }}>
            <SheetTitle className="text-black-500 font-bold">
              Staff Details
            </SheetTitle>
          </SheetHeader>

          <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-6">
            {selectedStaff && <StaffDetails staff={selectedStaff} />}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="
           w-full
           sm:w-[700px]
           lg:w-[900px]
           sm:max-w-[700px]
           lg:max-w-[900px]
           h-full
           overflow-hidden
           p-0
         "
        >
          <div
            className="border-b px-6 py-4 bg-red-50"
            style={{ backgroundColor: "#f1cdd3ad" }}
          >
            <h2 className="text-lg font-semibold">Invite Staff</h2>
            <p className="text-sm text-muted-foreground">
              Fill the form and invite a new staff member
            </p>
          </div>

          <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-6">
            <StaffOnboardingForm onCreate={handleCreateStaff} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
