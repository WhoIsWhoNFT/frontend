import { useEffect } from 'react';
import { ButtonGlitch } from '.';
import { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useDisconnect } from 'wagmi';
import styled from 'styled-components';

const DisconnectBtn = styled(animated.button)`
    width: 7.2rem;
    height: 2.5rem;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    position: absolute;
    background-color: #e63525;
    z-index: 3;
    font-size: 1rem;
    font-family: 'VT323', monospace;
    transform: translate(4%, 100%);
    border-top: 5px solid black;
    -webkit-transition: all 0.15s ease-in-out;
    transition: box-shadow 0.15s ease-in-out;
    clip-path: polygon(0px 0px, 100% 0px, 100% 80%, 95% 100%, 5% 100%, 0px 80%);

    &:hover {
        box-shadow: 0 0 20px 0 #00d7c3 inset, 0 0 50px 15px #00d7c3;
    }
`;

function ConnectButton() {
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const [connecting, setConnecting] = useState(false);
    const [animOpen, setAnimOpen] = useState(false);
    const [style, api] = useSpring(() => ({
        transform: 'translate(36.5%, -100%)',
    }));

    const onOpen = async () => {
        setConnecting(true);
        await open();
        setConnecting(false);
    };

    const handleConnect = () => {
        if (!isConnected) {
            onOpen();
        }
    };

    const handleDisconnect = () => {
        if (isConnected) {
            disconnect();
        }
    };

    useEffect(() => {
        if (isConnected) {
            api.start({
                transform: 'translate(36.5%, 0%)',
            });
        } else {
            api.start({
                transform: 'translate(36.5%, -100%)',
            });
        }
    }, [isConnected]);

    return (
        <div style={{ position: 'relative', height: '6rem' }}>
            <ButtonGlitch
                disabled={connecting}
                signed={isConnected}
                className="button-glitch"
                style={{
                    margin: '0 -0.35rem 0 2rem',
                    fontFamily: `${isConnected ? 'VT323, monospace' : 'aAnotherTag'}`,
                    fontSize: `${isConnected ? '1rem' : ''}`,
                    letterSpacing: isConnected ? '1.5px' : '3px',
                    lineHeight: '20px',
                }}
                type="submit"
                onClick={handleConnect}
            >
                {connecting
                    ? 'Loading...'
                    : isConnected
                    ? `0x...${address?.slice(-4)}`
                    : 'Connect'}
            </ButtonGlitch>
            {/* @todo Disconnect button is missing when page is refreshed */}
            <DisconnectBtn style={style} onClick={handleDisconnect}>
                <span>Disconnect?</span>
            </DisconnectBtn>
        </div>
    );
}

export default ConnectButton;
