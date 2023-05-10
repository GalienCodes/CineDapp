import Web3 from 'web3'
import { useState, useEffect, useCallback } from "react";
import { getGlobalState } from '../store';

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

export const useContract = (abi, contractAddress) => {
  const connectedAccount = getGlobalState('connectedAccount')
  const [contract, setContract] = useState(null);
  const web3 = window.web3

  const getContract = useCallback(async () => {
    setContract( new web3.eth.Contract(abi, contractAddress));
  }, [connectedAccount, abi, contractAddress]);

  useEffect(() => {
    if (connectedAccount) getContract();
  }, [connectedAccount, getContract]);

  return contract;
};