import { Chart } from "react-google-charts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from '@/styles/portfolio.module.css';

//Function to get data into format designed for original database (coin,amount,totalSpent)
function setupPortfolio(balance,transactions,prices,rates)
{
    let portfolio = formatData(balance);
    let sum = 0;

    //loop through each portfolio item, looking for transactions
    for(let i=0; i<portfolio.length; i++)
    {
        sum = 0;
        for(let j=0; j<transactions.length;j++)
        {

            //Calculate the total spent on the given currency
            if((transactions[j].Bought == portfolio[i][0]) && (transactions[j].Type==="Buy"))
            {
                sum = sum + (transactions[j].AmountBought * transactions[j].Price / rates[transactions[j].Sold]);
            }
        }
        portfolio[i][2] = sum ;
        if(prices)//Only run if prices have been fetched
        {
            portfolio.forEach((item) => item[3] = getPrice(prices,item));
        }
    }
    return portfolio;
}

function convertCurrency(price,currency)
{
    if(currency==="USD")
    {
        return price;
    }
}
//function to get an individual price
function getPrice(prices,data)
{
    let index = data[0];
    if(prices[index])
    {
        if(typeof prices[index].quote.USD.price === 'number'){return prices[index].quote.USD.price;};
    }
    return "N/A";
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
    data.forEach((item)=> newData.push([item.currency,item.amount]));

    return newData;
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
    if((marketPrice ==="N/A"))
    {
        return marketPrice;
    }
    
    let change= marketPrice-ownedPrice;
    change = (change/ownedPrice)*100;
    change = parseInt(change*100);
    change= parseFloat(change/100);
    if(change >= 0)
    {
        return "+"+change+"%";
    }
    else if(change<0)
    {
        return change+"%";
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
    let change = getChange(average,data[3]);
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
   return(
    <div className={styles.ListTableContainer}>
    <table id={styles.ListTable}>
        <thead><tr><ListHeading data="Coin"/><ListHeading data="Amount Owned"/><ListHeading data="Average Price of Purchase ($)"/>
        <ListHeading data="Current Price ($)"/><ListHeading data="Expected Gain/Loss"/></tr></thead>
        <tbody>{data.map((item) => <ListRow data={item}/>)}</tbody>
    </table>
    </div>);
}

function Portfolio()
{
    const[balance,setBalance]=useState([]);
    const[transactions,setTransactions]=useState([]);
    const[prices,setPrices]=useState();
    const[rates,setRates]=useState();
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

    async function getPrices(balance)
    {
        let list =[]
        for(let i=0; i<balance.length;i++)
        {
            list[i]=balance[i].currency;
        }
        if(list.length === 0)
        {
            return;
        }
        const coin =list.toString();
        const currency="USD";
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
    }

    async function getRates()
    {
        const currency="USD";
        try{
            const prices = await fetch('../api/portfolio/marketRates', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({currency})
            })
            const response =await prices.json();
            setRates(response.conversion_rates);
            console.log(rates);
        }
        catch(error)
        {
            res.status(404).json({message: "error fetching data"});
        }
    }
    //Single use calls to the database
    useEffect(()=>{
        getBalance();
        getTransactions();
    }, [session]);

    if((!prices) && (balance.length>0))
    {
        getPrices(balance);
    }

    if(!rates)
    {
        getRates();
        return(<>Loading</>);
    }
    //Set up the fetched values into the required format
    let portfolio = setupPortfolio(balance,transactions,prices,rates);
    //Calculate the total value of the users portfolio, based on the current market price
    let totalValue = 0;
    //Pie chart formatting
    let pieData=[];
    //Remove the total spent from the list
    for(let i=0; i<portfolio.length; i++)
    {
        pieData[i]=[portfolio[i][0],portfolio[i][1]];
    }

    portfolio.forEach((item) => totalValue=totalValue+(item[1]*item[3]))
    //Add headings
    pieData.unshift(["Coin","Amount owned"]);

    if(portfolio.length > 0)
    {
        return(<>
            <div id={styles.PageHeader}>Portfolio</div>
            <div id={styles.totalValue}>Total Value: ${totalValue}</div>
            <PieChart data={pieData} />
            <List data={portfolio}/>
        </>);
    }
    //If the portfolio is empty
    else
    {
        return(<><div id={styles.PageHeader}>Portfolio</div>
        <div id={styles.emptyMessage}>Your portfolio is empty. As you buy currencies, they will appear here</div></>);
    }

}

export default Portfolio;

