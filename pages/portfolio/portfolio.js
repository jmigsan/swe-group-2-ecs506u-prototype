import { Chart } from "react-google-charts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios"
import styles from '@/styles/portfolio.module.css';
/**	
Proposed table addition
Portfolio: UserID, Coin (String), Amount (Int), AveragePrice (Float)
@@id([UserID,coin])

Graph component. Take amount values from table, use as proportions for graph. May be best done as independant component

Take currencies and amount from list. Use average price across transactions to show change compared to current market
Update when buying or selling. Need to recalculate average price
(Amount*AveragePrice) +- (NewAmount*Price)

ToDo:
    Research API call, check how things are added. Can it be called for this, or should it be updated manually within DB
    Add to database, check how things are called
    Listing. Will need API call for current market price
    Formatting. May reference any other front end designs to maintain consistency
*/

//Function to get data into format designed for original database (coin,amount,totalSpent)
function setupPortfolio(balance,transactions)
{
    let portfolio = formatData(balance);
    console.log(portfolio);
    let sum = 0;

    //loop through each portfolio item, looking for transactions
    for(let i=0; i<portfolio.length; i++)
    {
        sum = 0;
        for(let j=0; j<transactions.length;j++)
        {
            //Calculate the total spent on the given currency
            if(transactions[j].Bought == portfolio[0])
            {
                sum = sum + (transactions[j].AmountBought * transactions[j].Price);
            }
        }
        portfolio[i].push(sum);
    }

    return portfolio;
}

//Function to format the response data into an array
function formatData(data)
{
    //return on empty
    if(data == [])
    {
        return [];
    }

    let newData=[];
    data.forEach((item)=> newData.push([item.coin,item.amountOwned]));

    return newData;
}

//function to check if prices are present
async function getPrices(data)
{
    const [prices,setPrices]=useState([]);
    let list =[]
    data.forEach((item) => list.push(item[0]))
    let coin =list.toString;
    let currency="USD";

    //call the function to get price with the list of owned currencies
    try{
        const prices = await fetch('../api/ExperiencedTrading/getCryptoPrice', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({coin,currency})
        })
        const response =await prices.json();
        setPrices(response.data);
    }
    catch(error)
    {
        res.status(404).json({message: "error fetching data"});
    }
    
    //append the price to the data
    for(let i=0;i<data.length;i++)
    {
        data[i].push(prices[i].quotes[0].quote.price);
    }
}

//function to get the average price of owned currency
function getAverage(amount,price)
{
    let average = price/amount;
    //Round to 2dp
    average = parseInt(average*100);
    average = parseFloat(average/100);
    return average
}

//function to get the % change if selling
function getChange(ownedPrice,marketPrice)
{
    //If currency not found, return N/A
    if(marketPrice==="N/A")
    {
        return marketPrice;
    }
    
    let change= marketPrice-ownedPrice;
    change = (change/ownedPrice)*100;
    
    change = parseInt(change*100);
    change= parseFloat(change/100);
    if(change > 0)
    {
        return "+"+change+"%";
    }
}

//function to create the pie chart
function PieChart({data})
{
    return(<Chart 
        chartType="PieChart"
        data={data}
        options={{is3D:true, height:300}} //Colours can be changed in options, but need to ensure enough colours are present
    />)
}

//Functions to create the list
function ListRow({data})
{
    let average = getAverage(data[1],data[2]);
    let change = getChange(average,marketPrice);
    return<tr className={styles.ListRow}><ListItem data={data[0]}/><ListItem data={data[1]}/>
    <ListItem data={average}/><ListItem data={data[3]}/><ListItem data={change}/></tr>
}

function ListItem({data})
{
    return <td className={styles.ListItem}data>{data}</td>
}

function ListHeading({data})
{
    return <th className={styles.ListHeader}data>{data}</th>
}

function List({data})
{
    return(<table id={styles.ListTable}>
        <thead><tr><ListHeading data="Coin"/><ListHeading data="Amount"/><ListHeading data="Average Price of Purchase"/>
        <ListHeading data="Current Price"/><ListHeading data="Expected Gain/Loss"/></tr></thead>
        <tbody>{data.map((item) => <ListRow data={item} marketData={marketData}/>)}</tbody>
    </table>);
}

function Portfolio()
{
    const[balance,setBalance]=useState([]);
    const[transactions,setTransactions]=useState([]);
    const {data: session} = useSession();

    async function getBalance()
    {
        if(session)
        {
            const username = session.user.email;
            try{
                const portfolio = await fetch('../api/Deposit/getBalance', {
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({username})
                })
                const response =await portfolio.json();
                setBalance(response);
            }
            catch(error)
            {
                res.status(404).json({message: "error fetching data"});
            }
        }
    }

    async function getTransactions()
    {
        if(session)
        {
            const username = session.user.email;
            try{
                const transactions = await fetch('../api/Deposit/getTransactions', {
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({username})
                })
                const response =await transactions.json();
                setTransactions(response);
            }
            catch(error)
           {
                res.status(404).json({message: "error fetching data"});
            }
        }
    }

    //Single use calls to the database
    useEffect(()=>{
        getBalance();
        getTransactions();
    }, [session]);

    let portfolio = setupPortfolio(balance,transactions);
    //Pie chart formatting
    let pieData=[];
    //Remove the total spent from the list
    for(let i=0; i<portfolio.length; i++)
    {
        pieData[i]=[...portfolio[i]];
        pieData[i].pop();
    }
    //Add headings
    pieData.unshift(["Coin","Amount owned"]);

    if(portfolio.length > 0)
    {
        return(<>
            <div id={styles.PageHeader}>Portfolio</div>
            <PieChart data={pieData} />
            <List data={portfolio} marketData={marketData}/>
        </>);
    }
    //If no transactions have been made
    else
    {
        return(<>Portfolio empty</>);
    }

}

export default Portfolio;