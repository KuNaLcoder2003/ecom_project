import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kunalindia59@gmail.com',
        pass: ''
    },
    secure: true,
    port: 465
})

async function sendMail(reciver_email_id: string, body: string, subject: string) {
    const response = await transporter.sendMail({
        from: 'kunalindia59@gmail.com',
        to: reciver_email_id,
        subject: subject,
        html: body
    })

    return response
}

export default sendMail;