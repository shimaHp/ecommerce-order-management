import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

function OrderList({ onSelectOrder, refreshTrigger }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  loadOrders();
}, [refreshTrigger]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Make sure your API is running on https://localhost:7043');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      0: '#ffc107',      // Pending
      1: '#2196F3',      // Processing
      2: '#9c27b0',      // Shipped
      3: '#4caf50',      // Delivered
      4: '#f44336'       // Cancelled
    };
    return colors[status] || '#999';
  };

  const getStatusName = (status) => {
    const names = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    return names[status] || 'Unknown';
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-list">
      <h2>Orders ({orders.length})</h2>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.customerEmail}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusName(order.status)}
                  </span>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <button onClick={() => onSelectOrder(order.id)}>
                    Details
                  </button>
                </td>
                <td>
                  <button onClick={() => onSelectOrder(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderList;