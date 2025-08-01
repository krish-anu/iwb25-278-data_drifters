import axios from 'axios';
export const fetchAllShops = async (id: string) => {
  try {
    console.log(`Fetching shops for ID: ${id}`);
    
    const response = await axios.get(`http://localhost:7070/${id}/shops`);
    // console.log("Fetched shops:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
} 