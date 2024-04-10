import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body = req.body;
    const username=body.username;
    const key = body.key;

    try{
        const investor = Investor.getInstance();
        await investor.createKey(username, key);
        res.status(200).json({message: 'API key created successfully'})
    }

    catch(err){
        res.status(200).json({message: err.message});
    }
}