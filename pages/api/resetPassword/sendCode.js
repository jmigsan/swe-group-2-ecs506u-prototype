import nodemailer from 'nodemailer';
import Users from '@/pages/classes/User';
import emailConfig from '@/pages/config';
export default async function handler(req, res){
    const { email, password } = emailConfig;

    const registry = Users.getInstance();
    console.log(password);
    const exists = await registry.findUniqueUser(req.body.to, [true, true, true]);

    if(exists){
      const body = req.body;
      const code = body.code;
      const from =email;
      const to = body.to;
      const text = "Dear User, Here is your Verification code:" + code;
      const subject = "Verification Code";
      const transporter = nodemailer.createTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: email,
                pass: password,
              },
            });

            transporter.sendMail({
              subject, text, from, to
            });

            res.status(200).json({message: "Code Sent"});
      }

      else{
        res.status(404).json({message: "User Not Found"});
      }
}