import React, { useState } from 'react';
import styled from 'styled-components';
import { getTotalCost } from '../Functions/type';
import collectionConfig from '../../Constants/collection.config';
import { ToastContainer, toast } from 'react-toastify';
import { utils } from 'ethers';
import useWeb3 from '../../Hooks/useWeb3';

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

const MintButton: React.FC = () => {
    const collection = useWeb3((state: any) => state.collection);
    const ethBalance = useWeb3((state: any) => state.ethBalance);
    const [mintCount, setMintCount] = useState(1);
    const mintLimit = collectionConfig.maxMint.PUBLIC_SALE;

    const handleIncrement = () => {
        if (mintCount < mintLimit) {
            setMintCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrement = () => {
        if (mintCount > 1) {
            setMintCount(prevCount => prevCount - 1);
        }
    };

    const handleMint = async () => {
        try {
            const cost = getTotalCost(
                Number(utils.parseEther(collectionConfig.publicSalePrice)),
                mintCount,
            );

            if (BigInt(String(cost)) > BigInt(String(ethBalance))) {
                throw new Error('Insufficient funds!');
            }

            const event = await collection.mint(mintCount, { value: cost });

            toast(`Transaction Hash: 0x...${event?.hash.slice(-4)}`, {
                type: 'success',
            });

            await event.wait();

            toast(`Yahoo! You successfully minted a WhoIsWho NFT 🎉 🎉`, {
                type: 'success',
            });
        } catch (error: any) {
            let errorMessage = error?.message;
            switch (error?.code) {
                case 'ACTION_REJECTED':
                    errorMessage = 'User rejected the transaction';
                    break;
                case 'UNPREDICTABLE_GAS_LIMIT':
                    errorMessage =
                        'There is an error minting your WhoIsWho NFT. Please contact WhoIsWho support';
                    break;
                default:
                    break;
            }
            toast(errorMessage, { type: 'error' });
        }
    };

    return (
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
    );
};

export default MintButton;
