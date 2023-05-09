import Web3 from 'web3'
import { toast } from 'react-hot-toast'
import {getGlobalState, setAlert, setGlobalState, setLoadingMsg} from "../store/index"

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const connectWallet = async () => {
  try {
    if (!ethereum) { console.log('Please install Metamask')}
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    window.location.reload()
  } catch (error) {
    console.log(error.message)
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return console.log('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })
    
    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWallectConnected()
    })
    
    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      toast.error('Please install Metamask')
     
      setGlobalState('connectedAccount','')

    }
  } catch (error) {
    reportError(error)
  }
}




export {
  connectWallet,
  isWallectConnected
}