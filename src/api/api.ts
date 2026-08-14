// import axios, { AxiosError } from 'axios';
// import { ApiError } from '@/types/errorsIntf';

// // Define base URL for API requests
// const API_BASE_URL ='http://localhost:3000/api';

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add auth token to requests if available
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Define types
// export interface Property {
//   _id?: string;
//   id?: string; // Ensure id is included
//   title: string;
//   location: string;
//   price: string;
//   type: string;
//   status: string;
//   beds?: number;
//   baths?: number;
//   sqft: number;
//   image?: string; // Already optional
//   planImage?: string;
//   dateAdded?: string;
//   featured: boolean;
//   description: string;
//   tags: string[];
//   isRental?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface AgencyInfo {
//   name: string;
//   logo: string;
//   address: string;
//   phone: string;
//   email: string;
//   description: string;
//   socialMedia?: {
//     facebook?: string;
//     twitter?: string;
//     instagram?: string;
//     linkedin?: string;
//   };
//   openingHours?: {
//     monday?: string;
//     tuesday?: string;
//     wednesday?: string;
//     thursday?: string;
//     friday?: string;
//     saturday?: string;
//     sunday?: string;
//   };
// }

// // Helper function to convert Axios errors to ApiError
// const handleAxiosError = (error: unknown): ApiError => {
//   let apiError: ApiError;
  
//   if (error instanceof AxiosError) {
//     apiError = new Error(
//       error.response?.data?.message || 'Unable to connect to server'
//     ) as ApiError;
//     apiError.response = error.response;
//     apiError.request = error.request;
//     apiError.config = error.config;
//   } else if (error instanceof Error) {
//     apiError = error as ApiError;
//   } else {
//     apiError = new Error('An unknown error occurred') as ApiError;
//   }
  
//   return apiError;
// };

// // Property API functions
// export const propertyApi = {
//   // Get all properties
//   getAll: async (): Promise<Property[]> => {
//     try {
//       const response = await apiClient.get('/properties');
//       return response.data;
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error('Error fetching properties:', apiError);
//       throw apiError;
//     }
//   },

//   // Get single property by ID
//   getById: async (id: number): Promise<Property> => {
//     try {
//       const response = await apiClient.get(`/properties/${id}`);
//       return response.data;
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error(`Error fetching property ${id}:`, apiError);
//       throw apiError;
//     }
//   },

//   // Create new property with FormData support
//   create: async (propertyData: FormData): Promise<Property> => {
//     try {
//       console.log('Creating property with data:', propertyData);
//       const response = await apiClient.post('/properties', propertyData);
//       return {
//         ...response.data,
//         id: response.data._id
//       };
//     } catch (error) {
//       console.error('Error creating property:', error);
//       throw error;
//     }
//   },

//   // Update existing property
//   update: async (id: number, property: Partial<Property>): Promise<Property> => {
//     try {
//       const response = await apiClient.put(`/properties/${id}`, property);
//       return response.data;
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error(`Error updating property ${id}:`, apiError);
//       throw apiError;
//     }
//   },

//   // Delete property
//   delete: async (id: number): Promise<void> => {
//     try {
//       await apiClient.delete(`/properties/${id}`);
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error(`Error deleting property ${id}:`, apiError);
//       throw apiError;
//     }
//   }
// };

// // Agency API functions
// export const agencyApi = {
//   // Get agency information
//   getInfo: async (): Promise<AgencyInfo> => {
//     try {
//       const response = await apiClient.get('/agency');
//       return response.data;
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error('Error fetching agency info:', apiError);
//       throw apiError;
//     }
//   },

//   // Update agency information
//   updateInfo: async (agencyInfo: Partial<AgencyInfo>): Promise<AgencyInfo> => {
//     try {
//       const response = await apiClient.put('/agency', agencyInfo);
//       return response.data;
//     } catch (error) {
//       const apiError = handleAxiosError(error);
//       console.error('Error updating agency info:', apiError);
//       throw apiError;
//     }
//   }
// };

// export default {
//   property: propertyApi,
//   agency: agencyApi
// };