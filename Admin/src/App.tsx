import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LogInForm } from './pages/AuthPage/login-form';
import SignUp from './pages/AuthPage/Signup';
import SuperAdmin from './pages/SuperAdmin/SuperAdmin';
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Stores from "./pages/admin/Stores";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  // Get token from localStorage (or use any auth state/context)
  const token = localStorage.getItem("token") || "";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogInForm />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="stores" element={<Stores />} />
            </Route>

            {/* Super Admin route */}
            <Route path="/superadmin" element={<SuperAdmin token={token} />} />

            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
