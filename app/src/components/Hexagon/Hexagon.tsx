import React from 'react'
import styled from 'styled-components'
import palette from 'src/styles/Palette.module.scss'

export default function Hexagon({
    width = '80px',
    borderWidth = '4px',
    backgroundColor = palette.background,
    borderColor = palette.light,
    color = palette.light,
    text = 'C',
} : {
    width?: string
    borderWidth?: string
    backgroundColor?: string
    borderColor?: string
    color?: string
    text?: string
}) {

    // 0.5774: This is a constant that shows the height-to-width ratio of a hexagon, based on the formula sqrt(3)/2.
    // 0.2887: This is a constant that indicates a positional offset representing a sixth of the hexagon side, helping to position the vertices accurately.
    const HexagonComponent = styled.div`
        width: ${width};
        height: calc(${width} * 0.5774);
        background-color: ${backgroundColor};
        position: relative;
        margin: calc(${width} * 0.2887) 0;
        padding: 0;
        pointer-events: none;

        &:before,
        &:after {
            content: "";
            position: absolute;
            width: 0;
            border-left: calc(${width} / 2) solid transparent;
            border-right: calc(${width} / 2) solid transparent;
        }

        &:before {
            bottom: 100%;
            border-bottom: calc(${width} * 0.2887) solid ${backgroundColor};
        }

        &:after {
            top: 100%;
            border-top: calc(${width} * 0.2887) solid ${backgroundColor};
        }
    `;

    const HexagonWrapper = styled.div`
        display: inline-block;
        padding: ${borderWidth};
        background-color: ${borderColor};
        clip-path: polygon(
            50% 0%, 
            100% 25%, 
            100% 75%, 
            50% 100%, 
            0% 75%, 
            0% 25%
        );
    `;

    const Text = styled.div`
        color: black;
        font-size: calc(0.5 * ${width});
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        color: ${color};
    `;

    return (
        <HexagonWrapper>
            <HexagonComponent>
                <Text> {text} </Text>
            </HexagonComponent>
        </HexagonWrapper>
    );
}
