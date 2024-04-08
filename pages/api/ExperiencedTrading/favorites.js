import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){

    const body = req.body;
    const username= body.username;
    const coin_name = body.coin_name;
    const coin_symbol = body.coin_symbol;
    try{
        const investor = Investor.getInstance();
        const added = await investor.addFavorite(username, coin_name, coin_symbol);
        
        if(added){
            res.status(200).json({message: "Favorite Added"});
        }

        else{
            res.status(404).json({message: "Favorite Removed"});
        }
    }

    catch(error){
        res.status(404).json({message: "error adding favorite"});
    }
    
}