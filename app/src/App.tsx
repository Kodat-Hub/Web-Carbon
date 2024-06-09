import { useState } from 'react'
import styled from 'styled-components'

import Grid from './components/Grid/Grid'

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
                <Grid />
            </FullCenter>
        </>
    )
}

export default App
