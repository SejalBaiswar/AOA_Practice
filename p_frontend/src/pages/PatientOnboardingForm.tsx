"use client";

import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

import type { Patient } from "../types/patientType";
import { createPatient, type CreatePatientPayload } from "../api/patients.api";
import { useState } from "react";

/* ---------- HOOKS ---------- */
import { useCountries } from "../hooks/useCountries";
import { useStates } from "../hooks/useStates";
import { useCities } from "../hooks/useCities";

type Props = {
  onCreate: (patient: Patient) => void;
};

export default function PatientOnboardingForm({ onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Patient>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contact: "",
      dob: null,
      gender: "",
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

  async function onSubmit(values: Patient) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert Date to ISO string (YYYY-MM-DD) for API
      // Structure data with nested address
      const { id, dob, addresses, ...patientDataWithoutId } = values;
      const patientData: CreatePatientPayload = {
        ...patientDataWithoutId,
        dob: dob ? dob.toISOString().split("T")[0] : null,
        address: values.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      };

      console.log("Submitting patient data:", patientData);

      // Call the API to save to database
      const savedPatient = await createPatient(patientData);

      console.log("Patient saved successfully:", savedPatient);

      // Convert dob string back to Date and handle addresses array
      const patientWithDate = {
        ...savedPatient,
        dob: savedPatient.dob ? new Date(savedPatient.dob) : null,
        address:
          savedPatient.addresses && savedPatient.addresses.length > 0
            ? savedPatient.addresses[0]
            : savedPatient.address,
      };

      // Call onCreate callback with the saved patient (includes id from backend)
      onCreate(patientWithDate);
      reset();
    } catch (err: any) {
      console.error("Error creating patient:", err);
      const errorMessage =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : err.message) ||
        "Failed to create patient. Please try again.";
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
                message: "Invalid email",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="contact"
            rules={{ required: "Contact is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={control}
            name="dob"
            rules={{ required: "Date of birth is required" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Date of Birth <span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------- DOB + GENDER ---------- */}
        <div className="grid grid-cols-2 gap-4">
         

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

        {/* ---------- ADDRESS ---------- */}
    
        <div className="space-y-4">
          {/* STREET + COUNTRY */}
          <div className="grid grid-cols-4 gap-4">
            {/* STREET */}
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

            {/* COUNTRY */}
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
            {/* STATE */}
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

            {/* CITY */}
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

            {/* ZIP */}
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
            {isSubmitting ? "Creating..." : "Add Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
