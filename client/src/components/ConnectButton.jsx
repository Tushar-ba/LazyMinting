import { useContext } from 'react';
import { Web3Context } from '../utils/Web3Context';

const ConnectButton = () => {
  const { address, connected, connectToMetamask,disConnect } = useContext(Web3Context);

  const handleConnect = async () => {
    if(!connected){
        await connectToMetamask();
    }else{
        await disConnect();
    }
    
  };
  

  return (
    <div>
      <button onClick={handleConnect}>
        {connected ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectButton;
