import { useState } from 'react'
import Hexagon from './components/Hexagon/Hexagon'

function App() {

    return (
        <>
            <Hexagon 
                width='160px'
                backgroundColor='white'
                borderColor='red'
                borderWidth='3px'
                text='C'
            />
        </>
    )
}

export default App
