import { useContract } from "./useContract";
import TicketNFT from "../contracts/TicketNFT.json";
import TicketNFTAddress from "../contracts/TicketNFTAddress.json";

// export interface for smart contract
export const useTicketNFTContract = () =>
  useContract(TicketNFT.abi, TicketNFTAddress.TicketNFT);

  