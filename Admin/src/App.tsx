

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {LogInForm} from './pages/AuthPage/login-form'
import SignUp from './pages/AuthPage/Signup'
import Dashboard from './pages/dashboard'
import "./App.css"
import SuperAdmin from './pages/SuperAdmin/SuperAdmin'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
