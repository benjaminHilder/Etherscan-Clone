import { Alchemy, Network } from 'alchemy-sdk';

export const alchemySetup = () => {
    const settings = {
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };
      
    return new Alchemy(settings);
}