const { subscribeToQueue } = require("./broker");
const { sendEmail } = require("../utils/emailService");

module.exports = function () {
    subscribeToQueue('AUTH_NOTIFICATION_USER_CREATED', async (msg) => {
        const { userId, email, username, fullName } = JSON.parse(msg.content.toString());

        const emailHtml = `
            <h1>Welcome to Our Service, ${fullName}!</h1>
            <p>Your account has been successfully created.</p>
            <p>Username: ${username}</p>
            <p>We're excited to have you on board!</p>
        `;
        await sendEmail(email, 'Welcome to Our Service!', emailHtml);
    });

    subscribeToQueue('PAYMENT_NOTIFICATION_COMPLETED', async (msg) => {
        const { paymentId, orderId, amount, currency, email } = JSON.parse(msg.content.toString());
        const emailHtml = `
            <h1>Payment Successful!</h1>
            <p>Your payment with ID: ${paymentId} for Order ID: ${orderId} has been successfully processed.</p>
            <p>Amount: ${amount} ${currency}</p>
            <p>Thank you for your purchase!</p>
        `;

        await sendEmail(email, 'Payment Successful', emailHtml);
    });


    subscribeToQueue('PAYMENT_NOTIFICATION_FAILED', async (msg) => {
        const { email, orderId, paymentId } = JSON.parse(msg.content.toString());
        const emailHtml = `
            <h1>Payment Failed</h1>
            <p>Unfortunately, your payment with ID: ${paymentId} for Order ID: ${orderId} could not be processed.</p>
            <p>Please try again or contact support if the issue persists.</p>
        `;
        sendEmail(email, 'Payment Failed', emailHtml);
    });

    subscribeToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", async (msg) => {
        const { productId, username, email } = JSON.parse(msg.content.toString());

        const emailHtml = `
            <h1>New Product Created!</h1>
            <p>Dear ${username},</p>
            <p>Your product with ID: ${productId} has been successfully created and is now live on our platform.</p>
            <p>Thank you for being a valued seller!</p>
        `;
        await sendEmail(email, 'Product Created Successfully', emailHtml);
    });


};