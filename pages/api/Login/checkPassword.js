import Users from "@/pages/classes/User";

export default async function handler(req, res){
    const body= req.body;
    const username =body.username;
    const password = body.password;
    try{
        const registry = Users.getInstance();
        const correct = await registry.checkPassword(username, password);
        if(correct){
            console.log("here");
            res.status(200).json({message:"Valid password"});
        }
        else{
            console.log("here");
            res.status(404).json({message:"Incorrect"});
        }
    }

    catch(err){
        res.status(500).json({message:"error Occurred"})
    }
}