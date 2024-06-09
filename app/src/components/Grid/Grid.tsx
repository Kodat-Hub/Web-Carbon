import React from 'react';
import Hexagon from '../Hexagon/Hexagon';
import styles from './Grid.module.scss'
import { GridComponent, GridCell, EmptyCell } from './GridStyledComponents';
import Bond from '../Bond/Bond';
import palette from 'src/styles/Palette.module.scss';

export default function Grid ({ 
    data 
} : {
    data: string[][]
}) {

    return (
        <GridComponent length={data[0].length}>
            {data.map((row, rowIndex) => {
                const offset = (rowIndex % 4 != 2);
                return (
                    row.map((cell, colIndex) => {
                        const isBond = [-3, -2, -1, 0, 1, 2, 3].includes(parseInt(cell));
                        const reverseRotateBond = isBond && parseInt(cell) < 0;
                        return (
                            <GridCell
                                key={colIndex}
                                className={`
                                    ${rowIndex % 2 === 0 ? 'even' : 'odd'}
                                    ${offset ? 'offset' : ''}
                                    ${isBond ? 'bond' : ''}
                                    ${reverseRotateBond ? 'reverse' : ''}
                                `}
                            >
                                {
                                    // Bond
                                    isBond && <Bond type={Math.abs((parseInt(cell)))}/>

                                    // Empty space
                                    ||  ['', ' ', '.'].includes(cell) && <EmptyCell />

                                    // Placeholder
                                    || cell === '*' && <Hexagon text='+' backgroundColor={palette.background} borderColor={palette.secondary} color={palette.secondary}/>

                                    // Element
                                    || <Hexagon text={cell} />
                                }
                                
                            </GridCell>
                    )})
                );
            })}
        </GridComponent>
    );
};
