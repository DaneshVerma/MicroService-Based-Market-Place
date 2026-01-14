const app = require('./src/app');





app.listen(process.env.PORT || 3006, () => {
    console.log(`Notification service is running on port ${process.env.PORT || 3006}`);
});
