import React from 'react';
import palette from 'src/styles/Palette.module.scss'
import { HexagonWrapper, HexagonComponent, Text } from './HexagonStyledComponents.ts';
import { addElementCell, selectElementCell, getTransposedGrid } from './../../CarbonLogic.ts';

type HexagonProps = {
  width?: string;
  borderWidth?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  text?: string | JSX.Element;
  id: string;
  dataGrid: string[][];
  setDataGrid: React.Dispatch<React.SetStateAction<string[][]>>;
};

export default function Hexagon({
  width = '80px',
  borderWidth = '4px',
  backgroundColor = palette.background,
  borderColor = palette.light,
  color = palette.light,
  text = '',
  id,
  dataGrid,
  setDataGrid,
}: HexagonProps) {

  const handleClick = () => {
    const [yIndex, xIndex] = id.split('.').map(Number);
    const transposedGrid = getTransposedGrid(dataGrid);

    console.log(xIndex, yIndex)

    const newGrid = text === '+'
      ? addElementCell(transposedGrid, 'C', xIndex, yIndex)
      : selectElementCell(transposedGrid, xIndex, yIndex);

    setDataGrid((prevGrid) => newGrid);
  };

  return (
    <HexagonWrapper $borderWidth={borderWidth} $borderColor={borderColor} onClick={handleClick}>
      <HexagonComponent $width={width} $backgroundColor={backgroundColor}>
        <Text $width={width} $color={color}>{text}</Text>
      </HexagonComponent>
    </HexagonWrapper>
  );
}
