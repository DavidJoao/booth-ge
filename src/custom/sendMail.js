import { SMTPClient } from "emailjs"

export const sendMail = ( emailOptions, req, res, next ) => {

    const client = new SMTPClient({
        user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
        password: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        host: "smtp.office365.com",
        tls: {
            ciphers: "SSLv3",
        },
    })
  
      client.send(emailOptions, (error, info) => {
        if (error) {
            console.error(error)
            res.status(500).end("Failed to send the email")
        } else {
            console.log("Email sent:", info.response)
            res.status(200).end("Email sent successfully")
        }
    })


}
