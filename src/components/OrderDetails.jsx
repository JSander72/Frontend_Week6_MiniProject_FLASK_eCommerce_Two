import React, { useState, useEffect } from 'react';

// Place Order Form Component
const PlaceOrderForm = ({ onSubmit }) => {
    const [orderDate, setOrderDate] = useState('');
    const [customer, setCustomer] = useState('');
    const [products, setProducts] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ orderDate, customer, products });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Order Date:</label>
                <input 
                    type="date" 
                    value={orderDate} 
                    onChange={(e) => setOrderDate(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Customer:</label>
                <input 
                    type="text" 
                    value={customer} 
                    onChange={(e) => setCustomer(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Products:</label>
                <input 
                    type="text" 
                    value={products} 
                    onChange={(e) => setProducts(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Place Order</button>
        </form>
    );
};

// Retrieve Order Details Component
const RetrieveOrderDetails = ({ orderId, orders }) => {
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div>
            <h2>Order Details</h2>
            <p>Order Date: {order.orderDate}</p>
            <p>Customer: {order.customer}</p>
            <p>Products: {order.products}</p>
        </div>
    );
};

// Track Order Status Component
const TrackOrderStatus = ({ orderId, orders }) => {
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div>
            <h2>Order Status</h2>
            <p>Order Date: {order.orderDate}</p>
            <p>Expected Delivery Date: {order.expectedDeliveryDate}</p>
        </div>
    );
};

// Main OrderDetails Component
const OrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch orders from the database
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders'); // Adjust the URL as needed
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handlePlaceOrder = async (order) => {
        const newOrder = { ...order, id: orders.length + 1, expectedDeliveryDate: '2023-12-31' };
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });
            const data = await response.json();
            setOrders([...orders, data]);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Order Processing</h1>
            <PlaceOrderForm onSubmit={handlePlaceOrder} />
            <div>
                <label>Search Orders by Customer:</label>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <ul>
                    {filteredOrders.map(order => (
                        <li key={order.id}>
                            {order.customer} - {order.orderDate}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <label>Retrieve Order by ID:</label>
                <input 
                    type="text" 
                    value={currentOrderId} 
                    onChange={(e) => setCurrentOrderId(e.target.value)} 
                />
                <RetrieveOrderDetails orderId={parseInt(currentOrderId)} orders={orders} />
                <TrackOrderStatus orderId={parseInt(currentOrderId)} orders={orders} />
            </div>
        </div>
    );
};

export default OrderDetails;