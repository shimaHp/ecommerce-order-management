import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

function OrderDetails({ orderId, onClose,onStatusUpdated  }) {
  const [status, setStatus] = useState(0);
const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      console.error('Error loading order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
  try {
    setSaving(true);
    await orderService.updateOrderStatus(order.id, status);

    // update local UI
    setOrder({ ...order, status });

     onStatusUpdated();
  } catch (err) {
    console.error(err);
    alert('Failed to update order status');
  } finally {
    setSaving(false);
  }
};


  const getStatusName = (status) => {
    const names = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    return names[status] || 'Unknown';
  };

  if (loading) return <div className="loading">Loading details...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="order-details">
      <div className="details-header">
        <h2>Order Details - {order.orderNumber}</h2>
        <button onClick={onClose}>✕ Close</button>
      </div>

      <div className="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {getStatusName(order.status)}</p>
      </div>

      <div className="status-update">
  <h3>Update Order Status</h3>

  <select
    value={status}
    onChange={(e) => setStatus(Number(e.target.value))}
    disabled={saving}
  >
    <option value={0}>Pending</option>
    <option value={1}>Processing</option>
    <option value={2}>Shipped</option>
    <option value={3}>Delivered</option>
    <option value={4}>Cancelled</option>
  </select>

  <button
    className="btn-primary"
    onClick={handleUpdateStatus}
    disabled={saving || status === order.status}
  >
    {saving ? 'Saving...' : 'Update Status'}
  </button>
</div>

      <div className="order-items">
        <h3>Order Items</h3>
        {order.orderItems && order.orderItems.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="order-total">
              <strong>Total Amount: ${order.totalAmount.toFixed(2)}</strong>
            </div>
          </>
        ) : (
          <p>No items in this order.</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;