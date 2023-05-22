import { useState, useMemo, useCallback, useEffect } from 'react';
import { SlideCovers } from '../Animated';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import useWeb3 from '../../Hooks/useWeb3';
import RelayMintButton from '../Styled/RelayMintButton';
import collectionConfig from '../../Constants/collection.config';

let supplyInterval: any = null;

type TimerProps = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    completed?: boolean;
    gap?: string;
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

const Timer = styled.div<{ gap?: string }>`
    display: flex;
    gap: ${({ gap }) => gap ?? '1.5vw'};
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

    @media (max-width: 500px) {
        font-size: 0.6rem;
    }
`;

const MintInfo = styled.div`
    display: flex;
    flex-flow: row wrap;
    gap: 1.5vw;
    font-size: 1.5vw;
    font-weight: 1000;
    font-family: 'Orbitron';

    @media (max-width: 720px) {
        font-size: 0.8rem;
    }

    @media (max-width: 500px) {
        flex-flow: column wrap;
        gap: unset;
    }
`;

const InfoRight = styled.div`
    transform: translateX(30vw);
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
`;

const MintInfoV = styled.div`
    display: flex;
    flex-flow: column wrap;
    font-size: 1.5vw;
    font-weight: 1000;
    font-family: 'Orbitron';
`;

const Completionist = ({ currentStage }: { currentStage: string }) => {
    let phase = '';

    switch (currentStage) {
        case 'PRESALE_OG':
            phase = 'OGs are';
            break;

        case 'PRESALE_WL':
            phase = 'WLs are';
            break;

        case 'PUBLIC_SALE':
            phase = 'WLs are';
            break;

        default:
            phase = 'You are';
            break;
    }

    return <Timer className="glow">{phase} good to go!</Timer>;
};

const Renderer: React.FC<TimerProps & { currentStage: string }> = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
    gap,
    currentStage,
}) => {
    if (completed) {
        // Render a completed state
        return <Completionist currentStage={currentStage} />;
    } else {
        // Render a countdown
        return (
            <>
                <Timer className="glow" gap={gap}>
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
    const signer = useWeb3((state: any) => state.signer);
    const collection = useWeb3((state: any) => state.collection);
    const presaleDateStatic = collectionConfig.presaleStartDate;
    const presaleDateParsed = new Date(parseInt(String(presaleDateStatic)) * 1000);
    const currentStage = 'PRESALE_WL';

    // States
    const [supply, setSupply] = useState(0);
    const [isScreen1150, setIsScreen1150] = useState(false);

    // Get total supply in realtime
    const getRealtimeTotalSupply = useCallback(async () => {
        const totalSupply = await collection?.totalSupply();
        setSupply(totalSupply);
    }, [collection]);

    const handleResize = () => {
        setIsScreen1150(window.innerWidth < 1150);
    };

    useMemo(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        getRealtimeTotalSupply();
        supplyInterval = setInterval(getRealtimeTotalSupply, 1000);
        return () => {
            clearInterval(supplyInterval);
        };
    }, [getRealtimeTotalSupply]);

    return (
        <>
            <div className="Banner">
                <BannerName>
                    {isScreen1150 ? (
                        <>
                            <Countdown
                                date={presaleDateParsed}
                                renderer={props => (
                                    <Renderer {...props} currentStage={currentStage} />
                                )}
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    <BannerLogo
                        src={require('../../Assets/images/main-logo.png')}
                        alt=""
                    />
                    {isScreen1150 ? (
                        <MintInfo>
                            <div>{`Supply: ${
                                parseInt(String(supply !== undefined ? supply : 1), 10) -
                                1
                            } / 5000`}</div>
                            <div>OG x 3</div>
                            <div>WL x 2</div>
                            <div>PL x 5</div>
                        </MintInfo>
                    ) : (
                        <></>
                    )}
                </BannerName>
                <div className="ImgContainer" style={{ justifyContent: 'left' }}>
                    <img
                        className="Banner-model"
                        src={require('../../Assets/images/blackplasticwho.png')}
                        alt=""
                    />
                    {isScreen1150 ? (
                        <></>
                    ) : (
                        <InfoRight>
                            <Countdown
                                date={presaleDateParsed}
                                renderer={({
                                    days,
                                    hours,
                                    minutes,
                                    seconds,
                                    completed,
                                }) => {
                                    return (
                                        <>
                                            {Renderer({
                                                days,
                                                hours,
                                                minutes,
                                                seconds,
                                                completed,
                                                gap: '0.5rem',
                                                currentStage,
                                            })}
                                        </>
                                    );
                                }}
                            />
                            <MintInfoV>
                                <div>{`Supply: ${
                                    parseInt(
                                        String(supply !== undefined ? supply : 1),
                                        10,
                                    ) - 1
                                } / 5000`}</div>{' '}
                                <div>OG x 3</div>
                                <div>WL x 2</div>
                                <div>PL x 5</div>
                            </MintInfoV>
                        </InfoRight>
                    )}
                </div>
            </div>
            <div className="PrevCollections">
                <SlideCovers />
            </div>
            {new Date().getTime() / 1000 > presaleDateStatic && signer && (
                <RelayMintButton />
            )}
            {/* <MintButton currentStage={currentStage} /> */}
        </>
    );
}
