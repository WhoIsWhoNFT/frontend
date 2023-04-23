import './App.css';
import { useEffect, useState } from 'react';
import { ButtonGlitch, ButtonIcon, MintButton } from './Components/Styled';
import { Grills } from './Components/Animated';
import { Home, Roadmap, Team, Whitelist } from './Components/Pages';
import styled from 'styled-components';
import { useSpring, animated } from '@react-spring/web';
import useWeb3 from './Store/useWeb3';

const Container = styled.div`
    position: relative;
    display: flex;

    @media only screen and (max-width: 958px) {
        transform: translateY(4rem);
    }
`;

const ModalBG = styled(animated.div)`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    background-color: #0000009d;
    z-index: 99;
    font-family: 'VT323', monospace;
    opacity: 0;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    margin: 0 0 0 8rem;
    font-size: 1.8rem;
    letter-spacing: 3px;
    font-family: 'ADrip';

    @media (max-width: 800px) {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        font-size: 1.5rem;
    }
`;

const DisconnectBtn = styled(animated.button)`
    width: 10.8rem;
    height: 2.5rem;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    position: absolute;
    background-color: #e63525;
    z-index: 3;
    font-family: 'VT323', monospace;
    transform: translate(4%, 100%);
    -webkit-transition: all 0.15s ease-in-out;
    transition: box-shadow 0.15s ease-in-out;
    clip-path: polygon(0px 0px, 100% 0px, 100% 80%, 95% 100%, 5% 100%, 0px 80%);

    &:hover {
        box-shadow: 0 0 20px 0 #00d7c3 inset, 0 0 50px 15px #00d7c3;
    }
`;

const MobileHeader = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    align-items: center;
    background-color: #2d3e4c;
    font-family: VT323, monospace;
`;

function App() {
    const connectWeb3 = useWeb3(state => state.connectWeb3);
    const signer = useWeb3(state => state.signer);

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState(0);

    const [style, api] = useSpring(() => ({
        transform: 'translate(4%, 0%)',
    }));

    const [isScreenLimit, setIsScreenLimit] = useState(false);

    const handleClick = () => {
        if (!open) {
            api.start({
                transform: 'translate(4%, 100%)',
            });
        } else {
            api.start({
                transform: 'translate(4%, 0%)',
            });
        }
        setOpen(!open);
    };

    const renderAccount = () =>
        signer?.address
            ? `${signer.address.slice(0, 5)}...${signer.address.slice(-5)}`
            : 'Connect Wallet';

    useEffect(() => {
        connectWeb3();
        return () => {};
    }, [connectWeb3]);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenLimit(window.innerWidth < 976);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div className="Header-bar">
                    <div className="Shape-circle" />
                    <div className="Header-content">
                        <HeaderText className="Header-contnet-left">
                            {isScreenLimit ? (
                                <></>
                            ) : (
                                <p>5000 COLLECTION MINT PRICE: 0.025ETH</p>
                            )}
                        </HeaderText>
                        <div className="Header-content-right">
                            {isScreenLimit ? (
                                <></>
                            ) : (
                                <div className="Socials">
                                    <ButtonIcon icon="opensea" />
                                    <ButtonIcon
                                        icon="instagram"
                                        link="https://www.instagram.com/whoiswho.crew/"
                                    />
                                    <ButtonIcon icon="twitter" />
                                    <ButtonIcon icon="discord" />
                                </div>
                            )}
                            <Grills />

                            <ButtonGlitch
                                signed={signer}
                                className="button-glitch"
                                style={{
                                    margin: '0 -0.35rem 0 2rem',
                                    fontFamily: `${
                                        signer ? 'VT323, monospace' : 'aAnotherTag'
                                    }`,
                                    fontSize: `${signer ? '1rem' : ''}`,
                                    letterSpacing: '3px',
                                    lineHeight: '20px',
                                }}
                                type="submit"
                                onClick={() => {
                                    if (signer) {
                                        handleClick();
                                    }
                                }}
                            >
                                {renderAccount()}
                            </ButtonGlitch>
                            {signer ? (
                                <DisconnectBtn style={style}>
                                    <span>Disconnect?</span>
                                </DisconnectBtn>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    {isScreenLimit ? (
                        <MobileHeader>
                            <p>5000 COLLECTION MINT PRICE: 0.025ETH</p>
                            <div className="Socials">
                                <ButtonIcon icon="opensea" />
                                <ButtonIcon
                                    icon="instagram"
                                    link="https://www.instagram.com/whoiswho.crew/"
                                />
                                <ButtonIcon icon="twitter" />
                                <ButtonIcon icon="discord" />
                            </div>
                        </MobileHeader>
                    ) : (
                        <></>
                    )}
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
    );
}

export default App;
