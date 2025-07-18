import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // for sign-up
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowSignup(false);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        alert(`Welcome, ${res.data.user.name}`);
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
      const res = await axios.post("http://localhost:8080/auth/register", {
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
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}
        {...props}
      >
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-8"
              onSubmit={showSignup ? handleSignup : handleLogin}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {showSignup ? "Create an Account" : "Welcome back"}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {showSignup
                      ? "Sign up to create your Acme Inc account"
                      : "Login to your Acme Inc account"}
                  </p>
                </div>
                {showSignup && (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : showSignup ? "Sign Up" : "Login"}
                </Button>
                {!showSignup && (
                  <p className="text-sm text-center">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      onClick={() => setShowSignup(true)}
                      className="underline text-primary"
                    >
                      Sign up
                    </a>
                  </p>
                )}
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/src/assets/image.png"
                alt="Login illustration"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
