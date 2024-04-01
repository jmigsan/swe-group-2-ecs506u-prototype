import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body = req.body;
    const amount= Number(body.amount);
    const currency = body.currency;
    const username = body.username;

    try{
        const investor = Investor.getInstance();
        await investor.updateBalance(amount, currency, username);
        res.status(200).json({message: "Balance Updated"})
    }

    catch(error){
        res.status(500).json({message: "Balance not updated "})
    }

}