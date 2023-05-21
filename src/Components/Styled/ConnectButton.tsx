import { useEffect } from 'react';
import { ButtonGlitch } from '.';
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';
import useWeb3 from '../../Hooks/useWeb3';

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
    const connect = useWeb3((state: any) => state.connect);
    const disconnect = useWeb3((state: any) => state.disconnect);
    const account = useWeb3((state: any) => state.account);

    const [style, api] = useSpring(() => ({
        transform: 'translate(36.5%, -100%)',
    }));

    const handleConnect = () => {
        connect();
    };

    const handleDisconnect = () => {
        disconnect();
    };

    useEffect(() => {
        if (account) {
            api.start({
                transform: 'translate(36.5%, 0%)',
            });
        } else {
            api.start({
                transform: 'translate(36.5%, -100%)',
            });
        }
    }, [api, account]);

    useEffect(() => {
        if (localStorage.getItem('isConnected') === 'true') {
            connect();
        }
    }, [connect]);

    return (
        <div style={{ position: 'relative', height: '6rem' }}>
            <ButtonGlitch
                signed={account}
                className="button-glitch"
                style={{
                    margin: '0 -0.35rem 0 2rem',
                    fontFamily: `${account ? 'VT323, monospace' : 'aAnotherTag'}`,
                    fontSize: `${account ? '1rem' : ''}`,
                    letterSpacing: account ? '1.5px' : '3px',
                    lineHeight: '20px',
                }}
                type="submit"
                onClick={handleConnect}
            >
                {account ? `0x...${account?.slice(-4)}` : 'Connect'}
            </ButtonGlitch>
            <DisconnectBtn style={style} onClick={handleDisconnect}>
                <span>Disconnect?</span>
            </DisconnectBtn>
        </div>
    );
}

export default ConnectButton;
