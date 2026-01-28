"use client";
import { cn } from "../lib/utils";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

import { createOrder } from "../api/orders.api";

const TOOTH_NUMBERS = Array.from({ length: 32 }, (_, i) => i + 1);

type Props = {
  patientId: string;
  onSuccess: () => void;
};

type FormValues = {
  case_type: string;
  shade: string;
  tooth_numbers: number[];
  priority: string;
  order_date: Date;
  expected_delivery: Date;
  design_notes?: string;
  image?: FileList;
};

export default function AddProductForm({ patientId, onSuccess }: Props) {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      case_type: "",
      shade: "",
      tooth_numbers: [],
      priority: "MEDIUM",
      order_date: new Date(),
      expected_delivery: undefined,
      design_notes: "",
      image: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();

    formData.append("patient_id", patientId);
    formData.append("case_type", values.case_type);
    formData.append("shade", values.shade);

    // ✅ CRITICAL FIX — SEND ARRAY CORRECTLY
    values.tooth_numbers.forEach((n) => {
      formData.append("tooth_numbers", String(n));
    });

    formData.append("priority", values.priority);
    formData.append("order_date", values.order_date.toISOString());
    formData.append(
      "expected_delivery",
      values.expected_delivery.toISOString()
    );

    if (values.design_notes) {
      formData.append("design_notes", values.design_notes);
    }

    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }

    const createdOrder = await createOrder(formData);

    onSuccess();
    navigate(`/patients/${patientId}/products/${createdOrder.order_id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* CASE TYPE + SHADE */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="case_type"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Type <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shade"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shade <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TOOTH NUMBERS — HORIZONTAL */}
        <FormField
          control={form.control}
          name="tooth_numbers"
          rules={{ validate: (v) => v.length > 0 || "Select at least one tooth" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tooth Numbers <span className="text-red-500">*</span></FormLabel>

              <div className="grid grid-cols-8 gap-2 border rounded-md p-3">
                {TOOTH_NUMBERS.map((n) => (
                  <label
                    key={n}
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={field.value.includes(n)}
                      onChange={() =>
                        field.onChange(
                          field.value.includes(n)
                            ? field.value.filter((x) => x !== n)
                            : [...field.value, n]
                        )
                      }
                    />
                    {n}
                  </label>
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRIORITY — VALUE VISIBLE */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="order_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Order Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                    <Button variant="outline"
                    className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(field.value, "PPP")}
                    </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_delivery"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected Delivery <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                    <Button variant="outline" 
                    className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick date"}
                    </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* IMAGE */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* NOTES */}
        <FormField
          control={form.control}
          name="design_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Design Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-red-800 hover:bg-red-900">
            Add Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
