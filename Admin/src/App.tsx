

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {LogInForm} from './pages/AuthPage/login-form'
import SignUp from './pages/AuthPage/Signup'
import Dashboard from './pages/dashboard'
import "./App.css"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
