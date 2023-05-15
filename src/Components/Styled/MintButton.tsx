import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import useDynamicContractWrite from '../../Hooks/useDynamicContractWrite';
import useDynamicContractRead from '../../Hooks/useDynamicContractRead';
import { getTotalCost } from '../Functions/type';
import useMerkleTree from '../../Hooks/useMerkleTree';
import { getProof } from '../Functions/merkleTree';
import collectionConfig from '../../Constants/collection.config';
import { ToastContainer, toast } from 'react-toastify';

const BtnCounter = styled.button`
    width: 4.5rem;
    height: 2rem;
    -webkit-clip-path: polygon(5% 0, 95% 0%, 100% 15%, 70% 100%, 30% 100%, 0% 15%);
    clip-path: polygon(5% 0, 95% 0%, 100% 15%, 70% 100%, 30% 100%, 0% 15%);
    background: radial-gradient(#ff2c18 30%, #9b180c);
    position: relative;
    z-index: 10;
`;

const InputStyle = styled.div`
    width: 60%;
    height: 2rem;
    clip-path: polygon(10% 0%, 90% 0%, 100% 85%, 98% 100%, 2% 100%, 0% 85%);
    background-color: #ffffff;
`;
const InputMint = styled.input`
    width: 100%;
    color: black;
    padding: 0 1rem;
    border: 0;
    outline: none !important;
    text-align: center;
    font-family: 'digitalNormal';
    font-size: 1.2rem;
    font-weight: 1000;
    letter-spacing: 3px;

    &:focus {
        border: 0;
        outline: none !important;
    }
`;

const AppContainer = styled.div`
    width: 100%;
    height: min-content;
    display: block;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
`;

const BtnBG = styled.div`
    width: 24rem;
    height: 3rem;
    display: flex;
    padding: 0.5rem 1.5rem;
    clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
    background-color: #1d803e;
    position: relative;
    z-index: 3;
`;

const MintBtn = styled.button`
    width: 13rem;
    height: 1.9rem;
    clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
    background: radial-gradient(#47bdfd 30%, #1b57e2);
    font-family: 'aAnotherTag';
    font-size: 2rem;
    letter-spacing: 5px;
`;

const GlowWrapper = styled.div<{ color1?: string; color2?: string }>`
    width: min-content;
    height: min-content;
    filter: ${({ color1, color2 }) =>
        `drop-shadow(0 0 5px ${color1 ?? '#ff2525'}) drop-shadow(0 0 1px ${
            color2 ?? '#ff2727'
        })`};
`;

const MintButton: React.FC<{ currentStage: string }> = ({ currentStage }) => {
    const [mintCount, setMintCount] = useState(1);

    const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
    const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });
    const { address } = useAccount();

    const baseOverrides = {
        from: address,
    };

    const ogProof = getProof(oglistsMerkle?.tree, address as string);
    const wlProof = getProof(whitelistsMerkle?.tree, address as string);

    // Get user balance
    const userBalance = useDynamicContractRead('balanceOf', [address]);
    const userPublicSaleBalance = useDynamicContractRead('getPublicSaleBalance', [
        address,
    ]);

    // Get and calculate presale OG mint cost
    const presaleOgMintPrice = useDynamicContractRead('PRESALE_PRICE_OG');
    const presaleOgMintCost = getTotalCost(
        Number(presaleOgMintPrice.data ?? 0),
        mintCount,
    );

    // Get and calculate presale WL mint cost
    const presaleWlMintPrice = useDynamicContractRead('PRESALE_PRICE_WL');
    const presaleWlMintCost = getTotalCost(
        Number(presaleWlMintPrice.data ?? 0),
        mintCount,
    );

    // Get and calculate public mint cost
    const publicMintPrice = useDynamicContractRead('price');
    const publicMintCost = getTotalCost(Number(publicMintPrice.data ?? 0), mintCount);

    // Write function initializations
    const ogMint = useDynamicContractWrite('ogMint', [mintCount, ogProof], {
        ...baseOverrides,
        value: presaleOgMintCost,
    });

    const wlMint = useDynamicContractWrite('wlMint', [mintCount, wlProof], {
        ...baseOverrides,
        value: presaleWlMintCost,
    });

    const publicMint = useDynamicContractWrite('mint', [mintCount], {
        ...baseOverrides,
        value: publicMintCost,
    });

    // Stage Config
    const stageConfig: Record<string, { maxMint: number; mint: any }> = {
        PRESALE_OG: {
            maxMint: collectionConfig.maxMint.PRESALE_OG,
            mint: ogMint?.write,
        },
        PRESALE_WL: {
            maxMint: collectionConfig.maxMint.PRESALE_WL,
            mint: wlMint?.write,
        },
        PUBLIC_SALE: {
            maxMint: collectionConfig.maxMint.PUBLIC_SALE,
            mint: publicMint?.write,
        },
    };

    const handleIncrement = () => {
        let limit = 2;
        switch (currentStage) {
            case 'PRESALE_OG':
                limit = stageConfig.PRESALE_OG.maxMint;
                break;

            case 'PRESALE_WL':
                limit = stageConfig.PRESALE_WL.maxMint;
                break;

            case 'PUBLIC_SALE':
                limit = stageConfig.PUBLIC_SALE.maxMint;
                break;

            default:
                break;
        }

        if (mintCount < limit) {
            setMintCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrement = () => {
        if (mintCount > 1) {
            setMintCount(prevCount => prevCount - 1);
        }
    };

    const handleMint = () => {
        userBalance.refetch();
        userPublicSaleBalance.refetch();

        if (currentStage in stageConfig) {
            const { maxMint, mint } = stageConfig[currentStage];
            const balance =
                currentStage === 'PUBLIC_SALE'
                    ? userPublicSaleBalance.data
                    : userBalance.data;

            if (parseInt(String(balance)) < maxMint) {
                mint?.();
            } else {
                toast('Maximum mint reached', { type: 'error' });
            }
        }
    };

    useEffect(() => {
        (async function () {
            let hash = '';
            let wait: any;

            if (wlMint.data) {
                hash = wlMint.data?.hash;
                wait = wlMint.data?.wait;
            } else if (ogMint.data) {
                hash = ogMint.data?.hash;
                wait = ogMint.data?.wait;
            } else if (publicMint.data) {
                hash = publicMint.data?.hash;
                wait = publicMint.data?.wait;
            }

            if (!hash) return;
            const message = `Transaction Hash: 0x...${String(hash.slice(-5))}`;
            toast(message, { type: 'success' });
            await wait();
            toast(`Yohoo! You successfully minted a WhoIsWho NFT 🎉 🎉`, {
                type: 'success',
            });
        })();
    }, [ogMint.data, wlMint.data, publicMint.data]);

    return currentStage !== 'IDLE' && currentStage !== undefined ? (
        <>
            <AppContainer>
                <Container>
                    <BtnBG>
                        <GlowWrapper>
                            <BtnCounter className="buttonGlow" onClick={handleDecrement}>
                                <span>
                                    <b>-</b>
                                </span>
                            </BtnCounter>
                        </GlowWrapper>
                        <InputStyle>
                            <InputMint
                                readOnly
                                type="text"
                                id="fname"
                                name="fname"
                                value={mintCount}
                            ></InputMint>
                        </InputStyle>
                        <GlowWrapper>
                            <BtnCounter className="buttonGlow" onClick={handleIncrement}>
                                <span>
                                    <b>+</b>
                                </span>
                            </BtnCounter>
                        </GlowWrapper>
                    </BtnBG>
                </Container>
                <Container>
                    <GlowWrapper color1="#00d5ff" color2="#0053fa">
                        <MintBtn onClick={handleMint}>
                            <span>MINT</span>
                        </MintBtn>
                    </GlowWrapper>
                </Container>
            </AppContainer>
            <ToastContainer theme="dark" />
        </>
    ) : (
        <></>
    );
};

export default MintButton;
