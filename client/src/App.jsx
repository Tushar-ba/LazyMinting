import './App.css'
import { Web3Provider } from './utils/web3context'
import ConnectButton from './components/ConnectButton'
import SignVoucherComponent from './components/signVoucherComponent'
import NFTMarketplace from './components/NFTMarketPlace'

function App() {
  return (
   <Web3Provider>
    <ConnectButton/>
    <SignVoucherComponent/>
    <NFTMarketplace/>
   </Web3Provider>
  )
}

export default App
