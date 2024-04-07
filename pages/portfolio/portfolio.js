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

//Function to format the response data
function formatData(data)
{
    let newData=[];
    data.forEach((item)=> newData.push([item.coin,item.amountOwned,item.price]));

    return newData;
}


//function to check if prices are present
function getPrice(marketData,item)
{
    for(let i=0; i<marketData.length; i++)
    {
        if(marketData[i].symbol === item)
        {
            return marketData.quote.USD.price;
        }
    }
    return "N/A";
}

//function to create the pie chart
function PieChart(data)
{
    return(<Chart 
        chartType="PieChart"
        data={data}
        options={{is3D:true, height:300}} //Colours can be changed in options, but need to ensure enough colours are present
    />)
}

function getAverage(amount,price)
{
    let average = amount/price;
    //Round to 2dp
    average = parseInt(average*100);
    average = parseFloat(average/100);
    return average
}

function getChange(ownedPrice,marketPrice)
{
    //If currency not found, return N/A
    if(marketPrice==="N/A")
    {
        return marketPrice;
    }
    
    let change= marketPrice-ownedPrice;
    change = change/ownedPrice;
    
    change = parseInt(change*100);
    change= parseFloat(change/100);
    return change;
}
//Functions to create the list
function ListRow({data,marketData})
{
    let average = getAverage(data[1],data[2]);
    let marketPrice = getPrice(marketData,data[0]);
    return<tr className={styles.ListRow}><ListItem data={data[0]}/><ListItem data={data[1]}/>
    <ListItem data={average}/><ListItem data={marketPrice}/><ListItem data="N/A"/></tr>
}

function ListItem({data})
{
    return <td className={styles.ListItem}data>{data}</td>
}

function ListHeading({data})
{
    return <th className={styles.ListHeader}data>{data}</th>
}

function List({data,marketData})
{
    return(<table id={styles.ListTable}>
        <thead><tr><ListHeading data="Coin"/><ListHeading data="Amount"/><ListHeading data="Average Price of Purchase"/>
        <ListHeading data="Current Price"/><ListHeading data="Expected Gain/Loss"/></tr></thead>
        <tbody>{data.map((item) => <ListRow data={item}/>)}</tbody>
    </table>);
}

function Portfolio()
{
    const[data,setData]=useState([]);
    const [marketData, setMarketData]= useState([]);
    const {data: session} = useSession();

     async function getData()
    {
        if(session)
        {
            const username = session.user.email;
            try{
                const portfolio = await fetch('../api/portfolio/getPortfolioItems', {
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({username})
                })
                const response =await portfolio.json();
                setData(response);
            }
            catch(error)
           {
                res.status(404).json({message: "error fetching data"});
            }
        }
    }

    async function getMarketData(){        
        try{
             const response=await axios.get('http://localhost:3000/api/ExperiencedTrading/experienced');
             setMarketData(response.data.data);
        }

        catch(error){
         console.error(error);
        }
    }

    useEffect(()=>{
        getData();
      }, [session]);

    useEffect(()=>{
        console.log("here");
        getMarketData();
    },[]);


    //altering format for pie chart and list
    const newData=formatData(data);
    //Pie chart formatting
    let pieData=[];
    for(let i=0; i<newData.length; i++)
    {
        pieData[i]=[...newData[i]];
        pieData[i].pop();
    }
    pieData.unshift(["Coin","Amount owned"]);

    if(newData.length >0)
    {
        return(<>
            <div id={styles.PageHeader}>Portfolio</div>
            <PieChart data={pieData} />
            <List data={newData} marketData={marketData}/>
        </>);
    }
    else
    {
        return(<>Portfolio empty</>);
    }

}

export default Portfolio;