import React, { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  }

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
    <Container type="button" {... rest}>
        {loading ? 'Carregando...' : children}
    </Container>
);

export default Button;

/*
import React, { ButtonHTMLAttributes } from "react";

import Spinner from "../Spinner";

import { Container } from "./styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => {
  return (
    <Container type="button" {...rest}>
      {loading ? <Spinner /> : children}
    </Container>
  );
};

export default Button;
*/
