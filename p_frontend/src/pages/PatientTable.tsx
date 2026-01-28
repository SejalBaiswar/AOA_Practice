import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import type { Patient } from "../types/patientType";
import { MoreVertical } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

type Props = {
  patients: Patient[];
  onView: (patient: Patient) => void;        // View Patient Details (Sheet)
  onAddProduct: (patient: Patient) => void;  // Add Product (Sheet)
};

export function PatientTable({
  patients,
  onView,
  onAddProduct,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <Table className="w-full text-sm"
      style={{
          width: "100%",
          fontSize: "14px",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}>
        <TableHeader >
          <TableRow
            style={{
              background: "var(--table-header)",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <TableHead style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}>Name</TableHead>
            <TableHead style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}>Email</TableHead>
            <TableHead style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}>Contact</TableHead>
            <TableHead style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No patients added yet
              </TableCell>
            </TableRow>
          )}

          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="px-4 py-3">
                {p.firstName} {p.lastName}
              </TableCell>
              <TableCell className="px-4 py-3">{p.email}</TableCell>
              <TableCell className="px-4 py-3">{p.contact}</TableCell>

              <TableCell className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {/* VIEW PATIENT DETAILS */}
                    <DropdownMenuItem
                      onClick={() => onView(p)}
                      className="cursor-pointer"
                    >
                      View Patient Details
                    </DropdownMenuItem>

                    {/* ADD PRODUCT */}
                    <DropdownMenuItem
                      onClick={() => onAddProduct(p)}
                      className="cursor-pointer"
                    >
                      Add Product
                    </DropdownMenuItem>

                    {/* VIEW PRODUCT DETAILS */}
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/patients/${p.id}/products`)
                      }
                      className="cursor-pointer"
                    >
                      View Product Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
