import { useEffect } from 'react';
import styled from 'styled-components';
import { type, clear, pause } from '../Functions/type';
import { CRT, Terminal, TerminalContainer } from '../Styled';
import useWalletChecker from '../../Hooks/useWalletChecker';
import useWeb3 from '../../Store/useWeb3';

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
`;

const Modal = styled.div`
    width: 50%;
    height: 50%;
    padding: 0.2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: #d62020;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    clip-path: polygon(5% 0%, 100% 0, 100% 90%, 95% 100%, 0 100%, 0 10%);
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    padding: 1rem;
    clip-path: polygon(5% 0%, 100% 0, 100% 90%, 95% 100%, 0 100%, 0 10%);
    background-color: black;
`;

const Input = styled.input`
    width: 100%;
    color: #ffffff;
    padding: 0 1rem;
    margin: 5rem 0 0 0;
    border: 0;
    outline: none !important;
    text-align: center;
    background-color: #595959;

    &:focus {
        border: 0;
        outline: none !important;
    }
`;

const MintBtn = styled.button`
    width: 13rem;
    height: 1.9rem;
    margin: 1rem 0 0 0;
    clip-path: polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%);
    background: radial-gradient(#2cb5ff 30%, #1b57e2);

    &:hover {
        background: radial-gradient(#47bdfd 30%, #1b57e2);
    }
`;

const IsWhitelistedText = styled.div`
    font-size: 2rem;
    letter-spacing: 3px;
    color: white;
    margin: 5rem auto;
    text-align: center;

    @media (max-width: 650px){
        font-size: 1.2rem;
    }
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1rem 3rem;
    font-size: 2rem;

    @media (max-width: 650px){
        font-size: 1.2rem;
    }
`

export default function App() {
    const signer = useWeb3(state => state.signer);
    const isWhitelisted = useWalletChecker();
    var whitelistResult:string = '';

    if(signer){
        whitelistResult = isWhitelisted ? "Congrats you're whitelisted" : "Sorry, you're not in the whitelist\n";
    } else {
        whitelistResult = "Please connect wallet"
    }

    function ClearContent() {
        const elContent = document.querySelector('#terminalContent');
        clear(elContent);
    }

    async function TypeResult(){
        ClearContent();
        const elContent = document.querySelector('#terminalContent');
        if(signer){
            await type(
                'LOADING...',
                {
                    wait: 300,
                    initialWait: 0,
                    finalWait: 3500,
                    processChars: true,
                },
                elContent
            );
            ClearContent();
            await type(
                ' ',
                {
                    wait: 0,
                    initialWait: 0,
                    finalWait: 1000,
                    processChars: true,
                },
                elContent
            );
            ClearContent()
        }
        await type(
            whitelistResult,
            {
                wait: 15,
                initialWait: 0,
                finalWait: 3000,
                processChars: true,
            },
            elContent
        );
    }

    useEffect(() => {
        TypeResult();
    }, [signer]);

    return (
        <AppContainer className="Whitelist">
            <CRT id="crt">
                <div className="scanline"></div>
                <Terminal className="terminal">
                    <Modal>
                        <Header>
                            <h1>WHITELIST_CHECKER.exe</h1>
                        </Header>
                        <Content>
                            <IsWhitelistedText>
                            <Terminal className="terminal">
                                <TerminalContainer id='terminalContent' />
                            </Terminal>
                            </IsWhitelistedText>
                        </Content>
                    </Modal>
                </Terminal>
            </CRT>
        </AppContainer>
    );
}
