
import "./App.css";
import { ShopPage } from "./pages/User/shop-page";
import { Dashboard } from "./pages/Admin/dashboard";
import { LoginForm } from './AuthPage/login-form';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
  
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </>
  );
}

export default App;

     

     
 
