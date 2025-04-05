
import axios from 'axios';

// API base URL - change this to your Flask API URL when deployed
const API_BASE_URL = 'http://localhost:5000';

// Customer data interface
export interface CustomerData {
  customer_id: string;
  age: number;
  gender: string;
  location: string;
  customer_segment: string;
  avg_order_value: number;
  holiday: string;
  season: string;
  browsing_history: string[];
  purchase_history: string[];
}

// Product interface
export interface Product {
  product_id: string;
  category: string;
  subcategory: string;
  brand: string;
  price?: number;
  rating?: number;
  recommendation_reason: string;
}

// Get recommendations for a customer
export const getRecommendations = async (customerId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Get customer details
export const getCustomerDetails = async (customerId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
};
