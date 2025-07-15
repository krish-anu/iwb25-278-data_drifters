import './App.css'
import { LoginForm } from './AuthPage/login-form';
import {Button} from "./components/ui/button"


function App() {

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <LoginForm />
      </div>
    </>
  );
}

export default App
