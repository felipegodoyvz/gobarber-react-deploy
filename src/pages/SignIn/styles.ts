import styled, { keyframes } from "styled-components";
import { shade } from "polished";

import signInBackground from "../../assets/sign-in-background.png";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  width: 100%;
  max-width: 700px;
  max-height: 100vh;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    margin: auto;


    h1 {
        margin-bottom: 24px;
      }



    a {
        color: #8a8d90;
        display: block;
        margin-top: 24px;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: ${shade(0.2, '#8a8d90')};
        }
    }
  }

  > a{
    color: #8a8d90;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-itens: center;

    svg {
        margin-right: 16px;
      }

      &:hover {
        color: ${shade(0.2, '#8a8d90')};
      }
  }
`;


const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${appearFromLeft} 0.7s;
  form {
    margin: 80px 0;
    width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      margin-bottom: 24px;
    }
    a {
      color: #666360;
      margin-top: 24px;
      transition: color 0.2s;
      &:hover {
        color: #666360;
      }
    }
  }
  > a {
    color: #ff9000;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    &:hover {
      color: #ff9000;
    }
    svg {
      margin-right: 8px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackground}) no-repeat center;
  background-size: cover;
`;
