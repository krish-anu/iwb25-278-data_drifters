import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LogInForm } from './pages/AuthPage/login-form';
import SignUp from './pages/AuthPage/Signup';
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

import Orders from "./pages/admin/Orders"; 
import Customers from "./pages/admin/Customers";

// import Stores from "./pages/admin/Stores";
import Settings from "./pages/admin/Settings";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import SuperAdminDashboard from "./pages/SuperAdmin/dashboard";
import SuperAdminStores from "./pages/SuperAdmin/stores";
import "./App.css"

const queryClient = new QueryClient();

const App = () => {
  // const token = localStorage.getItem("token") || "";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            {/* <Route path="stores" element={<Stores />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/superadmin" element={<SuperAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="stores" element={<SuperAdminStores />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);}

export default App;
