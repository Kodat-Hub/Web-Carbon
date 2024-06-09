import React from 'react'
import styled from 'styled-components'
import palette from 'src/styles/Palette.module.scss'
import { makeBond, getTransposedGrid } from '../../CarbonLogic'

const Line = styled.div`
        width: 70%;
        height: 4px;

        background-color: ${palette.primary};
    `

const LineWrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* gap: 16px; */

    justify-content: space-around;
    align-items: center;

    width: 88px;
    height: 44px;
    z-index: 2;

    &:hover {
        cursor: pointer;
        background-color: #ffffff10;
    }
`

const NewBond = styled.div`
    transform: none;
    font-size: 32px;
    color: ${palette.secondary};
`

export default function Bond({
    type,
    id,
    dataGrid,
    setDataGrid
} : {
    type: number
    id: string
    dataGrid: string[][]
    setDataGrid: React.Dispatch<React.SetStateAction<string[][]>>
}) {

    const handleClick = () => {
        let [ yIndex, xIndex ] = id.split('.').map(axis => Number(axis));

        // Get the next number of bonds
        let numOfBonds = type;

        if(numOfBonds === 3) {
            numOfBonds = 1
        } else {
            numOfBonds++
        }

        //Get the bonded element index
        const elementA = {x: 0, y: 0};
        const elementB = {x: 0, y: 0};
        if (yIndex % 2 === 0) {
            Object.assign(elementA, { x: xIndex - 1, y: yIndex });
            Object.assign(elementB, { x: xIndex + 1, y: yIndex });
        } else {
            Object.assign(elementA, { x: xIndex - 1, y: yIndex - 1 });
            Object.assign(elementB, { x: xIndex + 1, y: yIndex + 1 });
        }

        const newGrid = makeBond(
            getTransposedGrid(dataGrid), 
            elementA.x, 
            elementA.y, 

            elementB.x, 
            elementB.y, 
            numOfBonds
        );

        setDataGrid(newGrid);
    }
    
    return (
        <>
            <LineWrapper onClick={handleClick}>
                {type === 0 && <NewBond>+</NewBond>}
                {type >= 1 && <Line />}
                {type > 1 && <Line />}
                {type > 2 && <Line />}
            </LineWrapper>
        </>
    );
}
