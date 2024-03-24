import Users from "@/pages/classes/User";
export default async function handler(req, res){
    const registry = Users.getInstance();
    const username = req.body.username;

    const exists = await registry.findUniqueUser(username, [true, true, true]);

    if(exists){
        res.status(200).json({message: "valid user"});
    }

    else{
        res.status(404).json({message: "invalid user"});
    }
}