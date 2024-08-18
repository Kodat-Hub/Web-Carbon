import { useEffect, useState } from 'react';
import Hexagon from '../Hexagon/Hexagon';
import { GridComponent, GridCell, EmptyCell } from './GridStyledComponents';
import Bond from '../Bond/Bond';
import palette from 'src/styles/Palette.module.scss';

import { deselectElementCell, getCompoundName, getTransposedGrid } from './../../CarbonLogic.ts'
import styled from 'styled-components';

const CompoundName = styled.div`
    width: 100vw;
    height: 15vh;

    display: flex;
    flex-direction: column;

    align-content: center;
    
    position: relative;
    top: 16px;

    h1 {
        font-size: 32px;
        text-align: center;
    }

    button {
        background-color: ${palette.light};
        border: 2px solid ${palette.secondary};
        color: ${palette.dark};
        border-radius: 5px;
        padding: 5px 8px;
        margin: 0 auto;

        &:hover {
            cursor: pointer;
        }
    }
`

const CompoundContainer = styled.div`
    display: flex;

    width: calc(100vw - 48px);
    min-height: 100vh;
    height: fit-content;

    position: absolute;
    left: 0;
    top: 0vh;

    justify-content: center;
    align-items: center;
    /*overflow: scroll;*/
`

export default function Grid () {

    const [ compoundName, setCompoundName ] = useState('create your element');
    const [ dataGrid, setDataGrid ] = useState([[ '*' ]]);
    const [ dataGridTransposed, setDataGridTransposed ] = useState([[ '*' ]]);

    useEffect(() => {
        setDataGridTransposed(getTransposedGrid(dataGrid))
    }, [dataGrid])

    return (
        <>
            {/*<CompoundName>
                <h1>{compoundName.charAt(0).toUpperCase() + compoundName.slice(1)}</h1>
                <button onClick={async () => setCompoundName(await getCompoundName(dataGridTransposed))}>NOMINATE</button>
            </CompoundName>*/}

            <CompoundContainer>
                <GridComponent length={dataGrid[0].length}>
                    {dataGrid.map((row, rowIndex) => {
                        const offset = (rowIndex % 4 != 2);
                        return (
                            
                            row.map((cell, colIndex) => {
                                const isBond = [-3, -2, -1, 0, 1, 2, 3].includes(parseInt(cell));
                                const isEmpty = ['', ' ', '.'].includes(cell);
                                const reverseRotateBond = isBond && parseInt(cell) < 0;
                                const noRotateBond = isBond && parseInt(cell) === 0;
                                return (
                                    <GridCell
                                        key={colIndex}
                                        className={`
                                            ${rowIndex % 2 === 0 ? 'even' : 'odd'}
                                            ${offset ? 'offset' : ''}
                                            ${isBond ? 'bond' : ''}
                                            ${reverseRotateBond ? 'reverse' : ''}
                                            ${noRotateBond ? 'no-rotate' : ''}
                                        `}
                                        onClick={isEmpty ? () => setDataGrid(deselectElementCell(dataGridTransposed)) : () => {return}}
                                    >
                                        {
                                            // Bond
                                            isBond && <Bond id={`${rowIndex}.${colIndex}`} type={Math.abs((parseInt(cell)))} dataGrid={dataGrid} setDataGrid={setDataGrid}/>

                                            // Empty space
                                            || isEmpty && <EmptyCell />

                                            // Placeholder
                                            || cell === '*' && <Hexagon id={`${rowIndex}.${colIndex}`} text='+' dataGrid={dataGrid} setDataGrid={setDataGrid} backgroundColor={palette.background} borderColor={palette.secondary} color={palette.secondary}/>

                                            // Element
                                            || <Hexagon id={`${rowIndex}.${colIndex}`} text={cell} dataGrid={dataGrid} setDataGrid={setDataGrid} />
                                        }
                                        
                                    </GridCell>
                            )})
                        );
                    })}
                </GridComponent>
            </CompoundContainer>
        </>
    );
};
