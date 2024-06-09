import { useState } from 'react'
import styled from 'styled-components'

import Grid from './components/Grid/Grid'

const data = [
    ['.',  '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.',  '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.',  '.', 'C', '.', 'C', '1', 'C', '.', 'C', '.', '.'],
    ['.',  '.', '.', '-1', '.', '2', '.', '1', '.', '.', '.'],
    ['.',  '.', '.', '.', 'C', '1', 'C', '.', '.', '.', '*'],
    ['.',  '.', '.', '.', '.', '1', '.', '-1', '.', '.', '.'],
    ['.',  '.', 'C', '3', 'C', '.', '*', '.', 'C', '.', '*'],
    ['.',  '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.',  '.', '.', '.', '.', '.', '*', '.', '.', '.', '*'],
]

function App() {

    const FullCenter = styled.div`
        position: absolute;
        top: 0;
        left: 0;

        display: flex;

        width: 100vw;
        height: 100vh;

        justify-content: center;
        align-items: center;
    `

    return (
        <>
            <FullCenter>
                <Grid data={data}/>
            </FullCenter>
        </>
    )
}

export default App
