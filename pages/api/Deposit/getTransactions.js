import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body = req.body;
    const username = body.username

    try{
        const investor = Investor.getInstance();
        const transactions = await investor.getTransactions(username);
        res.status(200).json(transactions);
    }
    catch{
        res.status(404).json({message: "Couldnt retrieve transactions"})
    }
}