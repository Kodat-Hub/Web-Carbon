import styled from 'styled-components';

type HexagonWrapperProps = {
  $borderWidth: string;
  $borderColor: string;
};

type HexagonComponentProps = {
  $width: string;
  $backgroundColor: string;
};

type TextProps = {
  $width: string;
  $color: string;
};

export const HexagonWrapper = styled.div<HexagonWrapperProps>`
  display: inline-block;
  cursor: pointer;
  padding: ${({ $borderWidth }) => $borderWidth};
  background-color: ${({ $borderColor }) => $borderColor};
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
`;

export const HexagonComponent = styled.div<HexagonComponentProps>`
  width: ${({ $width }) => $width};
  height: calc(${({ $width }) => $width} * 0.5774);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  position: relative;
  margin: calc(${({ $width }) => $width} * 0.2887) 0;
  padding: 0;
  pointer-events: none;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: calc(${({ $width }) => $width} / 2) solid transparent;
    border-right: calc(${({ $width }) => $width} / 2) solid transparent;
  }

  &:before {
    bottom: 100%;
    border-bottom: calc(${({ $width }) => $width} * 0.2887) solid ${({ $backgroundColor }) => $backgroundColor};
  }

  &:after {
    top: 100%;
    border-top: calc(${({ $width }) => $width} * 0.2887) solid ${({ $backgroundColor }) => $backgroundColor};
  }
`;

export const Text = styled.div<TextProps>`
  color: ${({ $color }) => $color};
  font-size: calc(0.5 * ${({ $width }) => $width});
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;
