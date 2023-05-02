import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { ButtonIcon } from './Components/Styled';
import { Grills } from './Components/Animated';
import { Home, Roadmap, Team, Whitelist } from './Components/Pages';
import styled from 'styled-components';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import ConnectButton from './Components/Styled/ConnectButton';
import { marginTop } from 'styled-system';

const chains = [mainnet, sepolia, hardhat];
const projectId = process.env.REACT_APP_WC_PROJECT_ID as string;
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

const Container = styled.div`
    position: relative;
    display: flex;

    @media only screen and (max-width: 958px) {
        transform: translateY(10rem);
    }
`;

const HeaderText = styled.div`
    font-family: 'VT323', monospace;
    line-height: 20px;

    @media (max-width: 800px) {
        font-size: 1rem;
    }
`;

const AppNav = styled.div`
    width: 100%;
    height: 3rem;
    margin-top: 1rem;
    align-items: center;
    font-size: 1.8rem;
    letter-spacing: 3px;
    font-family: 'ADrip';
    z-index: 10;

    @media (max-width: 800px) {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        font-size: 1.5rem;
    }
`;

const MobileHeader = styled.div`
    width: 100%;
    display: flex;
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    align-items: center;
    background-color: #2d3e4c;
    font-family: VT323, monospace;

    @media (max-width: 764px) and (min-width: 600px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
    }
`;

function App() {
    const [tab, setTab] = useState(0);
    const [isScreen1045, setIsScreen1045] = useState(false);
    const [isScreen764, setIsScreen764] = useState(false);
    const [isScreen600, setIsScreen600] = useState(false);

    const handleResize = () => {
        setIsScreen1045(window.innerWidth < 1045);
        setIsScreen764(window.innerWidth < 764);
        setIsScreen600(window.innerWidth < 600);
    };

    useMemo(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const Navigation = () => {
        return(
            <AppNav>
                <div className="noselect">
                    <span
                        onClick={() => {
                            setTab(0);
                        }}
                        className={tab === 0 ? 'NavBtnA' : 'NavBtn'}
                    >
                        HOME
                    </span>
                    |
                    <span
                        onClick={() => {
                            setTab(1);
                        }}
                        className={tab === 1 ? 'NavBtnA' : 'NavBtn'}
                    >
                        ROADMAP
                    </span>
                    |
                    {/* <span
                        onClick={() => {
                            setTab(2);
                        }}
                        className={tab === 2 ? 'NavBtnA' : 'NavBtn'}
                    >
                        TEAM
                    </span>
                    | */}
                    <span
                        onClick={() => {
                            setTab(3);
                        }}
                        className={tab === 3 ? 'NavBtnA' : 'NavBtn'}
                    >
                        WHITELIST
                    </span>
                </div>
            </AppNav>
        )
    }

    const Socials = () => {
        return (
            <div className="Socials noselect">
                <ButtonIcon icon="opensea" />
                <ButtonIcon
                    icon="instagram"
                    link="https://www.instagram.com/whoiswho.crew/"
                />
                <ButtonIcon icon="twitter" />
                <ButtonIcon icon="discord" />
            </div>
        )
    }

    return (
        <>
            <WagmiConfig client={wagmiClient}>
                <div className="App">
                    <header className="App-header">
                        <div className="Header-bar">
                            <div className="Shape-circle" />
                            <div className="Header-content">
                                <HeaderText className="Header-contnet-left">
                                    { !isScreen764 && Navigation() }
                                </HeaderText>
                                <div className="Header-content-right">
                                    { !isScreen1045 && Socials() }
                                    { !isScreen600 && <Grills /> }
                                    <ConnectButton />
                                </div>
                            </div>
                            {isScreen1045 ? (
                                <MobileHeader>
                                    {isScreen764 ? ( Navigation() ) : ( <></> )}
                                    {!isScreen600 ? (Socials()) : (<></>)}
                                </MobileHeader>
                            ) : (
                                <></>
                            )}
                            {isScreen600 && (<>
                                <>
                                    <div style={{width: "100%", marginTop: "1rem", position: "relative"}}>
                                        {Socials()}
                                    </div>
                                </>
                            </>)}
                        </div>
                    </header>
                    <Container>
                        <div style={{ width: '100%', padding: '1rem 0 0 0' }}>
                            {tab === 0 ? <Home /> : <></>}
                            {tab === 1 ? <Roadmap /> : <></>}
                            {tab === 2 ? <Team /> : <></>}
                            {tab === 3 ? <Whitelist /> : <></>}
                        </div>
                    </Container>
                </div>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    );
}

export default App;
