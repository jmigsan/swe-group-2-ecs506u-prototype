import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body = req.body;
    const from = body.from;
    const to = body.to;
    const coin = body.coin;
    const amount = Number(body.amount);
    try{
        const investor = Investor.getInstance();
        await investor.transfer(from, to, coin, amount);
        res.status(200).json({message: "transfer successful"})
    }
    catch(err){
        res.status(404).json({message:err.message});
    }

}