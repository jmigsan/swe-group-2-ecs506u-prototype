//File to add test data to the database
import { useSession } from "next-auth/react";
async function addData(username,coin_name,amount,price)
{
    try{
        const res = await fetch('../api/portfolio/addPortfolioItem', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username,coin_name,amount,price})
        })

    }

    catch(error){
        console.error(error);
    }
}

function addAll()
{
    //Temporary data for testing
    const data = [
    ["BTC",12,135.23],
    ["ETH",0.73,126.25],
    ["Coin3",13.14,35.26],
    ["Coin4",17,12.84]];
    const {data: session} = useSession();
    if(session)
    {
        const username = session.user.email;
        data.forEach((item) => addData(username,item[0],item[1],item[2]));
    }
}

export default addAll;