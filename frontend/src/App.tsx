import './App.css'
import { LoginForm } from './AuthPage/login-form';
import {Button} from "./components/ui/button"
import { ShopPage } from './User/shop-page';

function App() {

  return (
    <>
      {/* <div className="flex items-center justify-center min-h-screen">
        <LoginForm />
      </div> */}
      <div>
        <ShopPage />
      </div>
    </>
  );
}

export default App
