import React from 'react';
import Hexagon from '../Hexagon/Hexagon';
import styles from './Grid.module.scss'
import { GridComponent, GridCell, EmptyCell } from './GridStyledComponents';
import Bond from '../Bond/Bond';

export default function Grid ({ 
    data 
} : {
    data: string[][]
}) {

    return (
        <GridComponent length={data[0].length}>
            {data.map((row, rowIndex) => {
                const offset = (rowIndex % 4 != 2);
                const reverseRotateLine = (rowIndex % 4 == 1);
                return (
                    row.map((cell, colIndex) => {
                        const isBond = [-3, -2, -1, 1, 2, 3].includes(parseInt(cell));
                        const reverseRotateBond = isBond && parseInt(cell) < 0;
                        return (
                            <GridCell
                                key={colIndex}
                                className={`
                                    ${rowIndex % 2 === 0 ? 'even' : 'odd'}
                                    ${offset ? 'offset' : ''}
                                    ${isBond ? 'bond' : ''}
                                    ${reverseRotateBond ? 'reverse' : ''}
                                    ${reverseRotateLine ? 'reverse-rotate-line' : ''}
                                `}
                            >
                                {cell === 'C' && <Hexagon text='C' />}
                                {isBond && <Bond type={Math.abs((parseInt(cell)))}/>}
                                {['.', '*'].includes(cell) && <EmptyCell />}
                            </GridCell>
                    )})
                );
            })}
        </GridComponent>
    );
};
