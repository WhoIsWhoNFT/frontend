import { useContractRead } from 'wagmi';
import collectionConfig from '../Constants/collection.config';
import { Networks } from '../Components/Functions/type';

const useDynamicContractRead = (functionName: string, args?: any[]) => {
  const { defaultNetwork } = collectionConfig;
  const contractAddress = collectionConfig[defaultNetwork as Networks]
    .address as `0x${string}`;

  return useContractRead({
    address: contractAddress,
    abi: collectionConfig.abi,
    functionName,
    args,
  });
};

export default useDynamicContractRead;
