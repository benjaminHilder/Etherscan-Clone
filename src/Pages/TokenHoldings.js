import "../css/tokenHoldings.css"
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

//alchemy
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
//alchemy

function displayBalanceInfo(title, balanceArray, displayAmount) {
    if (balanceArray === undefined) return;

    const balanceData = [title]
    

    for(let i = 0; i < displayAmount; i++) {
        if (title === "Balance" ) {
            balanceData.push(String(parseInt(balanceArray[balanceArray.length - 1 - i]).toFixed(8)))
        } else {
            balanceData.push(String(balanceArray[balanceArray.length - 1 - i]))
        }
    } 

    const data = balanceData.map((info) =>
        info !== title ? <p>{info}</p> : <h3>{info}</h3>
    )

    return data;
}

export const TokenHoldings = () => {
    const [tokenContractAddresses, setTokenContractAddresses] = useState()
    const [tokenNames, setTokenNames] = useState()
    const [tokenBalances, setTokenBalances] = useState()
    const [tokenSymbol, setTokenSymbol] = useState()

    useEffect(async() => {

        const searchInput = localStorage.getItem("searchInput")

        const tokenData = await alchemy.core.getTokenBalances(searchInput)
        const tokenBalances = tokenData.tokenBalances

        const newTokenContractAddresses = []
        const newTokenBalances = []
        const newTokenNames = []
        const newTokenSymbol = []

        for (let i = 0; i < tokenBalances.length; i++) {
            newTokenContractAddresses.push(tokenBalances[i].contractAddress)
            newTokenBalances.push(tokenBalances[i].tokenBalance)

            //const tokenMetadata = await alchemy.core.getTokenMetadata(tokenBalances[i].contractAddress)
            //newTokenNames.push(tokenMetadata)
            //newTokenNames.push()
            //console.log(tokenMetadata)
            //newTokenNames.push(tokenMetadata.name)
            //newTokenSymbol.push(tokenMetadata.symbol)
        }

        setTokenContractAddresses(newTokenContractAddresses)
        setTokenBalances(newTokenBalances)
        setTokenNames(newTokenNames)
        setTokenSymbol(newTokenSymbol)
    })

    return (
        <div className="main">
            <h3>Token Balances for {localStorage.getItem("searchInput")}</h3>
            
            <div className="balances">
                <div className="balanceInfo">{tokenContractAddresses && displayBalanceInfo("Address", tokenContractAddresses, tokenContractAddresses.length)}</div>
                <div className="balanceInfo">{tokenBalances && displayBalanceInfo("Balance", tokenBalances, tokenBalances.length)}</div>
            </div>
        </div>
        
    )
}