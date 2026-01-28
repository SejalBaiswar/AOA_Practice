import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import Navbar from "./pages/Navbar";
import AppSidebar from "./pages/AppSidebar";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/Patients";
import StaffPage from "./pages/staff/Staff";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const token = localStorage.getItem("accessToken");
//
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//
//   return <>{children}</>;
// };

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/*"
          element={
            // <ProtectedRoute>
            <SidebarProvider defaultOpen={false}>
              <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
                <Navbar />

                <div className="flex flex-1 min-h-0 w-full overflow-hidden">
                  <AppSidebar />

                  <SidebarInset className="w-full overflow-hidden">
                    <main className="h-full w-full p-6 bg-muted/40 overflow-y-auto">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />

                        <Route path="patients" element={<PatientList />} />

                        {/* Product List */}
                        <Route
                          path="patients/:patientId/products"
                          element={<ProductList />}
                        />

                        {/* Product Details */}
                        <Route
                          path="patients/:patientId/products/:orderId"
                          element={<ProductList />}
                        />

                        <Route path="staff" element={<StaffPage />} />

                        {/* ⚠️ ALWAYS KEEP THIS LAST */}
                        <Route
                          path="*"
                          element={<Navigate to="/login" replace />}
                        />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </div>
            </SidebarProvider>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
