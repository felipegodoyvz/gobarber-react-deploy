import React, { createContext, useCallback, useState, useContext } from "react";
import api from '../services/api';

interface User {
    id: string;
    avatar_url: string;
    name: string;
    email: string;
  }

interface AuthState{
    token: string;
    user: User;
}

interface SignInCredetials {
    email: string;
    password: string;
};

interface AuthContextData {
    user: User;
    signIn(credentials: SignInCredetials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
};

interface Props {
    children: React.ReactNode;
    };

const AuthContext = createContext<AuthContextData>(
    {} as AuthContextData,
    );

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@Gobarber: token');
        const user = localStorage.getItem('@Gobarber: user');

        if(token && user){
            api.defaults.headers.common['authorization'] = `Bearer ${token}`;
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });

    const signIn = useCallback(async ( {email, password}: {email: string, password: string} ) => {
        const response = await api.post('sessions', {
            email,
            password,
        });

       const { token, user } = response.data;

       localStorage.setItem('@GoBarber:token', token);
       localStorage.setItem('@GoBarber:user', JSON.stringify(user));

       api.defaults.headers.common['authorization'] = `Bearer ${token}`;

       setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@Gobarber: token');
        localStorage.removeItem('@Gobarber: user');

        setData({} as AuthState)
    }, []);

    const updateUser = useCallback(
        (user: User) => {
        setData({
            token: data.token,
            user,
        });
    },
    [setData, data.token]
    );


    return(
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData{
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export {  AuthProvider, useAuth };


/*
Skip to content
Product
Solutions
Open Source
Pricing
Search
Sign in
Sign up
MatheusPires99
/
gobarber-2.0
Public
Code
Issues
1
Pull requests
52
Actions
Projects
Security
Insights
gobarber-2.0/frontend/src/hooks/auth.tsx /
@MatheusPires99
MatheusPires99 Finishing hooks test
Latest commit 51680bf on 28 Jun 2020
 History
 1 contributor
96 lines (74 sloc)  2.03 KB

import React, { createContext, useCallback, useState, useContext } from "react";

import api from "../services/api";

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface SignInCredencials {
  email: string;
  password: string;
}

interface AuthState {
  user: User;
  token: string;
}

interface AuthContextData {
  user: User;
  signIn(credencials: SignInCredencials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GoBarber:token");
    const user = localStorage.getItem("@GoBarber:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("sessions", {
      email,
      password,
    });

    const { user, token } = response.data;

    localStorage.setItem("@GoBarber:token", token);
    localStorage.setItem("@GoBarber:user", JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({
      user,
      token,
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@GoBarber:token");
    localStorage.removeItem("@GoBarber:user");

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem("@GoBarber:user", JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
*/
