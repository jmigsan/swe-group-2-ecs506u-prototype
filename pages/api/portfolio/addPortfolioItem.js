import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){

    const body = req.body;
    const username= body.username;
    const coin_name = body.coin_name;
    const amountOwned = body.amount;
    const purchasePrice = body.price;
    try{
        const investor = Investor.getInstance();
        const added = await investor.addPortfolioItem(username, coin_name,amountOwned,purchasePrice);
        
        if(added){
            res.status(200).json({message: "Added or updated"});
        }
    }

    catch(error){
        res.status(404).json({message: "error adding item"});
    }
    
}