import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("http://localhost:9090/auth/login", {
      email,
      password,
    });
    // console.log(res.data.status);
    return res.data;
  } catch (error: any) {
    throw new Error("Login failed. Please check your credentials.");
  }
};


export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const res = await axios.post("http://localhost:9090/auth/register", {
      name,
      email,
      password,
      role, // ✅ send role to backend
    });

    console.log(res);

    return res.data;
  } catch (error: any) {
    console.error("🔥 Backend responded with:", error?.response?.data);
    console.error("🔥 Status:", error?.response?.status);

    throw new Error(
      error.response?.data?.message ||
        "Registration failed. Please try again."
    );
  }
};
