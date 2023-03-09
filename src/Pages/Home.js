import "../css/home.css"
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState} from 'react';
import { Link } from "react-router-dom"

//alchemy
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
//alchemy

const maxEntries = 10;

const latestEntriesType = {
    blocks: 0,
    transactions: 1
}

function substring(text, start, end) {
    if (text == "undefined" ||text == undefined) return
    
    return text.substring(start, end)
}

function SearchText(input){

    function handleClick() {
        localStorage.setItem("searchInput", input)
    }

    let displayText = input

    if (input.length > 20) {
        displayText = `${substring(input, 0, 6)}...${substring(input, input.length - 6, input.length)}`
    } 

    return (<Link to="/SearchInfo"
                  className = "searchText"
                  onClick={handleClick}
                  >{displayText}
            </Link>)
}

function latestEntries (leftData, centerTopData, centerBottomData, type) {
    //easier to read
    leftData = String(leftData);
    centerTopData = String(centerTopData);
    centerBottomData = String(centerBottomData)

    return (
        <div className="homeLatestInfoTemplate">
            {type == latestEntriesType.blocks && <h3 style={{width: "30%"}}>{SearchText(leftData)}</h3>}
            {type == latestEntriesType.transactions && <h3 style={{width: "30%"}}>{SearchText(leftData)}</h3>}
        
            <div className="homeLatestInfoCenter" style={{width: "30%"}}>

                <div className="homeLatestInfoCenterRow">
                    {type == latestEntriesType.blocks && <h3>Miner: {SearchText(centerTopData)}</h3>}
                    {type == latestEntriesType.transactions && <h3>From: {SearchText(centerTopData)}</h3>}
                </div>

                <div className="homeLatestInfoCenterRow">
                    {type == latestEntriesType.blocks && <h3>Txs:      {centerBottomData}</h3>}
                    {type == latestEntriesType.transactions && <h3>To:      {SearchText(centerBottomData)}</h3>}

                </div>
            </div>

            <div style={{width: "30%"}}>{/*styling*/}
                <Link to="/SearchInfo" className="searchButton" 
                        onClick={() => localStorage.setItem("searchInput", leftData)}
                        >More Info
                </Link> 
            </div>  
        </div>)
}

export const Home = () => {
    const [blockNumbers, setBlockNumbers] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [searchInput, setSearchInput] = useState();
    
    useEffect(() => {
        async function fetchData() {
            const blockNumber = await alchemy.core.getBlockNumber();

            for (let i = 0; i < maxEntries; i++) {
                const newBlockNumber = blockNumber - i;
                setBlockNumbers(prevBlockNumbers => [...prevBlockNumbers, newBlockNumber]);
    
                const block = await alchemy.core.getBlock(newBlockNumber);
                setBlocks(prevBlocks => [...prevBlocks, block]);
    
                const transaction = await alchemy.core.getTransaction(
                    block.transactions[i]
                );

                setTransactions(prevTransactions => [...prevTransactions, transaction]);
            }
        }

        fetchData();
        
    }, []);

    return (
    <div className="main">  

        <div className="homeSearchArea">
            <input style={{ height: "2.5vh"}} onChange={(e) => setSearchInput(e.target.value)}></input>
            
            <Link to="/SearchInfo" className="searchButton" onClick={() => localStorage.setItem("searchInput", searchInput)}>search</Link>
        </div>


        <div className="homeLatestInfoAll">
            
            <div className="homeLatestArea">
                <h2 className="homeLatestInfoTitle">Latest Blocks</h2>

                <div className="homeLatestInfo"> {/*styling*/} 
                    {/*if blocks is true loop of the blocks array and apply latestEntries function to the blocks array and then display */}
                    {blocks && blocks.map((block, index) => (latestEntries(blockNumbers[index], block.miner, block.transactions.length, latestEntriesType.blocks)))}
                </div>
            </div>

            <div className="homeLatestArea">
                
                <h2 className="homeLatestInfoTitle">Latest Transactions</h2>

                <div className="homeLatestInfo"> {/*styling*/} 
                    {transactions && transactions.map(transaction => latestEntries(transaction.hash, transaction.from, transaction.to, latestEntriesType.transactions))}
                </div>
            </div>
        </div>
    </div>
    )
}