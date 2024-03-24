import {prisma} from '@/pages/prismaClient'
import bcrypt from "bcryptjs"
export default async function handler(req, res){
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user ={
        firstName: name,
        email: email,
        password: hashedpassword,
    }
    await prisma.users.create({data: user})
    res.status(200).json({message: "Sucessfully registered"});
}