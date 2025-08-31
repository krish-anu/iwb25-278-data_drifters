import axios from "axios";

export const fetchCustomersByShop = async (shopId: string) => {
  try {
    console.log("ShopId:", shopId);
    console.log("Making request to:", `http://localhost:9090/admin/customers/${shopId}`);

    const response = await axios.get(`http://localhost:9090/admin/customers/${shopId}`);

    console.log("Response received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    console.error("Error details:", error.response?.data, error.response?.status, error.message);

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || "Server error";

      console.error(`Server error ${status}:`, message);

      if (status === 404) {
        throw new Error("Shop not found or no customers available.");
      } else if (status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(`Server error (${status}): ${message}`);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received");
      throw new Error("Network error. Please check if the backend server is running on port 9090.");
    } else {
      // Other error
      console.error("Request setup error:", error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const getCurrentShopId = () => {
  // TODO: Get shopId from user context or JWT token
  // For now, return hardcoded value as per user's example
  // In a real implementation, this would decode the JWT token or get from user context
  return "M1-S1";
};