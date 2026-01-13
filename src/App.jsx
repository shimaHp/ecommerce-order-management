import { useState } from 'react';
import './App.css';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import CreateOrder from './components/CreateOrder';

function App() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderCreated = () => {
    setShowCreateForm(false);
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    <div className="App">
      <header>
        <h1>📦 Order Management Dashboard</h1>
      </header>

      <main>
        {showCreateForm ? (
          <CreateOrder
            onOrderCreated={handleOrderCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : selectedOrderId ? (
          <OrderDetails
  orderId={selectedOrderId}
  onClose={() => setSelectedOrderId(null)}
  onStatusUpdated={() => setRefreshTrigger(prev => prev + 1)}
/>
        ) : (
          <>
            <div className="actions-bar">
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                + Create New Order
              </button>
            </div>
            <OrderList
              onSelectOrder={setSelectedOrderId}
              refreshTrigger={refreshTrigger}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;