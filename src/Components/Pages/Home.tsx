import { SlideCovers } from '../Animated';
import { MintButton } from '../Styled';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import { useCallback, useEffect } from 'react';
import useDynamicContractRead from '../../Hooks/useDynamicContractRead';

type TimerProps = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    completed?: boolean;
};

const BannerName = styled.div`
    display: flex;
    flex-flow: column wrap;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
`;

const BannerLogo = styled.img`
    width: calc(10px + 100vmin);
    margin-right: -12vmin;
    display: block;
`;

const Timer = styled.div`
    display: flex;
    gap: 1.5vw;
    font-family: 'digitalNormal';
    font-size: 2vw;
    transform: translateY(1.2vw);
    -webkit-box-reflect: below -33px linear-gradient(transparent 35%, #0008);

    @media (max-width: 720px) {
        font-size: 1.2rem;
    }
`;
const TimerFrame = styled.span`
    font-size: 1.3vw;
    transform: translateY(-0.5rem);

    @media (max-width: 720px) {
        font-size: 1rem;
    }
`;

const MintInfo = styled.div`
    display: flex;
    flex-flow: row wrap;
    gap: 1.5vw;
    font-size: 1.5vw;
    font-weight: 1000;
    font-family: 'Orbitron';
    -webkit-box-reflect: below -6px linear-gradient(transparent 35%, #0008);

    @media (max-width: 720px) {
        font-size: 0.8rem;
    }

    @media (max-width: 500px) {
        flex-flow: column wrap;
    }
`;

const Completionist = () => <span>You are good to go!</span>;

const Renderer: React.FC<TimerProps> = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <Completionist />;
    } else {
        // Render a countdown
        return (
            <>
                <Timer className="glow">
                    <div>
                        <span>{days}</span>
                        &nbsp;<TimerFrame>Days</TimerFrame>
                    </div>
                    <div>
                        <span>{hours}</span>
                        &nbsp;<TimerFrame>Hrs</TimerFrame>
                    </div>
                    <div>
                        <span>{minutes}</span>
                        &nbsp;<TimerFrame>Min</TimerFrame>
                    </div>
                    <div>
                        <span>{seconds}</span>
                        &nbsp;<TimerFrame>Sec</TimerFrame>
                    </div>
                </Timer>
            </>
        );
    }
};

export default function App() {
    const supply = useDynamicContractRead('totalSupply');
    const presaleDate = useDynamicContractRead('presaleDate');
    const presaleDateParsed = new Date(parseInt(String(presaleDate?.data ?? 0)) * 1000);

    const getRealtimeTotalSupply = useCallback(() => supply.refetch(), [supply]);
    const supplyInterval = setInterval(getRealtimeTotalSupply, 1000);

    useEffect(() => {
        getRealtimeTotalSupply();
        return () => clearInterval(supplyInterval);
    }, [getRealtimeTotalSupply, supplyInterval]);

    return (
        <>
            <div className="Banner">
                <BannerName>
                    {presaleDate !== undefined && (
                        <Countdown date={presaleDateParsed} renderer={Renderer} />
                    )}
                    <BannerLogo
                        src={require('../../Assets/images/main-logo.png')}
                        alt=""
                    />
                    <MintInfo>
                        <div>{`Supply: ${supply?.data ?? 0} / 5000`}</div>
                        <div>OG x 3</div>
                        <div>WL x 2</div>
                    </MintInfo>
                </BannerName>
                <div className="ImgContainer" style={{ justifyContent: 'left' }}>
                    <img
                        className="Banner-model"
                        src={require('../../Assets/images/blackplasticwho.png')}
                        alt=""
                    />
                </div>
            </div>
            <div className="PrevCollections">
                <SlideCovers />
            </div>
            <MintButton />
        </>
    );
}
