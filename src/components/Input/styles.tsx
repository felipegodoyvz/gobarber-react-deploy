import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #fff;
  color: #666360;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      color: #8bc118;
      border-color: #8bc118;
    `}
  ${(props) =>
    props.isFilled &&
    css`
      color: #8bc118;
    `}
  & + div {
    margin-top: 8px;
  }
  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #444648;
    &::placeholder {
      color: #666360;
    }
  }
  svg {
    margin-right: 16px;
  }
`;

//export const Error = styled.a`
export const Error = styled(Tooltip)`
  height: 20px;
  svg {
    margin: 0px;
  }
  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
