const { subscribeToQueue } = require('./broker');
const userModel = require('../../models/user.model');

module.exports = async function () {

    subscribeToQueue("AUTH_SELLER_DASHBOARD_USER_CREATED",
        async (user) => {
            console.log("Received user created event in seller dashboard:", user);
            await userModel.create(user);
        }
    )





}