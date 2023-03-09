import "../css/searchInfo.css"
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { formatEther, formatUnits } from 'ethers'
import { Link } from "react-router-dom";

//alchemy
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
//alchemy

const PageType = {
    Transaction: 0,
    Block: 1,
    Account: 2,
    Error : 3
}

const accountPageTransactions = 25;

function displayTransaction(hash, status, block, timestamp, from, to, value, fee, gasPrice) {
    return (
        <div className="transactionMain">
            <h1>Transaction</h1>

            <div className="transaction">
                <div className="titles">
                    <h3>Transaction Hash:</h3>
                    <h3>Status:</h3>
                    <h3>Block:</h3>
                    <h3>Timestamp:</h3>

                    <h3>From:</h3>
                    <h3>To:</h3>

                    <h3>Value:</h3>
                    <h3>Transaction Fee:</h3>
                    <h3>Gas Price:</h3>
                </div>

                <div className="data">
                    <h3 className="searchText">{SearchText(hash, hash)}</h3>
                    <h3>{status}</h3>
                    <h3 className="searchText">{SearchText(block, block)}</h3>
                    <h3>{timestamp}</h3>

                    <h3 className="searchText">{SearchText(from, from)}</h3>
                    <h3 className="searchText">{SearchText(to, to)}</h3>

                    <h3>{value} ETH</h3>
                    <h3>{fee}</h3>
                    <h3>{gasPrice}</h3>
                </div>
            </div>
        </div>
    )
}

function displayBlock(blockHeight, status, timestamp, transactions, feeRecipient, totalDifficulty, gasUsed, gasLimit, baseFeePerGas, extraData) {
    return (
        <div className="blockMain">
            <h1>Block</h1>

            <div className="block">
                <div className="titles">
                    <h3>Block Height:</h3>
                    <h3>Status:</h3>
                    <h3>Timestamp</h3>
                    <h3>Transactions:</h3>

                    <h3>Fee Recipient:</h3>
                    <h3>Total Difficulty:</h3>


                    <h3>Gas Used:</h3>
                    <h3>Gas Limit:</h3>
                    <h3>Base Fee Per Gas:</h3>
                    <h3>Extra Data:</h3>
                </div>

                <div className="data">
                    <h3 className="searchText">{SearchText(blockHeight, blockHeight) }</h3>
                    <h3>{status}</h3>
                    <h3>{timestamp}</h3>
                    <h3>{transactions}</h3>
        
                    <h3 className="searchText">{SearchText(feeRecipient, feeRecipient)}</h3>
                    <h3>{totalDifficulty}</h3>

                    <h3>{gasUsed}</h3>
                    <h3>{gasLimit}</h3>
                    <h3>{baseFeePerGas}</h3>
                    <h3>{extraData}</h3>
                </div>
            </div>
        </div>
    )
}

function displayAccount(accountAddress, accountEthBalance, accountFirstTx, accountLastTx, accountTxs) {
    
    
    return (
        <div className="account">
            <h3>Account Address: {accountAddress}</h3>

            {/*************************************/}
            <div className="topInfo">

                <div className="topInfoBox">

                    <h3 className="title">Overview</h3>
                    <div className="topInfoBoxInner">

                        <div className="titles"> 
                            <p>Account Eth Balance:</p>
                        </div>

                        <div className="data">
                            <p>{accountEthBalance} ETH</p>
                        </div>

                    </div>
                    
                </div>

                <div className="topInfoBox">

                    <h3 className="title">More Info</h3>
                    <div className="topInfoBoxInner">

                        <div className="titles"> 
                            <p>Account First Tx:</p>
                            <p>Account Last Tx:</p>
                        </div>

                        <div className="data">
                            <p>{accountFirstTx == "Loading..."? accountFirstTx: SearchText(accountFirstTx,`${accountFirstTx.substring(0, 8)}...${accountFirstTx.substring(accountFirstTx.length - 8, accountFirstTx.length)}`)}</p>
                            <p>{accountLastTx == "Loading..."? accountLastTx: SearchText(accountLastTx,`${accountLastTx.substring(0, 8)}...${accountLastTx.substring(accountLastTx.length - 8, accountLastTx.length)}`)}</p>
                        </div>

                    </div>
                    
                </div>

                <div className="topInfoBox">

                    <h3 className="title">Other Balances</h3>
                    <div className="topInfoBoxInner">

                        <div className="titles"> 
                            <p>Tokens:</p>
                            <p>NFTs:</p>
                        </div>

                        <div className="data">
                            {/*p tag for styling*/}
                            <p><Link to="/TokenHoldings" className="getBalanceButton" >Get Token balances</Link></p>
                            
                            <p><Link to="/NFTHoldings" className="getBalanceButton">Get NFTs</Link> </p>
                        </div>

                    </div>
                    
                </div>
            </div>
            {/*************************************/}
            <div className="bottomInfo">
                <div className="info">
                    <p>Latest 25 from a total of ... transactions</p>
                </div>
                
                <div className="transactions"> 

                        <div className="transactionInfo">{displayTransactionInfo("Transaction Hash", accountTxs.transfers, 'hash', accountPageTransactions)}</div>
                        <div className="transactionInfo">{displayTransactionInfo("Block", accountTxs.transfers, 'blockNum', accountPageTransactions)}</div>
                        <div className="transactionInfo">{displayTransactionInfo("From", accountTxs.transfers, 'from', accountPageTransactions)}</div>
                        <div className="transactionInfo">{displayTransactionInfo("To", accountTxs.transfers, 'to', accountPageTransactions)}</div>
                        <div className="transactionInfo">{displayTransactionInfo("Value", accountTxs.transfers, 'value', accountPageTransactions)}</div>

                </div>
            </div>
            {/*************************************/}
        </div>
    )
}

function displayTransactionInfo(title, transactionArray, elementName, displayAmount) {
    if (transactionArray === undefined) return;

    //place the title as the start of the array
    const transactionsData = [title]

    for(let i = 0; i < displayAmount; i++) {
        let result = String(transactionArray[transactionArray.length - 1 - i][elementName])

        if (result.length == 66) {
            result = SearchText(result, `${result.substring(0, 19)}...`)

        } else if (result.length == 42) {
            result = SearchText(result, `${result.substring(0, 8)}...${result.substring(result.length - 9, result.length - 1)}`) 
        
        } else if (elementName == 'value') {
            result = String(Number(result).toFixed(7)) + " ETH"
            
        } else if (elementName == 'blockNum') {
            result = SearchText(result, parseInt(result)) 
        }
        transactionsData.push(result)
    }

    const data = transactionsData.map((info) =>
    //if info equal the value of title display info as a h3
        info !== title ? <p className="transactionInfoItem">{info}</p> : <h3 className="transactionInfoItem">{info}</h3>
    )

    return data
}

function SearchText(input, displayText){

    async function handleClick() {
        console.log(input)
        await localStorage.setItem("searchInput", input)
        await window.location.reload();
    } 
    return (<Link className="linkText"
                  onClick={() => 
                 {handleClick()}}
                 >{displayText}
            </Link>)
}

function displayError(errorMessage) {
    return (
        <div className="error">
            <h2>{errorMessage}</h2>
        </div>
    )
}

export const SearchInfo = () => {
    const defaultText = "Loading..."

    const [pageToDisplay, setPageToDisplay] = useState()

    //transaction data only
    const [transactionHash, setTransactionHash] = useState(defaultText)
    const [transactionStatus, setTransactionStatus] = useState(defaultText)
    const [transactionTimestamp, setTransactionTimestamp] = useState(defaultText)

    const [transactionFrom, setTransactionFrom] = useState(defaultText)
    const [transactionTo, setTransactionTo] = useState(defaultText)

    const [transactionValue, setTransactionValue] = useState(defaultText)
    const [transactionFee, setTransactionFee] = useState(defaultText)
    const [transactionGasPrice, setTransactionGasPrice] = useState(defaultText)

    //block data only
    const [blockStatus, setBlockStatus] = useState(defaultText)
    const [blockTimestamp, setBlockTimestamp] = useState(defaultText)
    const [blockTransactionLength, setBlockTransactionLength] = useState(defaultText)

    const [blockFeeRecipient, setBlockFeeRecipient] = useState(defaultText)
    const [blockTotalDifficulty, setBlockTotalDifficulty] = useState(defaultText)
   
    const [blockGasUsed, setBlockGasUsed] = useState(defaultText)
    const [blockGasLimit, setBlockGasLimit] = useState(defaultText)
    const [blockBaseFeePerGas, setBlockBaseFeePerGas] = useState(defaultText)
    const [blockExtraData, setBlockExtraData] = useState(defaultText)

    //transaction and block data
    const [block, setBlock] = useState(defaultText)

    //account data
    const [accountEthBalance, setAccountEthBalance] = useState(defaultText)
    const [accountFirstTx, setAccountFirstTx] = useState(defaultText)
    const [accountLastTx, setAccountLastTx] = useState(defaultText)
    const [accountTxs, setAccountTxs] = useState(defaultText)
    const [accountTokenHoldings, setAccountTokenHoldings] = useState(defaultText)

    useEffect(() => {
        const searchInput = localStorage.getItem("searchInput")
        
        async function determinePage() {

            //transaction
            if (searchInput.length == 66) {
                
                //confirm if transaction, if so set data
                const transaction = await alchemy.core.getTransaction(searchInput)

                if (transaction) {
                    setPageToDisplay(PageType.Transaction)
                    
                    getDataForTransaction()
                    return
                }

            //account
            //will only work if account has made a transaction before
            } else if (searchInput.length == 42) {
                const addressTransactionCount = await alchemy.core.getTransactionCount(searchInput)

                //confirm if address, if so set dataf
                if (addressTransactionCount > 0) {
                    setPageToDisplay(PageType.Account)

                    getDataForAccount()
                    return
                }

            //block
            } else if (searchInput.length == 8) {
                const block = await alchemy.core.getBlock(parseInt(searchInput))
                const blockMiner = await block.miner;

                if (blockMiner !== undefined || blockMiner !== '') {
                    setPageToDisplay(PageType.Block)
                    
                    getDataForBlock()
                    return
                }
            }

            if (pageToDisplay === undefined || pageToDisplay === '') {
                setPageToDisplay(PageType.Error)
                return
            }
        }

        async function getDataForTransaction() {    
            const transactionReceipt = await alchemy.core.getTransactionReceipt(searchInput)
        
            setTransactionHash(transactionReceipt.transactionHash)
            setTransactionStatus(transactionReceipt.status)
            setBlock(transactionReceipt.blockNumber)

            setTransactionFrom(transactionReceipt.from)
            setTransactionTo(transactionReceipt.to)
            setTransactionFee(String(transactionReceipt.gasUsed))

            const transactionData = await alchemy.core.getTransaction(searchInput)
            
            setTransactionValue(await formatEther(String(transactionData.value)))
            setTransactionGasPrice(await formatUnits(String(transactionData.gasPrice)), "gwei")
            
            const block = await alchemy.core.getBlock(transactionReceipt.blockNumber)
            
            setTransactionTimestamp(block.timestamp)
        }

        async function getDataForAccount() {
            const amount = await (String(await alchemy.core.getBalance(searchInput)))
            setAccountEthBalance(await formatEther(amount))
            
            const accountTransfers = await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                fromAddress: searchInput,
                excludeZeroValue: true,
                category: ["external", "erc20"]
            })

            await setAccountFirstTx(accountTransfers.transfers[0].hash)
            await setAccountLastTx(accountTransfers.transfers[accountTransfers.transfers.length - 1].hash)
            await setAccountTxs(accountTransfers)
        }

        async function getDataForBlock() {
            const block = await alchemy.core.getBlock(parseInt(searchInput))

            setBlock(searchInput)
            setBlockTimestamp(block.timestamp)
            setBlockTransactionLength(block.transactions.length)
            
            setBlockFeeRecipient(block.miner)

            setBlockTotalDifficulty(block.difficulty)
            setBlockGasUsed(String(block.gasUsed))
            setBlockGasLimit(String(block.gasLimit))

            setBlockBaseFeePerGas(String(block.baseFeePerGas))
            setBlockExtraData(block.extraData)

            const transactionReceipt = await alchemy.core.getTransactionReceipt(block.transactions[0])
            setBlockStatus(transactionReceipt.status)
        }

        determinePage()
    }, [])

    return (
        <div className="main">
            {pageToDisplay == PageType.Transaction && displayTransaction(transactionHash, 
                                                                         transactionStatus, 
                                                                         block, 
                                                                         transactionTimestamp, 
                                                                         transactionFrom, 
                                                                         transactionTo, 
                                                                         transactionValue, 
                                                                         transactionFee, 
                                                                         transactionGasPrice
                                                                         )}
            {pageToDisplay == PageType.Account && displayAccount(localStorage.getItem("searchInput"),
                                                                 accountEthBalance,
                                                                 accountFirstTx,
                                                                 accountLastTx,
                                                                 accountTxs
                                                                 )}
                                                                  
            {pageToDisplay == PageType.Block && displayBlock(block,
                                                             blockStatus,
                                                             blockTimestamp,
                                                             blockTransactionLength,
                                                             blockFeeRecipient,
                                                             blockTotalDifficulty,
                                                             blockGasUsed,
                                                             blockGasLimit,
                                                             blockBaseFeePerGas,
                                                             blockExtraData
                                                             )}

            {pageToDisplay == PageType.Error && displayError("Invalid Input")}
        </div>
    )
}