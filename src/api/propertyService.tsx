import axios from "axios";
import authService from "./authService";

const API_URL = "${process.env.NEXT_PUBLIC_BASE_URL}/api";
const BASE_URL = "${process.env.NEXT_PUBLIC_BASE_URL}";

export interface Property {
  _id?: string; // MongoDB ID
  id?: string; // Frontend ID derived from _id
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  beds?: number;
  baths?: number;
  sqft: number;
  planImages?: string; // Backend field for plan images (comma-separated paths)
  image?: string | string[]; // Frontend processed image URLs (array or single)
  planImage?: string | string[]; // Frontend processed plan image URLs (array or single)
  dateAdded?: string;
  featured: boolean;
  description: string;
  tags: string[];
  isRental?: boolean;
}

// Create a configured axios instance for API requests
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request:", token.substring(0, 20) + "...");
    } else {
      console.warn("No token found for authenticated request");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `API Response [${response.config.method?.toUpperCase()}] ${
        response.config.url
      }:`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error(
      `API Error [${error.config?.method?.toUpperCase()}] ${
        error.config?.url
      }:`,
      {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message,
      }
    );

    if (error.response && error.response.status === 401) {
      console.warn("Authentication failed - redirecting to login");
      authService.logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Helper function to process image URLs
const processImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  // If the URL already starts with http, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Add base URL to relative paths
  return `${BASE_URL}${imageUrl}`;
};

// Helper function to process image arrays or single images
const processImages = (
  images: string | string[] | undefined
): string | string[] | undefined => {
  if (!images) return undefined;

  if (Array.isArray(images)) {
    return images.map(processImageUrl);
  }

  return processImageUrl(images);
};

const processProperty = (prop: Property): Property => {
  return {
    ...prop,
    id: prop._id || "",
    image: processImages(prop.image),
    planImage: processImages(prop.planImage),
    isRental: prop.isRental ?? false,
  };
};

// Property service with API functions
export const propertyService = {
  // Get all properties
  async getAllProperties(): Promise<Property[]> {
    try {
      const response = await apiClient.get("/properties");
      console.log("Raw properties from API:", response.data);
      const processedProperties = response.data.map(processProperty);
      console.log("Processed properties:", processedProperties);
      return processedProperties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error("Failed to fetch properties");
    }
  },

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await apiClient.get(`/properties/${id}`);
      return processProperty(response.data);
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw new Error("Failed to fetch property");
    }
  },

  // Create a new property (handles file uploads)
  async createProperty(propertyData: FormData): Promise<Property> {
    try {
      console.log("Creating property with data:");
      for (const [key, value] of propertyData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.post(
        "/properties/create",
        propertyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Property created successfully:", response.data);
      return processProperty(response.data);
    } catch (error) {
      console.error("Error creating property:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response.data?.message || "Failed to create property";
          throw new Error(message);
        } else if (error.request) {
          throw new Error("Network error - please check your connection");
        }
      }

      throw new Error("Failed to create property");
    }
  },

  // Update an existing property
  async updateProperty(id: string, propertyData: FormData): Promise<Property> {
    try {
      console.log(`Updating property ${id} with data:`);
      for (const [key, value] of propertyData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.put(`/properties/${id}`, propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Property updated successfully:", response.data);
      return processProperty(response.data);
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response.data?.message || "Failed to update property";
          throw new Error(message);
        } else if (error.request) {
          throw new Error("Network error - please check your connection");
        }
      }

      throw new Error("Failed to update property");
    }
  },

  // Delete a property with improved error handling
  async deleteProperty(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/properties/${id}`);
      console.log(`Successfully deleted property with ID: ${id}`);
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response.data?.message || "Failed to delete property";
          throw new Error(message);
        } else if (error.request) {
          throw new Error("Network error - please check your connection");
        }
      }

      throw new Error("Failed to delete property");
    }
  },
};

export default propertyService;
