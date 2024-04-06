import {prisma} from "@/pages/prismaClient";

export default class Investor{
    instance = null;
    constructor(){
        this.instance= this;
    }

    // singleton design pattern. There will be a single Users registry which API routes
    // which API routes can communicated with to find users, their information, etc.
    static getInstance(){
        if(this.instance==null){
            this.instance= new Investor();
            return this.instance;
        }
        else{
            return this.instance;
        }
    }

    async addFavorite(username, coin_name){
        try{

            const favorite = await prisma.favorites.findUnique({
                where:{
                    userId_coin:{
                        userId: username,
                        coin: coin_name,
                    }
                }
            })
            if(favorite){
                await prisma.favorites.delete({
                    where:{
                        userId_coin:{
                            userId:username,
                            coin:coin_name,
                        }
                    }
                })
                return false;
            }

            else{
                const favorite ={
                    userId: username,
                    coin: coin_name,
                }
                await prisma.favorites.create({data:favorite});
                return true;
            }
        }

        catch(error){
            console.log(error);
            return false;
        }
    }

    async getFavorites(username){
        try{
            const favoritedCoins = await prisma.favorites.findMany({
                where:{
                    userId:username,
                },
                select:{
                    coin:true,
                }
            })

            return favoritedCoins;
        }

        catch(error){
            console.error(error);
            return null;
        }
    }

    async addPortfolioItem(username,coin,_name,amount,purchasePrice)
    {
        try
        {
            //Check if the item is already present
            const portfolioItem = await prisma.portfolio.findUnique({
                where:{
                    userId_coin:{
                        userId: username,
                        coin: coin_name,
                    }
                }
            })

            //if found, alter the current amoount and average price
            if(portfolioItem)
            {
                const newAmount = amount+portfolioItem.amountOwned;
                const newAverage = ((portfolioItem.averagePrice * portfolioItem.amountOwned) + purchasePrice)/newAmount;
                
                //If out of currency, remove from list
                if(newAmount <= 0)
                {
                    await prisma.favorites.delete({
                        where:{
                            userId_coin:{
                                userId:username,
                                coin:coin_name
                            }
                        }
                    })

                    return true;
                }
                //update the portfolio item
                const updatePortfolio = await prisma.portfolioItem.update(
                    {
                        where:{
                            userId_coin:{
                                userId: username,
                                coin: coin_name
                            }
                        },
                        data:{
                            amountOwned: newAmount,
                            averagePrice: newAverage
                        }
                    })
                    return true;
            }

            //if not found, create
            const addItem = await prisma.portfolio.create({data:portfolioItem})
            return true;
        }
        catch(error){
            console.log(error);
            return false;
        }
    }

    async getPortfolio(username){
        try{
            const portfolio = await prisma.portfolio.findMany({
                where:{
                    userId:username,
                },
                select:{
                    coin:true,
                    amountOwned:true,
                    averagePrice:true,
                }
            })

            return portfolio;
        }

        catch(error){
            console.error(error);
            return null;
        }
    }
}