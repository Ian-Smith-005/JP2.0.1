const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', (req, res) => {
    const { fullName, email, phoneNumber, serviceType, location } = req.body;

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourEmail@gmail.com', // Replace with your email
            pass: 'yourEmailPassword',  // Replace with your email password
        },
    });

    const mailOptions = {
        from: email || 'noreply@yourdomain.com',
        to: 'smithiian34@gmail.com',
        subject: 'New Photography Service Order',
        text: `Full Name: ${fullName}\nEmail: ${email || 'Not provided'}\nPhone Number: ${phoneNumber}\nService: ${serviceType}\nLocation: ${location}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
