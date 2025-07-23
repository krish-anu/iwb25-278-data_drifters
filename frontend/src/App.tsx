
import "./App.css";
import { ShopPage } from "./pages/User/shop-page";
import { Dashboard } from "./pages/Admin/dashboard";
import LoginForm from './AuthPage/login-form';
import Signup from './AuthPage/Signup';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
  
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;

     

     
 
