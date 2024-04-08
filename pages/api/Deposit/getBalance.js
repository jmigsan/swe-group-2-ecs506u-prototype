import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body = req.body;
    const username = body.username;

    try{
        const investor = Investor.getInstance();
        const balance = await investor.getBalance(username);

        res.status(200).json(balance);
    }

    catch(error){
        res.status(200).json({message:"error finding balance"})
    }
}