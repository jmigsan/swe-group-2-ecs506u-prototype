import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "@/styles/experienced.module.css"
import axios from "axios"
import Image from "next/image";
import { filterProps } from "framer-motion";
import toggledAsc from "@/public/images/toggledAsc.png";
import toggledDesc from "@/public/images/toggledDesc.png";
import untoggledAsc from "@/public/images/untoggledAsc.png";
import untoggledDesc from "@/public/images/untoggledDesc.png";
import likedImage from "@/public/images/liked.png";
import unliked from "@/public/images/unliked.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import nextLeft from "@/public/images/nextLeft.png";
import nextRight from "@/public/images/nextRight.png";
import noNextLeft from "@/public/images/noNextLeft.png";
import noNextRight from "@/public/images/noNextRight.png";
const HRNumbers = require('human-number');
export default function Experienced(){
    const [marketData, setMarketData]= useState([]);
    const [shownData, setShownData]= useState([]);
    const [toggles, setToggles] = useState([[false, false], [false, false], [false, false], [false, false], [false, false]]);
    const [changeTime, setChangeTime] = useState("24h");
    const [filterAsc, setFilterAsc] = useState(["name", true]);
    const [favorites, setFavorites] = useState([]);
    const [liked, setLiked]= useState([]);
    const [changeToggled, setChangeToggled] = useState(false);
    const [filter, setFilter]=useState("all");
    const [pageNumber, setPageNumber] = useState(1);
    const [allowedCryptos, setAllowedCryptos] = useState([])
    const {data: session} = useSession();
    const router = useRouter();
  
    async function fetchData(){        
        try{
             const response=await axios.get('http://localhost:3000/api/ExperiencedTrading/experienced');
             const allowedCrypto = await axios.get('http://localhost:3000/api/ExperiencedTrading/allowedCryptos');
             if(session?.user.role=="Staff"){
                setMarketData(response.data.data);
            }

            else{
                
                setMarketData((marketData)=>{
                    return response.data.data.filter(function(item){
                        for(let i=0; i<allowedCrypto.data.length; i++){
                            if(item.name==allowedCrypto.data[i].coin){
                                return true;
                            }
                        }

                        return false;
                    })
                });
            }

            
                setShownData((shownData)=>{
                return response.data.data.filter(function(item){
                    for(let i=0; i<allowedCrypto.data.length; i++){
                        if(item.name==allowedCrypto.data[i].coin){
                            return true;
                        }
                    }

                    return false;
                })
            });
            
            setAllowedCryptos(allowedCrypto.data)
        }

        catch(error){
         console.error(error);
        }
 }




 useEffect(()=>{

        fetchData();
        fetchFavorites();
    

 }, [session]);


 useEffect(()=>{
    const new_arr = Array.from(shownData, x=>false);
    let count=0;
    for(let i=0; i<shownData.length; i++){
        for(let j=0; j<favorites.length; j++){
            if(shownData[i].name==favorites[j].coin){
                count+=1;
                new_arr[i]=true;
            }
        }

        if(count==favorites.length){
            setLiked((liked)=>{return new_arr;})
            break;
        }
    }
    setLiked((liked)=>{return new_arr;})

 }, [shownData, favorites]);
 async function fetchFavorites(){
    if(session){
        const username = session.user.email;
        try{
        const favorites = await fetch('../api/ExperiencedTrading/getFavorites', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username})
         })
         const response =await favorites.json();
         setFavorites(response);
        }
        catch(error){
            console.error(error);
        }
    }

 }
 useEffect(()=>{
    let new_arr = shownData.sort(sortFunction);
    new_arr=[...new_arr];
    setShownData(new_arr);
 }, [filterAsc, marketData]);
 
function sortFunction(a, b){
    const filter2 = filterAsc[0];
    if(filterAsc[1]){
        if(filter2=="name"){
            if(a.symbol>b.symbol){
                return -1;
            }
            else if(a.symbol<b.symbol){
                return 1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="marketCap"){
            if(a.quote.USD.market_cap>b.quote.USD.market_cap){
                return -1;
            }
            else if(a.quote.USD.market_cap<b.quote.USD.market_cap){
                return 1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="volume"){
            if(a.quote.USD.volume_24h>b.quote.USD.volume_24h){
                return -1;
            }
            else if(a.quote.USD.volume_24h<b.quote.USD.volume_24h){
                return 1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="change"){
            if(a.quote.USD.percent_change_24h>b.quote.USD.percent_change_24h){
                return -1;
            }
            else if(a.quote.USD.percent_change_24h<b.quote.USD.percent_change_24h){
                return 1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="price"){
            if(a.quote.USD.price>b.quote.USD.price){
                return -1;
            }
            else if(a.quote.USD.price<b.quote.USD.price){
                return 1;
            }
            else{
                return 0;
            }
        }
    }

    else{
        if(filter2=="name"){
            if(a.symbol>b.symbol){
                return 1;
            }
            else if(a.symbol<b.symbol){
                return -1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="marketCap"){
            if(a.quote.USD.market_cap>b.quote.USD.market_cap){
                return 1;
            }
            else if(a.quote.USD.market_cap<b.quote.USD.market_cap){
                return -1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="volume"){
            if(a.quote.USD.volume_24h>b.quote.USD.volume_24h){
                return 1;
            }
            else if(a.quote.USD.volume_24h<b.quote.USD.volume_24h){
                return -1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="change"){
            if(a.quote.USD.percent_change_24h>b.quote.USD.percent_change_24h){
                return 1;
            }
            else if(a.quote.USD.percent_change_24h<b.quote.USD.percent_change_24h){
                return -1;
            }
            else{
                return 0;
            }
        }

        else if(filter2=="price"){
            if(a.quote.USD.price>b.quote.USD.price){
                return 1;
            }
            else if(a.quote.USD.price<b.quote.USD.price){
                return -1;
            }
            else{
                return 0;
            }
        }
    }
}


function dynamicSort(property){

    if(property=="gainer"){
        return function(a, b){
        if(a.quote.USD.percent_change_24h>b.quote.USD.percent_change_24h){
            return -1;
        }
        else if(a.quote.USD.percent_change_24h<b.quote.USD.percent_change_24h){
            return 1;
        }
        else{return 0;}
    }
    }
    else if(property=="loser"){
        return function(a, b){
        if(a.quote.USD.percent_change_24h>b.quote.USD.percent_change_24h){
            return 1;
        }
        else if(a.quote.USD.percent_change_24h<b.quote.USD.percent_change_24h){
            return -1;
        }
        else{return 0;}
    }
    }
    else if(property=="volume"){
        return function(a, b){
        if(a.quote.USD.volume_24h>b.quote.USD.volume_24h){
            return -1;
        }
        else if(a.quote.USD.volume_24h<b.quote.USD.volume_24h){
            return 1;
        }
        else{return 0;}
    }
    }

    else if(property=="new"){
        return function(a, b){
            let a_time=-99;
            let b_time=-99;
            for(let i=0; i<allowedCryptos.length; i++){
                if(a.name==allowedCryptos[i].coin){
                    a_time=allowedCryptos[i].createDate;
                }
                else if(b.name==allowedCryptos[i].coin){
                    b_time=allowedCryptos[i].createDate;
                }
            }

            if(a_time==-99){
                return 1
            }
            if(a_time>b_time){
                return -1;
            }
            else if(a_time<b_time){
                return 1;
            }
            else{
                return 0;
            }
        }
    }
}
function toggle(index, element){
    const new_arr = Array.from(toggles, x=>[false, false]);
    new_arr[index][element] = true;
    setToggles(new_arr);
}



 function handleButtonClick (index){
    const buttons = document.querySelectorAll('#filter');
    const underlines = document.querySelectorAll('#underline');
    // Iterate through all buttons and reset their styles
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.color = "gray";
      underlines[i].style.display = "none";
    }
  
    // Set the clicked button's color to black
    buttons[index].style.color = "black";
    underlines[index].style.display = "inline-block";

  };

  function handleNavClick(filter){

    if(filter=="favorites"){
        const new_arr=[];
        let count=0;
        for(let i=0; i<marketData.length; i++){
            for(let j=0; j<favorites.length; j++){
                if(marketData[i].name==favorites[j].coin){
                    count+=1;
                    new_arr.push(marketData[i]);
                }
            }
            if(count==favorites.length){
                setShownData(new_arr);
            }
        }

        setShownData(new_arr);
    }

    else if(filter=="all"){
        const new_arr = marketData.sort(sortFunction);
        setShownData(new_arr);
    }

    else if(filter=="allowed"){
        setShownData((shownData)=>{
            return shownData.filter(function(item){
                for(let i=0; i<allowedCryptos.length; i++){
                    if(item.name==allowedCryptos[i].coin){
                        return true;
                    }
                }
                return false;
            })
        })
    }

    setPageNumber(1);

  }

 
  function checkFilter(coin_name){
    if(filter=="all"){
        return true;
    }
    else if(filter=="favorites"){
        for(let i=0; i<favorites.length; i++){
            if(favorites[i].coin==coin_name){
                return true;
            }
        }
    }

    else if(filter=="allowed"){
        for(let i=0; i<allowedCryptos.length; i++){
            if(coin_name==allowedCryptos[i].coin){
                return true;
            }
        }
    }

    return false;
  }

  function showChart(i){

    if(session && session.user.role=="Investor"){
        const index= (pageNumber-1)*30 +i;
        const coin = shownData[index];
        const coin_string ="BINANCE:" + coin.symbol.toUpperCase() + "USDT";
        const watchlist_arr=[];
        let temp_coin_string;
        const sortedData = shownData.sort((a, b)=>{
            if(a.name>b.name){
                return -1;
            }
            else if(a.name<b.name){
                return 1;
            }
            else{return 0;}
        });
        
            for(let j=0; j<sortedData.length; j++){
                for(let i=0; i<favorites.length; i++){
                    if(sortedData[j].name==favorites[i].coin){
                        temp_coin_string='{ "name":' + '"BINANCE:' + sortedData[j].symbol.toUpperCase() + 'USDT"' + "," + '"displayName":' + '"' + sortedData[j].name + '"' + "}";
                        watchlist_arr.push(temp_coin_string);
                    }{
                }
            }
    }

        const url = '/ExperiencedTrading/chart?coin=' + coin_string + '&&watchlist=[' + watchlist_arr + ']' + '&&number=' + favorites.length;
        router.replace(url);
    }
  }
  async function changeLiked(index){
  
    const new_arr= Array.from(liked, x=>x);
    const username = session.user.email;
    const coin_name = shownData[index].name;
    const coin_symbol = shownData[index].symbol;
    try{
        const res = await fetch('../api/ExperiencedTrading/favorites', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, coin_name, coin_symbol})
        })

    }

    catch(error){
        console.error(error);
    }

    
    new_arr[index]=!new_arr[index];
    fetchFavorites();
    setLiked(new_arr);
  }
    function handleCoinChange(){
        
        const input = document.getElementById("input").value.toUpperCase();
        const new_arr=[];
        for(let i=0; i<marketData.length; i++){
            if(marketData[i].name.toUpperCase().includes(input) || marketData[i].symbol.toUpperCase().includes(input)){
                if(checkFilter(marketData[i].name)){
                    new_arr.push(marketData[i]);
                }
                
            }
        }

        const sorted_new_arr = new_arr.sort(sortFunction);
        setShownData(sorted_new_arr);
    }


    async function removeCrypto(index){
        const coin = shownData[((pageNumber -1) *30) + index];
        const coin_name = coin.name;

        try{
            const res = await fetch('../api/Admin/removeCrypto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({coin_name}),
            })
        }
        catch(error){
            console.error(error);
        }

        fetchData();
        handleButtonClick(0); setFilter("allowed"); handleNavClick("allowed");
    }

    function isAllowed(i){
        const coin = shownData[((pageNumber -1) * 30) + i];
        for(let i=0; i<allowedCryptos.length; i++){
            if(coin.name == allowedCryptos[i].coin){
                return true;
            }
        }

        return false;
    }

    async function addCrypto(index){
        const coin = shownData[((pageNumber -1) *30) + index];
        const coin_name = coin.name;
        const coin_id = coin.id;
        const coin_symbol = coin.symbol;
        try{
            const res = await fetch('../api/Admin/addCrypto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({coin_name, coin_id, coin_symbol}),
            })
        }
        catch(error){
            console.error(error);
        }

        fetchData();
        handleButtonClick(0); setFilter("allowed"); handleNavClick("allowed");
    }
    return (
        <div className={styles.container} onClick={()=>{if(changeToggled){document.getElementById("dropdown").style.display="none"; setChangeToggled(false)}}}>
            <div className={styles.pageTitle}>Markets Overview</div>
            <div className={styles.overView}>
                <div className={styles.dataOverview}>
                    <section className={styles.overViewtTitle}>Top Gainers</section>
                    {marketData.sort(dynamicSort("gainer")).slice(0,3).map((data, i)=>{
                        return (
                            <div key={i} className={styles.overViewTicker}>
                                <section className={styles.overViewcoinHeader}>
                                    <figure className={styles.logo}>
                                        <Image
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${data.id}.png`}
                                            width={15}
                                            height={15}
                                            alt="coin"
                                            className={styles.logo}
                                        />
                                    </figure>
                                    <section className={styles.overViewsymbol}>{data.symbol}</section>
                                </section>
                         
                                <section className={styles.overViewPrice}>
                                    ${HRNumbers(data.quote.USD.price, n=> Number.parseFloat(n).toFixed(2))}
                                </section>
                                {data.quote.USD.percent_change_24h>0 ? (
                                <div className={styles.overViewPlus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                ) :(
                                    <div className={styles.overViewMinus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                )}
                            </div>
                        )
                    })
                    }
                </div>
                <div className={styles.dataOverview}>
                    <section className={styles.overViewtTitle}>Top Losers</section>
                    {marketData.sort(dynamicSort("loser")).slice(0,3).map((data, i)=>{
                        return (
                            <div key={i} className={styles.overViewTicker}>
                                <section className={styles.overViewcoinHeader}>
                                    <figure className={styles.logo}>
                                        <Image
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${data.id}.png`}
                                            width={15}
                                            height={15}
                                            alt="coin"
                                            className={styles.logo}
                                        />
                                    </figure>
                                    <section className={styles.overViewsymbol}>{data.symbol}</section>
                                </section>
                         
                                <section className={styles.overViewPrice}>
                                    ${HRNumbers(data.quote.USD.price, n=> Number.parseFloat(n).toFixed(2))}
                                </section>

                                {data.quote.USD.percent_change_24h>0 ? (
                                <div className={styles.overViewPlus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                ) :(
                                    <div className={styles.overViewMinus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                )}
                            </div>
                        )
                    })
                    }
                </div>
                <div className={styles.dataOverview}>
                    <section className={styles.overViewtTitle}>Top Volume</section>
                    {marketData.sort(dynamicSort("volume")).slice(0,3).map((data, i)=>{
                        return (
                            <div key={i} className={styles.overViewTicker}>
                                <section className={styles.overViewcoinHeader}>
                                    <figure className={styles.logo}>
                                        <Image
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${data.id}.png`}
                                            width={15}
                                            height={15}
                                            alt="coin"
                                            className={styles.logo}
                                        />
                                    </figure>
                                    <section className={styles.overViewsymbol}>{data.symbol}</section>
                                </section>
                         
                                <section className={styles.overViewPrice}>
                                    ${HRNumbers(data.quote.USD.price, n=> Number.parseFloat(n).toFixed(2))}
                                </section>

                                <section className={styles.overViewVolume}>
                                        ${HRNumbers(data.quote.USD.volume_24h, n=> Number.parseFloat(n).toFixed(2))}
                                </section>

                            </div>
                        )
                    })
                    }
                </div>
                <div className={styles.dataOverview}>
                    <section className={styles.overViewtTitle}>New Listings</section>
                    {marketData.sort(dynamicSort("new")).slice(0,3).map((data, i)=>{
                        return (
                            <div key={i} className={styles.overViewTicker}>
                                <section className={styles.overViewcoinHeader}>
                                    <figure className={styles.logo}>
                                        <Image
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${data.id}.png`}
                                            width={15}
                                            height={15}
                                            alt="coin"
                                            className={styles.logo}
                                        />
                                    </figure>
                                    <section className={styles.overViewsymbol}>{data.symbol}</section>
                                </section>
                         
                                <section className={styles.overViewPrice}>
                                    ${HRNumbers(data.quote.USD.price, n=> Number.parseFloat(n).toFixed(2))}
                                </section>
                                {data.quote.USD.percent_change_24h>0 ? (
                                <div className={styles.overViewPlus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                ) :(
                                    <div className={styles.overViewMinus}>+{HRNumbers((data.quote.USD.percent_change_24h), n=> Number.parseFloat(n).toFixed(2))}</div>
                                )}
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <nav className={styles.searchBar}>
                    {session==null && (
                        <section className={styles.options}>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(0); setFilter("all"); handleNavClick("all");}} id="filter"><section>All Cryptos</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                            <button className={styles.button} onClick={()=>{handleButtonClick(1)}} id="filter"><section>Meme</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(2)}} id="filter"><section>AI</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                          </section>
                    )}
                    {session?.user.role=="Investor" && (
                        <section className={styles.options}>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(0); setFilter("favorites"); handleNavClick("favorites");}} id="filter"><section>Favorites</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(1); setFilter("all"); handleNavClick("all");}} id="filter"><section>All Cryptos</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                            <button className={styles.button} onClick={()=>{handleButtonClick(2)}} id="filter"><section>Meme</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(3)}} id="filter"><section>AI</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                        </section>
                    )}

                    {session?.user.role=="Staff" && (
                        <section className={styles.options}>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(0); setFilter("allowed"); handleNavClick("allowed");}} id="filter"><section>All Cryptos</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                            <div className={styles.filterClick}>
                                <button className={styles.button} onClick={()=>{handleButtonClick(1); setFilter("all"); handleNavClick("all");}} id="filter"><section>Add Crypto</section></button>
                                <div className={styles.underline} id="underline"></div>
                            </div>
                           
                        </section>
                    )}
                
                
                <form className={styles.form}>
                    <section className={styles.searchHover} onFocus={()=>{document.getElementById("hover").style.border="1pt solid #5AA056" }} onBlur={()=>{document.getElementById("hover").style.border="2pt solid lightgray"}} id="hover">
                        <svg onMouseOver={() =>{document.querySelector('#input').style.display = 'block';}} className={styles.search2} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" ><path fillRule="evenodd" clipRule="evenodd" d="M11 6a5 5 0 110 10 5 5 0 010-10zm0-3a8 8 0 017.021 11.838l3.07 3.07-1.59 1.591-1.591 1.591-3.07-3.07A8 8 0 1111 3z" fill="#d3d3d3"></path></svg>
                        <input type="text"  autoComplete="off" className={styles.input} id="input" placeholder="Search Coin" onChange={()=>{handleCoinChange()}}/>
                    </section>
                    <figure className={styles.searchIcon} id="icon">
                        <svg  className={styles.search} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M11 6a5 5 0 110 10 5 5 0 010-10zm0-3a8 8 0 017.021 11.838l3.07 3.07-1.59 1.591-1.591 1.591-3.07-3.07A8 8 0 1111 3z" fill="currentColor"></path></svg>
                    </figure>
                </form>
            </nav>
           <section className={styles.filter}>
                <section className={styles.nameFilter}>
                    <section>Name</section>
                    <section>
                        <section className={styles.toggle}>
                           {toggles[0][0] ? (
                            <Image 
                            src={toggledAsc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(0,1); setFilterAsc(["name", false])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledAsc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(0,0); setFilterAsc(["name", true])}}
                                />
                           )
                           }

                        {toggles[0][1] ? (
                            <Image 
                            src={toggledDesc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(0,0); setFilterAsc(["name", true]) }}
                            />
                           ) :(
                            <Image 
                                src={untoggledDesc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(0,1); setFilterAsc(["name", false])}}
                                />
                           )
                           }
                        </section>
                    </section>
                </section>
                <section className={styles.filters}>
                    <section className={styles.priceFilter}>
                        <section>Price</section>
                        <section className={styles.toggle}>
                        {toggles[1][0] ? (
                            <Image 
                            src={toggledAsc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(1,1); setFilterAsc(["price", false])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledAsc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(1,0); setFilterAsc(["price", true])}}
                                />
                           )
                           }

                        {toggles[1][1] ? (
                            <Image 
                            src={toggledDesc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(1,0); setFilterAsc(["price", true])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledDesc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(1,1); setFilterAsc(["price", false])}}
                                />
                           )
                           }
                        </section>
                    </section>
                    <section className={styles.changeFilter}>
                        <div>
                            <button className={styles.changeDropdown} onClick={()=>{document.getElementById("dropdown").style.display="flex"; setChangeToggled(true)}}>
                                <section>{changeTime}</section>
                                {changeToggled ? (
                                    <Image src={
                                        untoggledAsc
                                    }
                                    width={9}
                                    height={7}
                                    alt="toggle"

                                    />
                                ): (
                                    <Image src={untoggledDesc}
                                    width={9}
                                    height={7}
                                    alt="toggle"
                                    />
                                )}
                            </button>
                            <div className={styles.dropDownMenu} id="dropdown">
                                <section className={styles.changeOption} onClick={()=>{setChangeTime("24h")}}>24h</section>
                                <section className={styles.changeOption} onClick={()=>{setChangeTime("4h")}}>4h</section>
                                <section className={styles.changeOption} onClick={()=>{setChangeTime("1h")}}>1h</section>
                            </div>
                        </div>
                    <section>Change</section>
                        <section className={styles.toggle}>
                        {toggles[2][0] ? (
                            <Image 
                            src={toggledAsc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(2,1); setFilterAsc(["change", false])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledAsc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(2,0); setFilterAsc(["change", true])}}
                                />
                           )
                           }

                        {toggles[2][1] ? (
                            <Image 
                            src={toggledDesc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(2,0); setFilterAsc(["change", true])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledDesc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(2,1); setFilterAsc(["change", false])}}
                                />
                           )
                           }
                        </section>
                    </section>
                    <section className={styles.volFilter}>
                        <section>24H Volume</section>
                        <section className={styles.toggle}>
                        {toggles[3][0] ? (
                            <Image 
                            src={toggledAsc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(3,1); setFilterAsc(["volume", false])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledAsc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(3,0); setFilterAsc(["volume", true])}}
                                />
                           )
                           }

                        {toggles[3][1] ? (
                            <Image 
                            src={toggledDesc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(3,0); setFilterAsc(["volume", true])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledDesc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(3,1); setFilterAsc(["volume", false])}}
                                />
                           )
                           }
                        </section>
                    </section>
                    <section className={styles.capFilter}> 
                        <section>MarketCap</section>
                        <section className={styles.toggle}>
                        {toggles[4][0] ? (
                            <Image 
                            src={toggledAsc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(4,1); setFilterAsc(["marketCap", false])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledAsc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(4,0); setFilterAsc(["marketCap", true]) }}
                                />
                           )
                           }

                        {toggles[4][1] ? (
                            <Image 
                            src={toggledDesc} 
                            width={9}
                            height={7}
                            alt="toggle"
                            onClick={()=>{toggle(4,0); setFilterAsc(["marketCap", true])}}
                            />
                           ) :(
                            <Image 
                                src={untoggledDesc} 
                                width={9}
                                height={7}
                                alt="toggle"
                                onClick={()=>{toggle(4,1); setFilterAsc(["marketCap", false])}}
                                />
                           )
                           }
                        </section>
                       
                    </section>
                    <section>Actions</section>
                </section>
           </section>
            <div className={styles.coins}>
            {shownData && (
                shownData.slice(30*(pageNumber-1),30*pageNumber).map((data, i)=>{
                    return (
                        <div key ={i} className={styles.ticker} >
                           <section className={styles.coinHeader} onClick={()=>{showChart(i)}}>
                                <figure className={styles.logo}>
                                    <Image
                                        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${data.id}.png`}
                                        width={30}
                                        height={30}
                                        alt="coin"
                                        className={styles.logo}
                                    />
                                </figure>
                                <section className={styles.coinName}>
                                    <section className={styles.symbol}>{data.symbol}</section>
                                    <section className={styles.name}>{data.name}</section>
                                </section>
                           </section>
                               
                           <section className={styles.priceData}>
                                    <section className={styles.price}>
                                    ${HRNumbers(data.quote.USD.price, n=> Number.parseFloat(n).toFixed(2))}
                                    </section>
                                    <section className={styles.change}>
                                        {(data.quote.USD.percent_change_24h).toFixed(2)>0 ? (
                                          <div className={styles.plus}>+{(data.quote.USD.percent_change_24h).toFixed(2)}</div>
                                        ):(
                                            <div className={styles.minus}>{(data.quote.USD.percent_change_24h).toFixed(2)}</div>
                                        )}
                                    </section>
                                    <section className={styles.volume}>
                                        ${HRNumbers(data.quote.USD.volume_24h, n=> Number.parseFloat(n).toFixed(2))}
                                    </section>
                                    <section className={styles.marketCap}>
                                        ${HRNumbers(data.quote.USD.market_cap, n=> Number.parseFloat(n).toFixed(2))}
                                    </section>

                                    {session?.user.role=="Investor" && (
                                        <section className={styles.liked}>
                                            {liked[(pageNumber-1)*30 +i] ? (
                                                <Image 
                                                    src={likedImage}
                                                    width={30}
                                                    height={30}
                                                    alt="liked"
                                                    onClick={()=>{changeLiked((pageNumber-1)*30 + i);}}
                                                />
                                            ):(
                                                <Image 
                                                src={unliked}
                                                width={30}
                                                height={30}
                                                alt="unliked"
                                                onClick={()=>{changeLiked((pageNumber-1)*30 +i);}}
                                            />
                                            )}
                                        </section>
                                    )}

                                    {session?.user.role=="Staff" && (
                                            <>
                                            {isAllowed(i) ? (
                                                <div className={styles.removeCrypto}>
                                                        <button className={styles.remove} onClick={()=>{removeCrypto(i)}}>Remove</button>
                                                </div>
                                            ):(
                                            <div className={styles.removeCrypto}>
                                                <button className={styles.Add} onClick={()=>{addCrypto(i)}}>Add</button>
                                            </div>
                                            )
                                            }
                                            </>   
                                         )}
                                
                           </section>
                        </div> 
                    )
                })
            )}
            </div>
            <section className={styles.nextPage}>
                {pageNumber!=1 ? (
                <Image 
                    src={nextLeft}
                    width={10}
                    height={10}
                    alt="left"
                    className={styles.arrow}
                    onClick={()=>{setPageNumber((pageNumber)=>{return pageNumber-1;});}}
                />
                ): (
                    <Image 
                    src={noNextLeft}
                    width={10}
                    height={10}
                    alt="left"
                />
                )
                }
                <div className={styles.pageNumber} onClick={()=>{setPageNumber(1)}}>1</div>
                {pageNumber-2>=1 && (
                    
                    <div className={styles.pageNumbers}>
                    {pageNumber>4 && (
                        <div className={styles.dots}>...</div>
                    )}
                    {Array.from({ length: Math.min(2, pageNumber-2) }).map((_, index) => (
                        <div key={index} className={styles.pageNumber} onClick={()=>{setPageNumber(Math.max(pageNumber-2, 2)+index)}}>{Math.max(pageNumber-2, 2)+index}</div>
                      ))}
                      </div>
                )
                }
                {pageNumber!=1 && (<div>{pageNumber}</div>)}
                {pageNumber+2<=Math.floor(shownData.length/30) && (
                    <div className={styles.pageNumbers}>
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className={styles.pageNumber} onClick={()=>{setPageNumber(pageNumber+index+1)}}>{pageNumber+index+1}</div>
                      ))}
                      {pageNumber<(Math.floor(shownData.length/30))-2 && (
                        <div className={styles.dots}>...</div>
                        )}
                      </div>
                )
                }

                {shownData.length>30 && (<div className={styles.pageNumber} onClick={()=>{Math.ceil(shownData.length/30)}}>{Math.ceil(shownData.length/30)}</div>)}
                {pageNumber!=Math.ceil(shownData.length/30) && shownData.length>30 ? (
                    <Image 
                        src={nextRight}
                        width={10}
                        height={10}
                        alt="right"
                        className={styles.arrow}
                        onClick={()=>{setPageNumber((pageNumber)=>{return pageNumber+1;});}}
                    />
                ):
                (
                    <Image 
                        src={noNextRight}
                        width={10}
                        height={10}
                        alt="right"
                    />
                )
                }  
            </section>
        </div>
    )
}