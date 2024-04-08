import Investor from "@/pages/classes/Investor";

export default async function handler(req, res){
    const body = req.body;
    const username =body.username;
    try{
            const registry = Investor.getInstance();
            await registry.deleteRequest(username);
            res.status(200).json({message: 'Successfully created request!'});
    }
    catch(error){
        res.status(404).json({message: "Issue creating request"});
    }
}