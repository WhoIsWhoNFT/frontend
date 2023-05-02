import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { styled } from '@stitches/react';
import { useTrail, animated, SpringValue } from '@react-spring/web';

const AppContainer = styled('div', {
    width: '100%',
    height: 'max-content',
    display: 'flex',
    justifyContent: 'center',
});

const Container = styled('div', {
    width: '100%',
    height: 'max-content',
    padding: '1rem 0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    background: '#d62020',
});

const Box = styled('div', {
    position: 'relative',
    height: '13rem',
    width: '13rem',
});

const SharedStyles = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    fontWeight: 800,
    backfaceVisibility: 'hidden',
    backgroundImage: 'linear-gradient(60deg, #3700ff, #000485, 80%,#000000)',
};

const ImgContainer = styled('div', {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
});

const Cover = styled(animated.div, {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
    backgroundColor: '#303030',
    position: 'absolute',
    backgroundImage: `url(${require('../../Assets/images/tag.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
});

const CoverImg = styled(animated.div, {
    width: '100%',
    height: '100%',
    clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
    position: 'absolute',
    zIndex: 2,
    backgroundImage: `url(${require('../../Assets/images/tag.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
});

const BoxInsetShadow = styled('div', {
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 10px #000000',
    '-moz-box-shadow': 'inset 0 0 10px #000000',
    '-webkit-box-shadow': 'inset 0 0 10px #000000',
    zIndex: 5,
});

const FrontBox = styled('div', {
    ...SharedStyles,
});

const BackBox = styled(animated.div, {
    ...SharedStyles,
});

const front = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '0001.png',
    '0002.png',
    '0003.png',
    '0004.png',
    '0005.png',
    '0006.png',
    '0007.png',
    '0008.png',
    '0010.png',
    '0011.png',
    '0012.png',
    '0013.png',
    '0014.png',
    '0015.png',
    '0016.png',
    '0017.png',
    '0018.png',
    '0019.png',
    '0020.png',
    '0021.png',
    '0022.png',
    '0023.png',
    '0024.png',
    '0025.png',
    '0026.png',
    '0027.png',
    '0028.png',
    '0029.png',
    '0030.png',
    '0031.png',
    '0033.png',
    '0034.png',
    '0035.png',
    '0036.png',
    '0037.png',
    '0038.png',
    '0039.png',
    '0040.png',
    '0041.png',
    '0042.png',
    '0043.png',
    '0044.png',
    '0045.png',
    '0046.png',
    '0047.png',
    '0049.png',
    '0050.png',
    '0051.png',
    '0052.png',
    '0053.png',
    '0054.png',
    '0055.png',
    '0056.png',
    '0057.png',
    '0058.png',
    '0059.png',
    '0060.png',
    '0061.png',
    '0062.png',
    '0063.png',
    '0064.png',
    '0065.png',
    '0066.png',
    '0067.png',
    '0068.png',
    '0069.png',
    '0070.png',
    '0071.png',
    '0072.png',
    '0073.png',
    '0074.png',
    '0075.png',
    '0076.png',
    '0077.png',
    '0078.png',
    '0079.png',
    '0080.png',
    '0081.png',
    '0082.png',
    '0083.png',
    '0084.png',
    '0086.png',
    '0088.png',
    '0089.png',
    '0090.png',
    'black_ninja.png',
    'ChickenDinner.png',
    'Cyber.png',
    'cyberking.png',
    'cybersneak.png',
    'IMG_1412.jpg',
    'profikle.jfif',
    'smart.png',
    'Sneak2.png',
    'statue1.png',
    'Whiteangel.png',
];

enum Directions {
    North,
    East,
    South,
    West,
}

const rotations = [Directions.North, Directions.East, Directions.South, Directions.West];

function GetRandomNumbersFromImgs(maxNum: number) {
    const numbers = Array.from({ length: maxNum }, (_, i) => i); // create an array of numbers from 1 to maxNum
    const selectedNumbers = [];

    while (selectedNumbers.length < 6 && numbers.length > 0) {
        // select 6 unique numbers or until all numbers have been selected
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const randomNumber = numbers[randomIndex];
        selectedNumbers.push(randomNumber);
        numbers.splice(randomIndex, 1); // remove selected number from array
    }

    return selectedNumbers;
}

export default function App() {
    const trailCount = useRef(0);
    const isCovered = useRef(false);
    const [randomImgNum, setRandomImgNum] = useState([0, 1, 2, 3, 4, 5]);
    const [randomImgNum2, setRandomImgNum2] = useState([6, 7, 8, 9, 10, 11]);

    const [randoDirs, setRandoDirs] = useState([
        rotations[Math.floor(Math.random() * rotations.length)],
        rotations[Math.floor(Math.random() * rotations.length)],
        rotations[Math.floor(Math.random() * rotations.length)],
        rotations[Math.floor(Math.random() * rotations.length)],
        rotations[Math.floor(Math.random() * rotations.length)],
        rotations[Math.floor(Math.random() * rotations.length)],
    ]);

    const [trail, api] = useTrail(randomImgNum.length, i => ({
        clipPathN: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        clipPathS: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        clipPathE: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
        clipPathW: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        value: 0,
        onStart: () => {
            trailCount.current = 0;
        },
        onRest: () => {
            trailCount.current++;
            if (trailCount.current === randomImgNum.length - 1) {
                if (!isCovered.current) {
                    setTimeout(() => {
                        HandleClick();
                    }, 3000);
                } else {
                    HandleClick();
                }
            }
        },
    }));

    function HandleClick() {
        var newRandRots = [];
        for (let i = 0; i < randoDirs.length; i++) {
            newRandRots.push(rotations[Math.floor(Math.random() * rotations.length)]);
        }
        setRandoDirs(newRandRots);

        if (isCovered.current) {
            api.start({
                clipPathN: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                clipPathS: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                clipPathE: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                clipPathW: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                value: 100,
            });

            setRandomImgNum(GetRandomNumbersFromImgs(front.length));
            isCovered.current = false;
        } else {
            api.start({
                clipPathN: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                clipPathS: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                clipPathE: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                clipPathW: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                value: 0,
            });
            setRandomImgNum2(GetRandomNumbersFromImgs(front.length));
            isCovered.current = true;
        }
    }

    function SetDir(dir: Directions, clipPaths: SpringValue[]) {
        switch (dir) {
            case Directions.North:
                return clipPaths[0];
            case Directions.South:
                return clipPaths[1];
            case Directions.East:
                return clipPaths[2];
            case Directions.West:
                return clipPaths[3];

            default:
                return clipPaths[0];
        }
    }

    useEffect(() => {
        HandleClick();
    }, []);

    return (
        <AppContainer>
            <Container>
                {trail.map(({ clipPathN, clipPathS, clipPathE, clipPathW, value }, i) => (
                    <Box key={i}>
                        <FrontBox key={i + 'f'}>
                            <ImgContainer
                                style={{
                                    backgroundImage: `url(${require('../../Assets/images/profiles/' +
                                        front[randomImgNum[i]])})`,
                                }}
                            >
                                <BoxInsetShadow />
                                <Cover
                                    style={{
                                        backgroundImage: `url(${require('../../Assets/images/profiles/' +
                                            front[randomImgNum2[i]])})`,
                                        clipPath: SetDir(randoDirs[i], [
                                            clipPathN,
                                            clipPathS,
                                            clipPathE,
                                            clipPathW,
                                        ]),
                                    }}
                                />
                            </ImgContainer>
                        </FrontBox>
                    </Box>
                ))}
            </Container>
        </AppContainer>
    );
}
