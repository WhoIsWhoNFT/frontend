import { useRef } from 'react';
import styled from 'styled-components';
import { type, clear } from '../Functions/type';
import { CRT, Terminal, TerminalContainer } from '../Styled';
import { ethers } from 'ethers';
import useMerkleTree from '../../Hooks/useMerkleTree';
import keccak256 from 'keccak256';

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

    @media (max-width: 950px) {
        width: 70%;
        top: 40%;
        transform: translate(-50%, -40%);
    }

    @media (max-width: 675px) {
        width: 80%;
        top: 30%;
        transform: translate(-50%, -30%);
    }

    @media (max-width: 405px) {
        width: 90%;
        top: 20%;
        transform: translate(-50%, -20%);
    }
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-items: center;
    align-items: center;
    padding: 1rem;
    clip-path: polygon(5% 0%, 100% 0, 100% 90%, 95% 100%, 0 100%, 0 10%);
    background-color: black;
`;

const Input = styled.input`
    width: 100%;
    color: #ffffff;
    padding: 0 1rem;
    margin: 2rem 0 0 0;
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

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1rem 3rem;
    font-size: 2rem;

    @media (max-width: 650px) {
        font-size: 1.2rem;
    }
`;

export default function App() {
    const inputRef = useRef<HTMLInputElement>(null);
    const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
    const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });

    function ClearContent() {
        const elContent = document.querySelector('#terminalContent');
        clear(elContent);
    }

    async function TypeResult(message: string, notValid?: boolean) {
        ClearContent();
        const elContent = document.querySelector('#terminalContent');
        if (inputRef?.current?.value && !notValid) {
            await type(
                'LOADING...',
                {
                    wait: 300,
                    initialWait: 0,
                    finalWait: 3500,
                    processChars: true,
                },
                elContent,
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
                elContent,
            );
            ClearContent();
        }
        await type(
            message,
            {
                wait: 15,
                initialWait: 0,
                finalWait: 3000,
                processChars: true,
            },
            elContent,
        );
    }

    async function handleCheckWhitelist() {
        if (!inputRef?.current) return;

        let resultLabel = 'Something went wrong please contact WhoIsWho support';
        const isValidAddress = ethers.utils.isAddress(
            String(inputRef.current.value).toLowerCase(),
        );

        if (!isValidAddress) {
            TypeResult('Oops! Invalid wallet address', true);
            return;
        }

        if (oglistsMerkle?.tree && whitelistsMerkle?.tree) {
            const leaf = keccak256(inputRef.current.value.trim().toLowerCase());
            const oglistsProof = oglistsMerkle.tree.getHexProof(leaf);
            const whitelistsProof = whitelistsMerkle.tree.getHexProof(leaf);

            const isOg = oglistsMerkle.tree.verify(
                oglistsProof,
                leaf,
                oglistsMerkle.root,
            );

            const isWhitelist = whitelistsMerkle.tree.verify(
                whitelistsProof,
                leaf,
                whitelistsMerkle.root,
            );

            resultLabel = isOg
                ? "Awesome you're an OG !!!"
                : isWhitelist
                ? "Congrats you're whitelisted !!!\n"
                : "Sorry, you're not in the whitelist\n";
        }

        TypeResult(resultLabel);
    }

    return (
        <AppContainer className="Whitelist">
            <CRT id="crt">
                <div className="scanline"></div>
                <Terminal className="terminal">
                    <Modal>
                        <Header>
                            <h1>WHOLIST_CHECKER.exe</h1>
                        </Header>
                        <Content>
                            <Input ref={inputRef} />

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <MintBtn onClick={() => handleCheckWhitelist()}>
                                    Check
                                </MintBtn>
                            </div>

                            <Terminal
                                className="terminal"
                                style={{
                                    width: '100%',
                                    padding: '0rem',
                                    margin: '2rem 0 0 0',
                                    textAlign: 'center',
                                }}
                            >
                                <TerminalContainer id="terminalContent" />
                            </Terminal>
                        </Content>
                    </Modal>
                </Terminal>
            </CRT>
        </AppContainer>
    );
}
