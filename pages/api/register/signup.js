import {prisma} from '@/pages/prismaClient'
import bcrypt from "bcryptjs"
import User from "@/pages/classes/User";
export default async function handler(req, res){
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const role = body.role;
    
    try{
        const registry = User.getInstance();
        const signedUp = registry.signUp(name, email, password, role);

        if(signedUp){
            res.status(200).json({message: "Successfully signed up"});
        }
        else{
            res.status(404).json({message: "User exists"});
        }
    }

    catch(error){
        res.status(404).json({message: "Error registering user"})
    }
    
}