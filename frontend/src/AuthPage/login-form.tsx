

  
 import { useState } from "react";
 import { Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
 import axios from "axios";
 import { useNavigate } from "react-router-dom";    

 export default function LoginForm() {
   const [email, setEmail] = useState("");
   const [name, setName] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [showSignup, setShowSignup] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const navigate = useNavigate();

   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
     setError("");
     setShowSignup(false);

     try {
       const res = await axios.post("http://localhost:9090/auth/login", {
         email,
         password,
       });

       if (res.data.status === "success") {
         if (email === "user@gmail.com") {
           navigate("/shop");
         } else if (email === "admin@gmail.com") {
           navigate("/dashboard");
         }
         localStorage.setItem("token", res.data.token);
         // alert(`Welcome, ${res.data.user.name}`);
         // window.location.href = "/dashboard";
       } else {
         setError(res.data.message || "Login failed");
       }
     } catch (err: any) {
       if (err.response?.status === 401) {
         setError("User not found. Would you like to sign up?");
         setShowSignup(true);
       } else {
         setError("Something went wrong. Please try again.");
       }
     } finally {
       setIsLoading(false);
     }
   };

   const handleSignup = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
     setError("");

     try {
       const res = await axios.post("http://localhost:9090/auth/register", {
         name,
         email,
         password,
       });

       if (res.data.status === "success") {
         localStorage.setItem("token", res.data.token);
         alert(`Welcome, ${res.data.user.name} 🎉`);
         // window.location.href = "/dashboard";
       } else {
         setError(res.data.message || "Sign-up failed");
       }
     } catch (err: any) {
       setError(
         "Registration error: " + (err.response?.data.message || err.message)
       );
     } finally {
       setIsLoading(false);
     }
   };


   

   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
       {/* Background decoration */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
       </div>

       <div className="relative z-10 w-full max-w-6xl mx-auto">
         <div className="overflow-hidden border-0 shadow-2xl backdrop-blur-sm bg-white/90 rounded-2xl">
           <div className="grid p-0 lg:grid-cols-2">
             {/* Form Section */}
             <div className="p-8 lg:p-12">
               <div onSubmit={handleSignup} className="space-y-6">
                 {/* Header */}
                 <div className="text-center space-y-4">
                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                     <Sparkles className="w-8 h-8 text-white" />
                   </div>
                   <div>
                     <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                       {showSignup ? "Create Account" : "Welcome Back"}
                     </h1>
                     <p className="text-gray-600 mt-2 text-lg">
                       {showSignup
                         ? "Join our community today"
                         : "Sign in to your account"}
                     </p>
                   </div>
                 </div>

                 {/* Form Fields */}
                 <div className="space-y-5">
                   {showSignup && (
                     <div className="space-y-2">
                       <label
                         htmlFor="name"
                         className="text-gray-700 font-medium block"
                       >
                         Full Name
                       </label>
                       <div className="relative">
                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                         <input
                           id="name"
                           type="text"
                           placeholder="Enter your full name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           required
                           disabled={isLoading}
                           className="pl-11 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl bg-white/50 backdrop-blur-sm transition-colors w-full outline-none"
                         />
                       </div>
                     </div>
                   )}

                   <div className="space-y-2">
                     <label
                       htmlFor="email"
                       className="text-gray-700 font-medium block"
                     >
                       Email Address
                     </label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input
                         id="email"
                         type="email"
                         placeholder="Enter your email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         required
                         disabled={isLoading}
                         className="pl-11 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl bg-white/50 backdrop-blur-sm transition-colors w-full outline-none"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label
                       htmlFor="password"
                       className="text-gray-700 font-medium block"
                     >
                       Password
                     </label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Enter your password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         required
                         disabled={isLoading}
                         className="pl-11 pr-11 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl bg-white/50 backdrop-blur-sm transition-colors w-full outline-none"
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                       >
                         {showPassword ? (
                           <EyeOff className="w-5 h-5" />
                         ) : (
                           <Eye className="w-5 h-5" />
                         )}
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Error Message */}
                 {error && (
                   <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                     <p className="text-red-700 text-sm font-medium">{error}</p>
                   </div>
                 )}

                 {/* Submit Button */}
                 <button
                   onClick={handleLogin}
                   className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   disabled={isLoading}
                 >
                   {isLoading ? (
                     <div className="flex items-center justify-center space-x-2">
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       <span>Processing...</span>
                     </div>
                   ) : showSignup ? (
                     "Create Account"
                   ) : (
                     "Sign In"
                   )}
                 </button>

                 {/* Toggle between Login/Signup */}
                 <div className="text-center pt-4">
                   <p className="text-gray-600">
                     {showSignup
                       ? "Already have an account?"
                       : "Don't have an account?"}
                     <button
                       type="button"
                       onClick={() => {
                         setShowSignup(!showSignup);
                         setError("");
                         setName("");
                         setEmail("");
                         setPassword("");
                       }}
                       className="ml-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                     >
                       {showSignup ? "Sign In" : "Sign Up"}
                     </button>
                   </p>
                 </div>
               </div>
             </div>

             {/* Visual Section */}
             <div className="bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden hidden lg:block">
               <div className="absolute inset-0 bg-black/10"></div>

               {/* Animated background elements */}
               <div className="absolute inset-0">
                 <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                 <div
                   className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"
                   style={{ animationDelay: "1s" }}
                 ></div>
                 <div
                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"
                   style={{ animationDelay: "2s" }}
                 ></div>
               </div>

               <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-12 text-center">
                 <div className="space-y-6">
                   <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                     <Sparkles className="w-10 h-10" />
                   </div>
                   <h2 className="text-3xl font-bold">
                     {showSignup ? "Join Our Community" : "Welcome Back!"}
                   </h2>
                   <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                     {showSignup
                       ? "Create your account and unlock access to amazing features and personalized experiences."
                       : "We're excited to see you again. Sign in to continue your journey with us."}
                   </p>

                   {/* Feature highlights */}
                   <div className="grid gap-4 mt-8">
                     <div className="flex items-center space-x-3 text-blue-100">
                       <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                       <span>Secure & Protected</span>
                     </div>
                     <div className="flex items-center space-x-3 text-blue-100">
                       <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                       <span>Fast & Reliable</span>
                     </div>
                     <div className="flex items-center space-x-3 text-blue-100">
                       <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                       <span>24/7 Support</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }