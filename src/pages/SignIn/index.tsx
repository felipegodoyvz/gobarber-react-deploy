import React, { useRef, useCallback } from "react";
//import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import {  FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
//import { Link, useHistory } from "react-router-dom";
import { useHistory } from "react-router-dom";


import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import logoImg from "../../assets/login_logo.png";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface SignInFormData{
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);


  /*const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  */

    const { signIn } = useAuth();

    const { addToast } = useToast();

    const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email("Digite um e-mail válido")
            .required("E-mail obrigatório"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        /*setLoading(true);

        await signIn({
          email: data.email,
          password: data.password,
        });

        setLoading(false);

        */

        await signIn({
            email: data.email,
            password: data.password,
        });

        history.push("/dashboard");
    } catch (err) {
        //setLoading(false);

        alert("Ocorreu um erro ao fazer login, cheque as credenciais");

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais",
        });



      }
    },
    [signIn ,addToast, history],
  );

    return(
    <Container>
        <Content>
        <AnimationContainer>
        <img src={logoImg} alt="Manager PDV" />

            <Form ref={formRef} onSubmit={ handleSubmit }>
            <h1>Faça seu logon</h1>
            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>

            {/*<Link to="/forgot-password">Esqueci minha senha</Link>*/}
            {/*<Link to="/signup"><FiLogIn />Criar conta</Link>*/}
            </Form>
        </AnimationContainer>
        </Content>

        <Background />
    </Container>
    );
    }
export default SignIn;



/*import React, { useRef, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErrors";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email("Digite um e-mail válido")
            .required("E-mail obrigatório"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        await signIn({
          email: data.email,
          password: data.password,
        });

        setLoading(false);

        history.push("/dashboard");
      } catch (err) {
        setLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais",
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button loading={loading} type="submit">
              Entrar
            </Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>

          <Link to="signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
*/
