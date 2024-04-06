import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){

    const body = req.body;
    const username= body.username;

    try{
        const investor = Investor.getInstance();
        const portfolio = await investor.getPortfolio(username);
        res.status(200).json(portfolio);
    }

    catch(error){
        res.status(404).json({message: "error fetching item"});
    }
}