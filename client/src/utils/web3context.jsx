import { createContext, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';

// Create the context
export const Web3Context = createContext();

// Create the provider component
export const Web3Provider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectToMetamask = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const web3Signer = await web3Provider.getSigner();
    const web3Address = await web3Signer.getAddress();
    
    setProvider(web3Provider);
    setSigner(web3Signer);
    setAddress(web3Address);
    setConnected(true);
    
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);
    setContract(contractInstance);
  };
  const disConnect = () =>{
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setConnected(false);
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        address,
        connected,
        contract,
        connectToMetamask,
        disConnect,
        signer
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
