import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type { Staff } from "../../types/staffType";
import { MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type Props = {
  staff: Staff[];
  onView: (staff: Staff) => void;
};

export function StaffTable({ staff, onView }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <Table
        className="w-full text-sm"
        style={{
          width: "100%",
          fontSize: "14px",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <TableHeader>
          <TableRow
            style={{
              background: "var(--table-header)",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Name
            </TableHead>
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Email
            </TableHead>
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Contact
            </TableHead>
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Location
            </TableHead>
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Role
            </TableHead>
            <TableHead
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 700,
                color: "#374151",
                fontSize: "13px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {staff.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No staff added yet
              </TableCell>
            </TableRow>
          )}

          {staff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                {s.firstName} {s.lastName}
              </TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.phoneNumber}</TableCell>
              <TableCell>
                {s.address?.country ||
                  (s.addresses && s.addresses[0]?.country) ||
                  "-"}
              </TableCell>
              <TableCell className="capitalize">
                {s.practitionerType === "Admin" || s.practitionerType === "Practice"
                  ? "Admin"
                  : "Staff Member"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onView(s)}
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
  );
}
