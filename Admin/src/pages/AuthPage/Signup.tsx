// src/pages/Signup.tsx
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Sparkles, Shield } from "lucide-react";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    

    try {
      const res = await registerUser(Date.now().toString(),name, email, password, role); // pass role
      console.log(res.status);
      if (res.status === "success") {
        localStorage.setItem("token", res.token);
        alert(`Welcome ${res.user.name} 🎉`);
        window.location.href = "/"; // Redirect to login

      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="relative z-10 max-w-xl w-full bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-2xl">
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600">Join our community today</p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your full name"
                  className="pl-11 h-12 w-full border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your email"
                  className="pl-11 h-12 w-full border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 w-full border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-gray-700 font-medium">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 w-full border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 outline-none"
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-semibold rounded-xl transition-all"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Sign in link */}
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}