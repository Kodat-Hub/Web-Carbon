import React from 'react'
import styled from 'styled-components'
import palette from 'src/styles/Palette.module.scss'

export default function Bond({
    type
} : {
    type: number
}) {

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
    
    return (
        <>
            <LineWrapper>
                {type >= 1 && <Line />}
                {type > 1 && <Line />}
                {type > 2 && <Line />}
            </LineWrapper>
        </>
    );
}
