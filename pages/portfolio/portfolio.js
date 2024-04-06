import { Chart } from "react-google-charts";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
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

//function to create the pie chart
function PieChart({data})
{
    return(<Chart 
        chartType="PieChart"
        data={data}
        options={{is3D:true, height:300}} //Colours can be changed in options, but need to ensure enough colours are present
    />)
}

function ListRow({data})
{
    return<tr className={styles.ListRow}><ListItem data={data[0]}/><ListItem data={data[1]}/>
    <ListItem data={data[2]}/><ListItem data="N/A"/><ListItem data="N/A"/></tr>
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
    data.shift() //Remove headings
    return(<table id={styles.ListTable}>
        <thead><tr><ListHeading data="Coin"/><ListHeading data="Amount"/><ListHeading data="Average Price of Purchase"/>
        <ListHeading data="Current Price"/><ListHeading data="Expected Gain/Loss"/></tr></thead>
        <tbody>{data.map((item) => <ListRow data={item}/>)}</tbody>
    </table>);
}

function Portfolio()
{
    const {data: session} = useSession();
    useEffect(()=>{
       getData();
     }, [session]);

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
                console.log(response);
            }
            catch(error)
           {
                res.status(404).json({message: "error fetching data"});
            }
        }
    }

    const data = getData();
    //altering format for pie chart
    //let pieData = [...data];

    //pieData.forEach((item) => item.pop);

    return(<>

    </>);
        //<div id={styles.PageHeader}>Portfolio</div>
        //<PieChart data={pieData} />
        //<List data={data}/>
}

export default Portfolio;