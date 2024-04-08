import Investor from "@/pages/classes/Investor";

export default async function handler(req, res){

    const body = req.body;
    const username= body.username;
    const bought = body.bought;
    const sold = body.sold;
    const amountBought = parseFloat(body.amountBought);

    const amountSold = parseFloat(body.amountSold);
    const type = body.type;
    const price = parseFloat(body.price);

    try{
        const investor = Investor.getInstance();
        const opened = investor.Trade(type, username, bought, sold, amountBought, amountSold, price);
        
        if(opened){
            console.log("here2")
            res.status(200).json({message: "Trade opened successfully"})
        }

        else{
            res.status(404).json({message: "Trade not opened successfully"})
        }
    }

    catch(error){
        console.error(error);
        res.status(404).json({message: "Error opening Trade"})
    }
}