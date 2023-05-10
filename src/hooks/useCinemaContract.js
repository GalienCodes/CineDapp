import { useContract } from "./useContract";
import Cinema from "../contracts/Cinema.json";
import CinemaAddress from "../contracts/CinemaAddress.json";

// export interface for smart contract
export const useCinemaContract = () =>
  useContract(Cinema.abi, CinemaAddress.Cinema);

  