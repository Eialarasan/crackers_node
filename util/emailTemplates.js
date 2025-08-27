export const getNewOrderEmailTemplate = (orderDetails, customerDetails) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #ff6b00;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .order-details {
                    background-color: white;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                }
                .button {
                    background-color: #ff6b00;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Crackers Order Received! 🎆</h1>
                </div>
                
                <div class="order-details">
                    <h2>Order Details</h2>
                    <p><strong>Order ID:</strong> ${orderDetails.id}</p>
                    <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>
                    <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
                    <p><strong>Payment Type:</strong> ${orderDetails.paymentType}</p>
                    
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${customerDetails.customerName}</p>
                    <p><strong>Phone:</strong> ${customerDetails.phoneNumber}</p>
                    <p><strong>Delivery Address:</strong> ${customerDetails.deliveryAddress}</p>
                    
                    <h3>Product Details</h3>
                    <ul>
                    ${orderDetails.productDetails.map(product => `
                        <li>${product.name} - Quantity: ${product.quantity} - ₹${product.price}</li>
                    `).join('')}
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Please process this order as soon as possible. The customer is waiting for their festive crackers!</p>
                    <p>Thank you for using our platform!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
