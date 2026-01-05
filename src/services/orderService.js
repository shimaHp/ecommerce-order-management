import axios from "axios";

const API_URL = 'https://localhost:7043/api/orders';



const orderservice = {
    getAllOrders: async () => {
        try {

            const respone = await axios.get(API_URL);
            return respone.data;

        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;

        }

    },

getOrderById:async(id)=>{
    try {
        const respone=await axios.get(`${API_URL}/${id}`);
        return respone.data;
        
    } catch (error) {
        console.error('Error fetching order:', error)
        throw error
        
    }
},
createOrder:async(orderData)=>{

try {
    const respone=await axios.post(API_URL,orderData);
    return respone.data;
    
} catch (error) {
    
    console.error('Error Creating Order.', error);
    throw error;
}

},

DeleteOrder:async(id)=>{
    try {
        const respone=await axios.delete(`${API_URL}/${id}`);
        return respone.data;
        
    } catch (error) {
        console.error('Error deleting order:', error)
        throw error
        
    }
},

}

export default orderservice;