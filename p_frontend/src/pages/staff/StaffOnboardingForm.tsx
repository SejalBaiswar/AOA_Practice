import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { Staff } from "../../types/staffType";
import { createStaff, type CreateStaffPayload } from "../../api/staff.api";
import { useState } from "react";
import { Specialization, PractitionerType } from "../../types/staffType";

/* ---------- HOOKS ---------- */
import { useCountries } from "../../hooks/useCountries";
import { useStates } from "../../hooks/useStates";
import { useCities } from "../../hooks/useCities";

type Props = {
  onCreate: (staff: Staff) => void;
};

export default function StaffOnboardingForm({ onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Staff>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      specialization: undefined,
      practitionerType: PractitionerType.TEAM_MEMBER,
      address: {
        street: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
      },
    },
  });

  const { control, handleSubmit, reset } = form;

  /* ---------- WATCH ---------- */
  const country = form.watch("address.country") || "";
  const state = form.watch("address.state") || "";

  /* ---------- DATA ---------- */
  const countries = useCountries();
  const states = useStates(country);
  const cities = useCities(country, state);

  async function onSubmit(values: Staff) {
    setIsSubmitting(true);
    setError(null);

    try {
      const { id, addresses, ...staffDataWithoutId } = values;
      const staffData: CreateStaffPayload = {
        ...staffDataWithoutId,
        address: values.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      };

      console.log("Submitting staff data:", staffData);

      const savedStaff = await createStaff(staffData);

      console.log("Staff saved successfully:", savedStaff);

      const staffWithAddress = {
        ...savedStaff,
        address:
          savedStaff.addresses && savedStaff.addresses.length > 0
            ? savedStaff.addresses[0]
            : savedStaff.address,
      };

      onCreate(staffWithAddress);
      reset();
    } catch (err: any) {
      console.error("Error creating staff:", err);
      const errorMessage =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : err.message) ||
        "Failed to create staff. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ---------- NAME ---------- */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------- CONTACT ---------- */}
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email ",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="phoneNumber"
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="gender"
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    className="max-h-60 overflow-y-auto"
                  >
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------- GENDER + SPECIALIZATION + PRACTITIONER TYPE ---------- */}
        <div className="grid grid-cols-2 gap-4">
          

          <FormField
            control={control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    className="max-h-60 overflow-y-auto"
                  >
                    <SelectItem value={Specialization.ORTHODONTICS}>
                      Orthodontics
                    </SelectItem>
                    <SelectItem value={Specialization.ENDODONTICS}>
                      Endodontics
                    </SelectItem>
                    <SelectItem value={Specialization.PERIODONTICS}>
                      Periodontics
                    </SelectItem>
                    <SelectItem value={Specialization.PROSTHODONTICS}>
                      Prosthodontics
                    </SelectItem>
                    <SelectItem value={Specialization.PEDIATRIC_DENTISTRY}>
                      Pediatric Dentistry
                    </SelectItem>
                    <SelectItem
                      value={Specialization.ORAL_MAXILLOFACIAL_SURGERY}
                    >
                      Oral & Maxillofacial Surgery
                    </SelectItem>
                    <SelectItem value={Specialization.RADIOLOGY}>
                      Radiology
                    </SelectItem>
                    <SelectItem value={Specialization.PATHOLOGY}>
                      Pathology
                    </SelectItem>
                    <SelectItem value={Specialization.PUBLIC_HEALTH}>
                      Public Health
                    </SelectItem>
                    <SelectItem value={Specialization.ANESTHESIOLOGY}>
                      Anesthesiology
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="practitionerType"
            rules={{ required: "Practitioner type is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    className="max-h-60 overflow-y-auto"
                  >
                    <SelectItem value={PractitionerType.ADMIN}>
                      Admin
                    </SelectItem>
                    <SelectItem value={PractitionerType.TEAM_MEMBER}>
                      Team Member
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------- ADDRESS ---------- */}
        <div className="space-y-4">
          {/* STREET + COUNTRY */}
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={control}
              name="address.street"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address.country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Country</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("address.state", "");
                      form.setValue("address.city", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      side="bottom"
                      sideOffset={4}
                      avoidCollisions={false}
                      className="max-h-60 overflow-y-auto"
                    >
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* STATE + CITY + ZIP */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={control}
              name="address.state"
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("address.city", "");
                    }}
                    disabled={!country}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      position="popper"
                      className="max-h-60 overflow-y-auto"
                    >
                      {states.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address.city"
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!state}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      position="popper"
                      className="max-h-60 overflow-y-auto"
                    >
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address.zipCode"
              rules={{ required: "Zip code is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ---------- ERROR MESSAGE ---------- */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* ---------- ACTIONS ---------- */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            className="bg-red-800 hover:bg-red-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Add Staff"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
