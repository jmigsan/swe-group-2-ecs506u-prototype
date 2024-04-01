import Investor from "@/pages/classes/Investor";
export default async function handler(req, res){
    const body= req.body;
    const username= body.username;

    try{
        const investor = Investor.getInstance();
        const favoritedCoins = await investor.getFavorites(username);
        res.status(200).json(favoritedCoins);
    }

    catch(error){
        res.status(500).json({message: "Error"});
    }
}