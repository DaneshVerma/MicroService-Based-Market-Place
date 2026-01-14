const { subscribeToQueue } = require("./broker");
const { sendEmail } = require("../utils/emailService");

module.exports = function () {
    subscribeToQueue('auth_notification_user_created', async (msg) => {
        const { userId, email, username, fullName } = JSON.parse(msg.content.toString());
        
        const emailHtml = `
            <h1>Welcome to Our Service, ${fullName}!</h1>
            <p>Your account has been successfully created.</p>
            <p>Username: ${username}</p>
            <p>We're excited to have you on board!</p>
        `;
        await sendEmail(email, 'Welcome to Our Service!', emailHtml);
    });

};