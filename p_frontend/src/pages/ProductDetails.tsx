import type { Order } from "../api/orders.api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  FileText,
  Hash,
  Palette,
  Layers,
  AlertCircle,
  CheckCircle,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

/* ---------- Types ---------- */

type Props = {
  order: Order | null;
  onClose: () => void;
};

/* ---------- Component ---------- */
export default function OrderDetailsDialog({ order, onClose }: Props) {
  return (
    <Sheet open={!!order} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[700px] lg:w-[900px] sm:max-w-[700px] lg:max-w-[900px] h-full p-0 flex flex-col"
      >
        <SheetHeader
          className="px-6 py-4 border-b flex-shrink-0"
          style={{ backgroundColor: "#f1cdd3ad" }}
        >
          <SheetTitle className="text-black-500 font-bold">
            Order Details
          </SheetTitle>
        </SheetHeader>
        {order && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Order Information */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-800" />
                Order Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard
                  icon={<Hash className="w-4 h-4 text-red-700" />}
                  label="Order ID"
                  value={order.order_id}
                />
                <DetailCard
                  icon={<Layers className="w-4 h-4 text-red-700" />}
                  label="Case Type"
                  value={order.case_type}
                />
                <DetailCard
                  icon={<Palette className="w-4 h-4 text-red-700" />}
                  label="Shade"
                  value={order.shade}
                />
               <DetailCard
  icon={<Layers className="w-4 h-4 text-red-700" />}
  label="Tooth Numbers"
  value={Array.isArray(order.tooth_numbers) ? order.tooth_numbers.join(", ") : order.tooth_numbers}
/>
                <DetailCard
                  icon={<AlertCircle className="w-4 h-4 text-red-700" />}
                  label="Priority"
                  value={order.priority}
                />
                <DetailCard
                  icon={<CheckCircle className="w-4 h-4 text-red-700" />}
                  label="Status"
                  value={order.status}
                />
                <DetailCard
                  icon={<Calendar className="w-4 h-4 text-red-700" />}
                  label="Order Date"
                  value={order.order_date}
                />
              </div>
            </div>
            {/* Image Section */}
            {/* Image Section */}
            {/* {order.image && ( */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-800" />
                  Reference Image
                </h3>

                <img
                  src={`data:image/;base64,${order.image}`}
                  alt="Order reference"
                  className="w-24 h-24 object-contain rounded border cursor-pointer"
                />
              </div>
            {/* )} */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---------- Shared Detail Card (same as PatientDetails) ---------- */
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




