import styled from 'styled-components';

interface GridProps {
    length: number;
}

export const EmptyCell = styled.div`
    width: 88px;
    height: 44px;
    z-index: 2;
`;

export const GridCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid red; */
`;

export const GridComponent = styled.div<GridProps>`
    display: grid;
    align-items: center;
    grid-template-columns: repeat(${props => props.length}, auto);
    padding: 48px;

    ${EmptyCell} { transform: translateX(0); }

    .odd {
        z-index: 1;
        // background-color: red;
        // border: 1px solid blue;
    }
    
    // .offset { transform: translateX(88px); }

    .odd.bond         { transform: rotate(-45deg); }
    .odd.bond.reverse { transform: rotate( 45deg); }

    .no-display: {
        display: none;
    }
`;
