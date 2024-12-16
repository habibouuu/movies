'use client';

import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import util from 'api/user'
// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';


// types
import { JWTContextType } from 'types/auth';
import { InitialLoginContextProps } from 'types';

const chance = new Chance();

// constant
const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};


const setSession = (serviceToken?: string | null) => {
  // const TIMESTAMP = Date.now();
  
  if (serviceToken) {
    localStorage.setItem('serviceToken', JSON.stringify({
      serviceToken: serviceToken,
      // expiresOn: TIMESTAMP + 1000*3600 //in milliseconds
    }));
    
    // axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    
    const init = async () => {
      try {
        // const ex = window.localStorage.getItem('serviceToken')
        
  //       let EXPIRE_DATE
  //       if(ex) EXPIRE_DATE = JSON.parse(ex).expiresOn;

  // if (Date.now() > EXPIRE_DATE) {
  //   
  //   localStorage.removeItem('serviceToken');
  // } 
        // let serviceToken 
        // if(ex) serviceToken = JSON.parse(ex).serviceToken;
       const session:any = await util.getSession();
       
        if (session.access_token ) {
          setSession(session.access_token);
          const response = await util.getUser();
          
          const user  = response;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async(email: string, password: string) => {

  
    
          const response = await util.login( email, password );
        
        if (response) {
          const { session, user } = response;
        if(session) setSession(session.access_token);
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });
        return true
        }else{
          return false
        }
      }
  ;

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response :any= await util.signup(
      email,
      password,
      firstName,
      lastName
    );
    let users:any = [];
    if(response){
      setSession(response.session)
      if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers!),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }
    return true
    }else{
      return false
    }
   


    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    (async ()=>{
      await util.logout();
    })();
    setSession(null);
    
    
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
