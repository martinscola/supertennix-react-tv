import { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import useInterval from '../../lib/hooks/useInterval';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../services/user.service';

const TokensContext = createContext();

TokensContext.displayName = 'TokensContext';

export const TokensProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialTokens = {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
        user: localStorage.getItem('user'),
    };
    const [ tokens, setTokens ] = useState(initialTokens);

    const removeTokens = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastSearch');
        setTokens({});
    };

    const addTokens = () => {
        setTokens({
            access_token: localStorage.getItem('access_token'),
            refresh_token: localStorage.getItem('refresh_token'),
            user: localStorage.getItem('user'),
        });
    };

    const value = {tokens, removeTokens, addTokens};

    useEffect(() => {
        if ( tokens.access_token ) {
            setTokens({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                user: jwt_decode(tokens.access_token),
            });

        }
    }, [ location.pathname ]);

    useEffect(() => {
        if (
            localStorage.getItem('access_token') !== tokens.access_token &&
            tokens.access_token !== '' && tokens.access_token
        ) {
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('refresh_token', tokens.refresh_token);
            localStorage.setItem('user', tokens.user);
            setTokens({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                user: tokens.access_token,
            });
        }
    }, []);

    useInterval(() => {
        // console.log(tokens.refresh_token);
        if ( tokens.refresh_token ) {
            const token = tokens.refresh_token;
            sessionRefresh(token, tokens.user.user_id);
        }
    }, 10 * 60 * 1000);

    const sessionRefresh = async(token, user_id) => {
        const data = new URLSearchParams({'token': token});
        await userService.sessionRefresh(data, user_id)
        .then((res) => {
            // console.log(res);
            if ( res.response && res.response === 'KO' ) {
                removeTokens();
                navigate('/login');
            } else {
                setTokens({
                    access_token: res.token.access_token,
                    refresh_token: res.token.refresh_token,
                    user: tokens.user,
                });
            }
        });
    };

    return (
        <TokensContext.Provider value={ value }>
            { children }
        </TokensContext.Provider>
    );
};

export function useTokensContext() {
  const context = useContext(TokensContext);
  if (!context) {
    throw new Error(
      "useTokensContext must be used under <TokensContextProvider/>"
    );
  }
  return context;
}
