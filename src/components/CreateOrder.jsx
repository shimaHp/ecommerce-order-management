import React, { useState } from 'react';
import orderService from '../services/orderService';

function CreateOrder({ onOrderCreated, onCancel }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState([
    { productName: '', quantity: 1, unitPrice: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add new item row
  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0 }]);
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update item field
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'productName' ? value : Number(value);
    setItems(updatedItems);
  };

  // Calculate total
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setError('Valid email is required');
      return;
    }
    if (items.some(item => !item.productName.trim())) {
      setError('All items must have a product name');
      return;
    }
    if (items.some(item => item.quantity <= 0 || item.unitPrice <= 0)) {
      setError('Quantity and price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        items: items.map(item => ({
          productName: item.productName.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      await orderService.createOrder(orderData);
      
      // Success! Reset form and notify parent
      setCustomerName('');
      setCustomerEmail('');
      setItems([{ productName: '', quantity: 1, unitPrice: 0 }]);
      onOrderCreated(); // This will refresh the order list
      
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order">
      <div className="form-header">
        <h2>Create New Order</h2>
        <button onClick={onCancel} className="btn-secondary">
          ✕ Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="form-section">
          <h3>Customer Information</h3>
          
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Customer Email *</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
              disabled={loading}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="form-section">
          <div className="section-header">
            <h3>Order Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="btn-add"
              disabled={loading}
            >
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-number">{index + 1}</div>
              
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={item.productName}
                  onChange={(e) => updateItem(index, 'productName', e.target.value)}
                  placeholder="Enter product name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  min="1"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Unit Price *</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Subtotal</label>
                <div className="subtotal">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn-remove"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;