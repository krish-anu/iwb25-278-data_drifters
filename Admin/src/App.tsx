// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import {LogInForm} from './pages/AuthPage/login-form'
// import SignUp from './pages/AuthPage/Signup'
// import DashboardPage from './pages/Dashboard-page'
// import "./App.css"
// import SuperAdmin from './pages/SuperAdmin/SuperAdmin'

// function App() {

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<LogInForm />} />
//           <Route path="/admin" element={<DashboardPage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/superadmin" element={<SuperAdmin />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LogInForm} from './pages/AuthPage/login-form'
import SignUp from './pages/AuthPage/Signup'
import SuperAdmin from './pages/SuperAdmin/SuperAdmin'
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Stores from "./pages/admin/Stores";
import Settings from "./pages/admin/Settings";
import "./App.css"

const queryClient = new QueryClient();

const App = () => (
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
            {/* <Route path="stores" element={<Stores />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/superadmin" element={<SuperAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
