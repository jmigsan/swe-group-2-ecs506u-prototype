import Users from "@/pages/classes/User";

export default async function handler(req, res){
    const body= req.body;
    const username =body.username;
    
    try{
        const registry = Users.getInstance();
        const exists = await registry.findUniqueUser(username, [true, true, true])
        if(exists){
            res.status(200).json({message:"Valid Username"});
        }
        else{
            res.status(404).json({message:"User does not exist"});
        }
    }

    catch(err){
        res.status(500).json({message:"error Occurred"})
    }
}