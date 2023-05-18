import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import styled from 'styled-components';
import useDynamicContractWrite from '../../Hooks/useDynamicContractWrite';
import useDynamicContractRead from '../../Hooks/useDynamicContractRead';
import { SaleStage, getTotalCost } from '../Functions/type';
import useMerkleTree from '../../Hooks/useMerkleTree';
import { getProof } from '../Functions/merkleTree';
import collectionConfig from '../../Constants/collection.config';
import { ToastContainer, toast } from 'react-toastify';
import keccak256 from 'keccak256';

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

const OgMintButton = ({ mintCount }: { mintCount: number }) => {
    const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
    const { address } = useAccount();
    const baseOverrides = {
        from: address,
    };

    const ogProof = getProof(oglistsMerkle?.tree, address as string);

    // Get user balance
    const userPresaleBalance = useDynamicContractRead('balanceOf', [address]);

    // Get and calculate presale OG mint cost
    const presaleOgMintPrice = useDynamicContractRead('PRESALE_PRICE_OG');
    const presaleOgMintCost = getTotalCost(
        Number(presaleOgMintPrice.data ?? 0),
        mintCount,
    );

    // Write function initializations
    const ogMint = useDynamicContractWrite('ogMint', [mintCount, ogProof], {
        ...baseOverrides,
        value: presaleOgMintCost,
    });

    const mintLimit = () => {
        return collectionConfig.maxMint.PRESALE_OG;
    };

    const handleMint = () => {
        userPresaleBalance.refetch();
        const balance = userPresaleBalance.data;

        if (parseInt(String(balance), 10) + mintCount > mintLimit()) {
            toast('Maximum mint reached', { type: 'error' });
            return;
        }

        ogMint.write?.();
    };

    useEffect(() => {
        (async function () {
            let hash: `0x${string}` = '0x';

            if (ogMint.data) {
                hash = ogMint.data?.hash;
            }

            if (hash === '0x' || hash === undefined) return;
            const message = `Transaction Hash: 0x...${String(hash.slice(-5))}`;
            toast(message, { type: 'success' });

            try {
                await waitForTransaction({ hash });
                toast(`Yohoo! You successfully minted a WhoIsWho NFT 🎉 🎉`, {
                    type: 'success',
                });
            } catch (error) {
                console.error(error);
                toast(`There is an error minting your WhoIsWho NFT`, {
                    type: 'error',
                });
            }
        })();
    }, [ogMint.data]);

    useEffect(() => {
        if (ogMint.isError) {
            toast(ogMint.error?.message, {
                type: 'error',
            });
        }
    }, [ogMint.error?.message, ogMint.isError]);

    return (
        <MintBtn onClick={handleMint}>
            <span>MINT</span>
        </MintBtn>
    );
};

const WlMintButton = ({ mintCount }: { mintCount: number }) => {
    const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });
    const { address } = useAccount();
    const baseOverrides = {
        from: address,
    };

    const wlProof = getProof(whitelistsMerkle?.tree, address as string);

    // Get user balance
    const userPresaleBalance = useDynamicContractRead('balanceOf', [address]);

    // Get and calculate presale WL mint cost
    const presaleWlMintPrice = useDynamicContractRead('PRESALE_PRICE_WL');
    const presaleWlMintCost = getTotalCost(
        Number(presaleWlMintPrice.data ?? 0),
        mintCount,
    );

    // Write function initializations
    const wlMint = useDynamicContractWrite('wlMint', [mintCount, wlProof], {
        ...baseOverrides,
        value: presaleWlMintCost,
    });

    const mintLimit = () => {
        return collectionConfig.maxMint.PRESALE_WL;
    };

    const handleMint = () => {
        userPresaleBalance.refetch();
        const balance = userPresaleBalance.data;

        if (parseInt(String(balance), 10) + mintCount > mintLimit()) {
            toast('Maximum mint reached', { type: 'error' });
            return;
        }

        wlMint.write?.();
    };

    useEffect(() => {
        (async function () {
            let hash: `0x${string}` = '0x';

            if (wlMint.data) {
                hash = wlMint.data?.hash;
            }

            if (hash === '0x' || hash === undefined) return;
            const message = `Transaction Hash: 0x...${String(hash.slice(-5))}`;
            toast(message, { type: 'success' });

            try {
                await waitForTransaction({ hash });
                toast(`Yohoo! You successfully minted a WhoIsWho NFT 🎉 🎉`, {
                    type: 'success',
                });
            } catch (error) {
                console.error(error);
                toast(`There is an error minting your WhoIsWho NFT`, {
                    type: 'error',
                });
            }
        })();
    }, [wlMint.data]);

    useEffect(() => {
        if (wlMint.isError) {
            toast(wlMint.error?.message, {
                type: 'error',
            });
        }
    }, [wlMint.error?.message, wlMint.isError]);

    return (
        <MintBtn onClick={handleMint}>
            <span>MINT</span>
        </MintBtn>
    );
};

const PublicMint = ({ mintCount }: { mintCount: number }) => {
    const { address } = useAccount();
    const baseOverrides = {
        from: address,
    };

    const userPublicSaleBalance = useDynamicContractRead('getPublicSaleBalance', [
        address,
    ]);

    // Get and calculate public mint cost
    const publicMintPrice = useDynamicContractRead('PUBLIC_SALE_PRICE');
    const publicMintCost = getTotalCost(Number(publicMintPrice.data ?? 0), mintCount);

    const publicMint = useDynamicContractWrite('mint', [mintCount], {
        ...baseOverrides,
        value: publicMintCost,
    });

    const mintLimit = () => {
        return collectionConfig.maxMint.PUBLIC_SALE;
    };

    const handleMint = () => {
        userPublicSaleBalance.refetch();
        const balance = userPublicSaleBalance.data;

        if (parseInt(String(balance), 10) + mintCount > mintLimit()) {
            toast('Maximum mint reached', { type: 'error' });
            return;
        }

        publicMint.write?.();
    };

    useEffect(() => {
        (async function () {
            let hash: `0x${string}` = '0x';

            if (publicMint.data) {
                hash = publicMint.data?.hash;
            }

            if (hash === '0x' || hash === undefined) return;
            const message = `Transaction Hash: 0x...${String(hash.slice(-5))}`;
            toast(message, { type: 'success' });

            try {
                await waitForTransaction({ hash });
                toast(`Yohoo! You successfully minted a WhoIsWho NFT 🎉 🎉`, {
                    type: 'success',
                });
            } catch (error) {
                console.error(error);
                toast(`There is an error minting your WhoIsWho NFT`, {
                    type: 'error',
                });
            }
        })();
    }, [publicMint.data]);

    useEffect(() => {
        if (publicMint.isError) {
            toast(publicMint.error?.message, {
                type: 'error',
            });
        }
    }, [publicMint.error?.message, publicMint.isError]);

    return (
        <MintBtn onClick={handleMint}>
            <span>MINT</span>
        </MintBtn>
    );
};

const MintButton: React.FC<{ currentStage: SaleStage }> = ({ currentStage }) => {
    const [mintCount, setMintCount] = useState(1);
    const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
    const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });
    const { address } = useAccount();

    const checkWhitelist = () => {
        if (!(oglistsMerkle?.tree && whitelistsMerkle?.tree && address)) {
            return '';
        }

        const leaf = keccak256(address.trim().toLowerCase());
        const oglistsProof = oglistsMerkle.tree.getHexProof(leaf);
        const whitelistsProof = whitelistsMerkle.tree.getHexProof(leaf);
        const isOg = oglistsMerkle.tree.verify(oglistsProof, leaf, oglistsMerkle.root);
        const isWhitelist = whitelistsMerkle.tree.verify(
            whitelistsProof,
            leaf,
            whitelistsMerkle.root,
        );

        return isOg ? 'OG' : isWhitelist ? 'WL' : '';
    };

    const whitelistType = checkWhitelist();

    const mintLimit = () => {
        if (currentStage === 'PRESALE_OG') {
            return collectionConfig.maxMint.PRESALE_OG;
        } else if (currentStage === 'PRESALE_WL') {
            if (whitelistType === 'OG') {
                return collectionConfig.maxMint.PRESALE_OG;
            } else if (whitelistType === 'WL') {
                return collectionConfig.maxMint.PRESALE_WL;
            }
        } else if (currentStage === 'PUBLIC_SALE') {
            return collectionConfig.maxMint.PUBLIC_SALE;
        }

        return 2;
    };

    const handleIncrement = () => {
        if (mintCount < mintLimit()) {
            setMintCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrement = () => {
        if (mintCount > 1) {
            setMintCount(prevCount => prevCount - 1);
        }
    };

    const renderMintButton = () => {
        if (currentStage === 'PRESALE_OG') {
            return <OgMintButton mintCount={mintCount} />;
        } else if (currentStage === 'PRESALE_WL') {
            if (whitelistType === 'OG') {
                return <OgMintButton mintCount={mintCount} />;
            } else if (whitelistType === 'WL') {
                return <WlMintButton mintCount={mintCount} />;
            }
        } else if (currentStage === 'PUBLIC_SALE') {
            return <PublicMint mintCount={mintCount} />;
        }
        return <></>;
    };

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
                        {renderMintButton()}
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
