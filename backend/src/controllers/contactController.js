import nodemailer from 'nodemailer';

export const mailContact = async(req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ error: "Message should be at least 10 characters long" });
  }

  console.log("Received:", { name, email, message });

  const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: {
            name: "Titli Foundation",
            address: process.env.EMAIL
        },
        to: "ishanroy3118107@gmail.com",
        subject: `New Message from ${name}`,
        html: `
            <div style="background-color: #0B1411; color: #ffffff; padding: 40px; font-family: 'Outfit', sans-serif; border-radius: 8px;">
                <h2 style="color: #E5FC54; border-bottom: 1px solid rgba(229, 252, 84, 0.2); padding-bottom: 10px;">New Website Enquiry - Titli Foundation</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 4px; border-left: 4px solid #E5FC54; margin-top: 20px;">
                    <p style="margin: 0; font-style: italic;">"${message}"</p>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: rgba(255,255,255,0.5);">Sent from Titli Foundation website.</p>
            </div>
        `,
    };

    const confirmationMail = {
        from: {
            name: "Titli Foundation",
            address: process.env.EMAIL
        },
        to: email,
        subject: "We've received your message! - Titli Foundation",
        html: `
            <div style="background-color: #0B1411; color: #ffffff; padding: 40px; font-family: 'Outfit', sans-serif; border-radius: 8px; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #E5FC54; font-family: 'Cinzel Decorative', serif; margin: 0; font-size: 28px;">Titli</h1>
                    <p style="color: rgba(229, 252, 84, 0.6); margin: 0; letter-spacing: 2px; font-size: 10px; text-transform: uppercase;">Foundation</p>
                </div>
                
                <h2 style="color: #E5FC54;">Hi ${name},</h2>
                <p>Thank you for reaching out to <strong>Titli Foundation</strong>. We've received your message and appreciate you taking the time to connect with us.</p>
                
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 2px solid #E5FC54;">
                    <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);"><strong>Your message:</strong><br/>
                    <span style="font-style: italic;">"${message.length > 100 ? message.substring(0, 100) + '...' : message}"</span></p>
                </div>

                <p>Our team is currently reviewing your enquiry regarding our initiative. We will get back to you shortly—usually within 24-48 hours.</p>
                
                <p>In the meantime, feel free to explore more of our work on our website.</p>
                
                <div style="margin-top: 40px; border-top: 1px solid rgba(229, 252, 84, 0.1); padding-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5);">
                    <p style="margin: 0;">Warm regards,<br/><strong>The Titli Foundation Team</strong></p>
                    <p style="margin-top: 10px;"><em>ESTD 2021</em></p>
                </div>
            </div>
        `,
    };    

    try {
        await Promise.all([
            transporter.sendMail(mailOptions),
            transporter.sendMail(confirmationMail)
        ]);        
        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Mail Error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
}