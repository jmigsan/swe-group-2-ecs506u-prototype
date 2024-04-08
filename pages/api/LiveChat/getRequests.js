import Investor from "@/pages/classes/Investor";

export default async function handler(req, res){
    try{
        const investor = Investor.getInstance();
            const requests= await  investor.getRequests();
            res.status(200).json(requests);
    }
    catch(error){
        res.status(404).json({message:"Error fetching requests"})
    }
}