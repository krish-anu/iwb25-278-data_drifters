import axios from "axios";

// Types matching the backend Order model
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  shopId: string;
  mallId: string;
  customerName?: string; // Will be set by backend from auth
  date?: string; // Will be set by backend
  items: OrderItem[];
  totalPrice?: number; // Will be calculated by backend
}

export interface OrderCreateRequest {
  shopId: string;
  mallId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderCreateResponse {
  status: string;
  orderId: string;
  insertedId?: string;
  message?: string;
}

export interface OrdersListResponse {
  status: string;
  orders: Order[];
  count: number;
}

export interface OrderHistoryResponse {
  status: string;
  orders: Order[];
  count: number;
}

export interface OrderConfirmResponse {
  status: string;
  message: string;
  orderId: string;
}

export interface OrderResponse {
  status: string;
  order: Order;
}

export interface OrderError {
  status: string;
  message: string;
}

// API Base URL
const API_BASE_URL = "http://localhost:9090";

// Get auth token from localStorage (check both 'authToken' and 'token' for compatibility)
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken") || localStorage.getItem("token");
};

// Utility function to set a mock token for testing (temporary)
export const setMockAuthToken = (
  token: string = "mock-jwt-token-for-testing"
) => {
  localStorage.setItem("authToken", token);
  console.log("Mock auth token set for testing:", token);
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API responses
const handleApiResponse = <T,>(response: any): T => {
  return response.data;
};

// Handle API errors
const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data;
    throw new Error(
      errorData.message ||
        `HTTP ${error.response.status}: ${error.response.statusText}`
    );
  } else if (error.request) {
    // Request was made but no response received
    throw new Error("Network error: Unable to connect to server");
  } else {
    // Something else happened
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Order API functions
export const orderService = {
  // Create a new order
  createOrder: async (
    orderData: OrderCreateRequest
  ): Promise<OrderCreateResponse> => {
    try {
      const response = await apiClient.post("/orders", orderData);
      return handleApiResponse<OrderCreateResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get orders
  getOrders: async (
    shopId?: string,
    mallId?: string
  ): Promise<OrdersListResponse> => {
    try {
      const params = new URLSearchParams();
      if (shopId) params.append("shopId", shopId);
      if (mallId) params.append("mallId", mallId);

      const response = await apiClient.get(`/orders?${params.toString()}`);
      return handleApiResponse<OrdersListResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return handleApiResponse<OrderResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get order history (confirmed orders)
  getOrderHistory: async (
    shopId?: string,
    mallId?: string
  ): Promise<OrderHistoryResponse> => {
    try {
      const params = new URLSearchParams();
      if (shopId) params.append("shopId", shopId);
      if (mallId) params.append("mallId", mallId);

      const response = await apiClient.get(
        `/orders/history?${params.toString()}`
      );
      return handleApiResponse<OrderHistoryResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Confirm/place an order
  confirmOrder: async (orderId: string): Promise<OrderConfirmResponse> => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/confirm`);
      return handleApiResponse<OrderConfirmResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default orderService;
