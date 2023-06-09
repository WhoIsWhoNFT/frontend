import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { fromPairs } from 'lodash';
export { default as ButtonIcon } from './IconButton';
export { default as MintButton } from './MintButton';
export { CRT, Terminal, TerminalContainer } from './Crt';

export const ButtonGlitch = styled.button<{ signed?: any }>`
    min-width: 7.8rem;
    max-width: 26rem;
    height: 3rem;
    padding: 0 1rem;
    background: linear-gradient(45deg, transparent 5%, #e63525 5%);
    border: 0;
    color: #fff;
    letter-spacing: 2.5px;
    box-shadow: 1rem 0px 0px ${({ signed }) => (signed ? '#00ffe1' : '#303030')};
    outline: transparent;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    position: relative;
    z-index: 5;
`;

export const AnimFlex = styled(animated.div)`
    display: flex;
`;
