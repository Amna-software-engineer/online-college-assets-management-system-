import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetEmail = async (email, token) => {
    console.log(sendResetEmail,email, token,process.env.EMAIL);
    
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const resetLink = `http://localhost:5173/login/reset-password?token=${token}`;
    
     transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "HOD Account Setup — College Asset System",
        html: `
            <h3>HOD Account Setup</h3>
            <p>The Principal has set up an account for you.</p>
            <p>Click the link below to set your name and password:</p>
            <a href="${resetLink}" 
               style="background:#1F3864; color:white; padding:10px 20px; 
                      text-decoration:none; border-radius:5px;">
               Setup Account
            </a>
            <p>This link will be valid for 24 hours.</p>
        `
    },(error, info) => {
            if (error) {
                return res.status(500).json({ errs: ["Error while sending email"] });
            }
            res.status(200).json({ msg: "Reset Password link sent to your email" });
        });
};
