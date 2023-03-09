import "../css/nftHoldings.css"
import etherscanLogo from "../images/etherscanLogo.png"
import openseaLogo from "../images/openseaLogo.png"
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';



//alchemy
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
//alchemy

function handleImageError(event) {
    event.target.style.display = 'none';
}

export const NFTHoldings = () => {
    const [nftInfo, setNftInfo] = useState()
    const [nftImageURL, setNftImageURL] = useState()

    const [hasReturnedNfts, setHasReturnedNfts] = useState(false)

    const [hoveredIndex, setHoveredIndex] = useState(null)

    function loadingDiv() {
        return (
            <div className="loading">
                <h3>Loading...</h3>
            </div>
        )
    }
    function nftDisplayDiv() {
        return (
            <div className="nftDisplay">
                {nftImageURL && nftImageURL.map((imageURL, index) => (
                    <div 
                        className="imageContainer"
                        onMouseEnter={() => {setHoveredIndex(index)}}
                        onMouseLeave={() => {setHoveredIndex(false)}}
                    >

                    <img src={imageURL} onError={handleImageError} />

                    {hoveredIndex === index && (
                        <div className="nftButtons"> 

                            <button >
                                <a href={`https://opensea.io/assets/ethereum/${nftInfo[index].contractAddress}/${nftInfo[index].tokenId}`}>
                                    opensea
                                </a>
                            </button>

                            <button >
                                <a href={`https://etherscan.io/address/${nftInfo[index].contractAddress}/${nftInfo[index].tokenId}`}>
                                    etherscan
                                </a>
                            </button>

                        </div>   
                    )}
                </div>
                ))}
            </div>
        )
    }

    useEffect(async() => {
        if (hasReturnedNfts == true) return

        const searchInput = await localStorage.getItem("searchInput")

        const result = await alchemy.nft.getNftsForOwner(searchInput)
        const nfts = await result.ownedNfts

        const newNftInfo = []
        const newNftImageURL = []

        for (let i = 0; i < nfts.length; i++) {

            await newNftInfo.push({
                contractAddress: nfts[i].contract.address,
                tokenId: nfts[i].tokenId,
                tokenType: nfts[i].tokenType
            })
        }

        await setNftInfo(newNftInfo)
        
        const nftMetadatas = await alchemy.nft.getNftMetadataBatch(newNftInfo)

        for (let i = 0; i < nftMetadatas.length; i++) {
            
            if (nftMetadatas[i].media[0] != undefined ) {
                await newNftImageURL.push(nftMetadatas[i].media[0].gateway)
            }
        }

        await setNftImageURL(newNftImageURL)
        await setHasReturnedNfts(true)
    })

    return (
        <div className="main">
            <h2>Nft holdings for account {localStorage.getItem("searchInput")}</h2>

            {nftImageURL ? nftDisplayDiv() : loadingDiv()}
        </div>
        
    )
}