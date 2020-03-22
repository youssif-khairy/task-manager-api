const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{

    sgMail.send({
        to: email,
        from:'youssifaly55@yahoo.com',
        subject:'Thanks for joining in!',
        text: `Welcome to the app, ${name}. We will keep you updated all the time.`
    })

}
const sendCancelationEmail = (email, name)=>{

    sgMail.send({
        to: email,
        from:'youssifaly55@yahoo.com',
        subject:'Thanks for Canciling Email Go To Hill!',
        text: `Your Email Has Been Cancelled ${name}.Fuck You!`
    })

}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
