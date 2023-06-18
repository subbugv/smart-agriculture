
import { ethers } from "ethers";
import abis from '@project/contracts/src/abis';

const network = process.env.NETWORK_NAME;
const contractInstance = async () => {
  const provider = await ethers.getDefaultProvider(network, {
    infura: {
      projectId: process.env.REACT_APP_INFURA_PROJECT_ID,
    },
  });
  const Contract = await new ethers.Contract(
    "0x001AeD30b8dAbb3e7CCc7A4cB06AD341151EA390",
    abis.storage,
    provider
  );
  return Contract;
};

export default contractInstance;
