import {Navigate} from 'react-router-dom';
import React from 'react';

const AuthContext = (props) => {

    return localStorage.getItem("access_token") ? <>{props.children}</> : <Navigate to={"/login"} />;

};
    export  default AuthContext
