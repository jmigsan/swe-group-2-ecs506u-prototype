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
    Graph component. May be able to accomplish using react-graphs. Research React-google-charts may work
    Listing. Will need API call for current market price
    May be best to have both components in same file, so DB call can be a single method
    Formatting. May reference any other front end designs to maintain consistency
*/

function Portfolio()
{
    return(<div>Testing</div>);
}

export default Portfolio;