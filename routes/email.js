const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const nodemailer = require('nodemailer');

router.use(cors()); //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);






router.post('/sendOTP',(req,res)=>{ 
    // { email: '' , otp: '' }
    
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'idealxtest123@gmail.com',
            pass:'zuycivathmbukmzz'
        }
    });

    const mailOptions = {
        from:  'idealxtest123@gmail.com', // Sender address
        to: req.body.email, // List of recipients
        subject: 'Email Verification', // Subject line
        html: ``,
    };
    mailOptions.html = `
         <h3> Our team send you an verification. </h3>
         <h3> This will be your generated OTP.</h3>
         <strong>${req.body.otp}</strong>
        <br/><br/>
         Best Regards<br/>
         Staff<br/>
         <i>This is a generated email don't reply</i>
    `
    
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err)
          res.send('error')
        } else {
          console.log(info);
          res.send(info)
        }
    })




})



module.exports = router