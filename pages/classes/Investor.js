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

    async Trade(type, username, bought, sold, amountBought, amountSold, price){
        try{
            const data={
                userId:username,
                Bought:bought,
                Sold:sold,
                Type:type,
                Price:price,
                AmountSold:amountSold,
                AmountBought:amountBought,
            }

            await this.updateBalance(amountBought, bought, username);
            await this.updateBalance(-amountSold, sold, username);

            const trade =await prisma.trade.create({data:data})
            return true;
        }
        catch(error){
            console.error(error);
            return false;
        }
    }

    async getLimits(username){
        try{
            const limits = await prisma.limitOrder.findMany({
                where:{
                    userId:username,
                }
            })

            return limits;
        }

        catch(error){
            console.error(error);
            return null;
        }
    }

    async getTransactions(username){
        try{
            const transactions = await prisma.trade.findMany({
                where:{
                    userId:username,
                },

                orderBy:{
                    createDate: 'desc'
                }
            });

            return transactions;
        }
        catch{
            console.error(error);
            return null;
        }
    }
    async createLimit(type, username, bought, sold, amountBought, amountSold, price){
        try{
            const data={
                userId:username,
                Bought:bought,
                Sold:sold,
                Type:type,
                Price:price,
                AmountSold:amountSold,
                AmountBought:amountBought,
            }

            const trade =await prisma.limitOrder.create({data:data})
            return true;
        }
        catch(error){
            console.error(error);
            return false;
        }
    }

    async deleteLimit(id){
        try{
            await prisma.limitOrder.delete({
                where:{
                    id:id,
                }
            })

            return true;
        }
        catch(error){
            console.error(error)
            return false;
        }
    }
    async addFavorite(username, coin_name, coin_symbol){
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
                    symbol: coin_symbol,
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

    async getBalance(user){
        try{
            const balance = await prisma.balance.findMany({
                where:{
                    userId:user,
                },

                select:{
                    currency:true,
                    amount:true,
                }
            })

            return balance;
        }
        catch(error){
            console.error(error);
            return 0;
        }
    }

    async updateBalance(amount, Currency, user){
        try{
            const currency = await prisma.balance.findUnique({
                where:{
                    userId_currency:{
                        userId: user,
                        currency: Currency,
                    }
                }
            })

            if(currency){
                const new_currency = currency.amount+ amount;
                await prisma.balance.update({
                    where:{
                        userId_currency:{
                            userId: user,
                            currency: Currency,
                        }
                    },

                    data:{
                        amount: new_currency,
                    }
                })

                return true;
            }

            else{
            const data ={
                currency:Currency,
                amount:amount,
                userId:user,
            }
            await prisma.balance.create({data:data});
            return true;
        }
        }

        catch(error){
            console.error(error)
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
                    symbol:true,
                }
            })

            return favoritedCoins;
        }

        catch(error){
            console.error(error);
            return null;
        }
    }


    async createRequest(username){
        try{
            const data={
                userId:username,
            }

            await prisma.chatRequests.create({data:data});
        }
        catch(error){
            console.error(error);
            return false;
        }
    }

    async getRequests(){
        try{
            const requests = await prisma.chatRequests.findMany();
            return requests;
        }
        catch(error){
            console.log(error);
        }
    }

    async getLimitOrders(username){
        try{
            const orders = await prisma.limitOrder.findMany({
                where:{
                    userId:username
                }
            })

            return orders;
        }
        catch(error){
            console.error(error)
            return null;
        }
    }
}