import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import collectionConfig from '../Constants/collection.config';
import { Networks } from '../Components/Functions/type';
import networkConfig from '../Constants/network.config';

type Functions = 'ogMint' | 'wlMint' | 'mint';

const useDynamicContractWrite = (
  functionName: Functions,
  args: any[],
  overrides: Record<string, any>,
) => {
  const { defaultNetwork } = networkConfig;
  const contractAddress = collectionConfig[defaultNetwork as Networks]
    .address as `0x${string}`;

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: collectionConfig.abi,
    functionName,
    args,
    overrides,
  });

  return useContractWrite(config);
};

export default useDynamicContractWrite;
