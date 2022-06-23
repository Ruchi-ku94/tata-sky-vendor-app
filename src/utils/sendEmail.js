
const nodemailer = require("nodemailer")
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') })

const sendEmail = async(recepientMailId, subject, text) => {
    // set up transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
   // console.log("==========mail transporter")
    try{
        let mailOptions = {
            from: process.env.EMAIL,
            to: recepientMailId,
            subject: subject,
            text: text
        }
      //  console.log("==========mail options")
      //  console.log(mailOptions)
       
        const emailResp =  await transporter.sendMail(mailOptions)
        if(!emailResp.response){
            return { message: "Email Send Failed"}
        } 
        return emailResp;  
    }
    catch(err){

            console.log(err)
            return {error: err.message}
        }
   
}

module.exports = sendEmail