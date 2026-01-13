const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    }
})

transporter.verify((error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Ready to Send Mail');
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ' + error.message);
            return;
        }
        console.log('Email sent: ' + info.response);
    }

    );
}

module.exports = { sendEmail };

