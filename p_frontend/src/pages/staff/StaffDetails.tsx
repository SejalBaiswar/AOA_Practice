import type { Staff } from "../../types/staffType";
import { User, Mail, Phone, Briefcase, MapPin, Home } from "lucide-react";

type Props = {
  staff: Staff;
};

export function StaffDetails({ staff }: Props) {
  const address = staff.address || (staff.addresses && staff.addresses[0]);

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-red-800" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard
            icon={<User className="w-4 h-4 text-red-700" />}
            label="Full Name"
            value={`${staff.firstName} ${staff.middleName ? staff.middleName + " " : ""}${staff.lastName}`}
          />
          <DetailCard
            icon={<Mail className="w-4 h-4 text-red-700" />}
            label="Email"
            value={staff.email}
          />
          <DetailCard
            icon={<Phone className="w-4 h-4 text-red-700" />}
            label="Phone Number"
            value={staff.phoneNumber}
          />
          <DetailCard
            icon={<User className="w-4 h-4 text-red-700" />}
            label="Gender"
            value={staff.gender}
          />
          <DetailCard
            icon={<Briefcase className="w-4 h-4 text-red-700" />}
            label="Specialization"
            value={staff.specialization || "-"}
          />
          <DetailCard
            icon={<Briefcase className="w-4 h-4 text-red-700" />}
            label="Role"
            value={
              staff.practitionerType === "Admin" ||
              staff.practitionerType === "Practice"
                ? "Admin"
                : "Staff Member"
            }
          />
        </div>
      </div>

      {/* Address Section */}
      {address && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-800" />
            Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {address.street && (
              <DetailCard
                icon={<Home className="w-4 h-4 text-gray-600" />}
                label="Street"
                value={address.street}
              />
            )}
            <DetailCard
              icon={<MapPin className="w-4 h-4 text-gray-600" />}
              label="City"
              value={address.city}
            />
            <DetailCard
              icon={<MapPin className="w-4 h-4 text-gray-600" />}
              label="State"
              value={address.state}
            />
            <DetailCard
              icon={<MapPin className="w-4 h-4 text-gray-600" />}
              label="Country"
              value={address.country}
            />
            <DetailCard
              icon={<MapPin className="w-4 h-4 text-gray-600" />}
              label="Zip Code"
              value={address.zipCode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-sm font-semibold text-gray-900 break-words">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
