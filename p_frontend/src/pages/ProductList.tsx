import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { MoreVertical } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { useState, useEffect } from "react";
import OrderDetailsDialog from "./ProductDetails";
import {type Order } from "../api/orders.api";
import { useParams } from "react-router-dom";
import { getOrdersByPatientId, getOrderById } from "../api/orders.api";

/* ---------- Badge Helpers (same pattern as Patient) ---------- */
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return (
        <Badge className="bg-red-200 text-red-700 hover:bg-red-100">HIGH</Badge>
      );

    case "MEDIUM":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          MEDIUM
        </Badge>
      );

    case "LOW":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          LOW
        </Badge>
      );

    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          COMPLETED
        </Badge>
      );
    case "IN PROGRESS":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          IN PROGRESS
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          PENDING
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/* ---------- Page ---------- */
export default function ProductListPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { patientId } = useParams<{ patientId: string }>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleViewOrder(orderId: string) {
    try {
      const data = await getOrderById(orderId);
      setSelectedOrder(data);
    } catch (err) {
      console.error("Failed to load order details", err);
    }
  }

  async function fetchOrders(id: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await getOrdersByPatientId(id);
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchOrders(patientId);
    }
  }, [patientId]);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Product List</h1>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <Table className="w-full text-sm text-left">
          <TableHeader>
            <TableRow
              style={{
                background: "var(--table-header)",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {[
                "Order ID",
                "Case Type",
                "Priority",
                "Status",
                "Order Date",
                "Actions",
              ].map((head) => (
                <TableHead
                  key={head}
    
                  style={{
                    padding: "14px 16px",
                    fontWeight: 700,
                    fontSize: "13px",
                    textAlign: "left",
                    color:"#374151"
                  }}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.order_id}>
                <TableCell>{o.order_id}</TableCell>
                <TableCell>{o.case_type}</TableCell>
                <TableCell>{getPriorityBadge(o.priority)}</TableCell>
                <TableCell>{getStatusBadge(o.status)}</TableCell>
                <TableCell>{o.order_date.slice(0, 10)}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewOrder(o.order_id)}
                        className="cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* RIGHT-SIDE DETAILS (unchanged) */}
      <OrderDetailsDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
