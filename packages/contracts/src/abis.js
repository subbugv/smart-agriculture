import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import storageAbi from "./abis/storage_metadata.json";
import distributionAbi from "./abis/distribution_metadata.json";

const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  storage: storageAbi.output.abi,
  distribution: distributionAbi.output.abi,
};

export default abis;
