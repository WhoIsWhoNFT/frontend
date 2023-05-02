import { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTrail, animated, useSprings, useSpringRef } from '@react-spring/web';

const Grills = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 0.8rem);
    justify-content: right;
    align-items: center;
    margin: 0 1rem 0 0;
`;

const Parallelogram = styled(animated.div)`
    height: 3rem;
    width: 2rem;
    background-color: #000000;
    clip-path: polygon(80% 0, 100% 0, 20% 100%, 0% 100%);
    flex: 0 0 40px;
`;

const GRILLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function App() {
    const isThicc = useRef(false);
    const [grills, setGrills] = useState(GRILLS);
    const [isScreen450, setIsScreen450] = useState(false);

    const [springs, api] = useTrail(grills.length, i => ({
        clipPath: 'polygon(80% 0, 100% 0, 20% 100%, 0% 100%)',
        config: { duration: 100 },
    }));

    const handleResize = () => {
        setIsScreen450(window.innerWidth < 450);
    };

    const handleClick = () => {
        if (isThicc.current) {
            api.start({
                clipPath: 'polygon(70% 0, 100% 0, 30% 100%, 0% 100%)',
            });
            isThicc.current = false;
        } else {
            api.start({
                clipPath: 'polygon(80% 0, 100% 0, 20% 100%, 0% 100%)',
            });
            isThicc.current = true;
        }
    };

    useMemo(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const t = setInterval(() => handleClick(), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (isScreen450) {
            setGrills([1, 2, 3, 4, 5, 6]);
        } else {
            setGrills(GRILLS);
        }
    }, [isScreen450]);

    return (
        <>
            <Grills>
                {springs.map((styles, i) => {
                    return <Parallelogram key={i} style={styles} />;
                })}
            </Grills>
        </>
    );
}
