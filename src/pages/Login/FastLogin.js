// import useLogin from "../services/useLogin";
import {useEffect, useState} from 'react';
import SpatialNavigation from 'spatial-navigation-js'
import useInterval from '../../lib/hooks/useInterval';
import Loader from '../../components/Loader/Loader';
import randomString from '@jitesoft/random-string';
import QRCode from 'qrcode.react';
import { useNavigate, useOutletContext } from "react-router-dom";

import styles from './FastLogin.module.css';
import jwt_decode from 'jwt-decode';

const LOGIN_URL = process.env.REACT_APP_BASE_AUTH_URL;
const REGISTER_DEVICE_URL = process.env.REACT_APP_REGISTER_DEVICE_ENDPOINT;
const CHECK_DEVICE_URL = process.env.REACT_APP_CHECK_DEVICE_ENDPOINT;

const Login = () => {
    const navigate = useNavigate();
    const [ accessCode, setAccessCode ] = useState('');
    const [ registered, setRegistered ] = useState(false);
    const [ associated, setAssociated ] = useState(false);
    const [user, setUser] = useOutletContext();

    const handleExitButton = (event) => {
        if ( event.keyCode === 10182 ) { //EXIT
            console.log(`%cGoodbye`, `color: deeppink`);
            window.tizen.application.getCurrentApplication().exit();
        }
    };
    
    const handleLogin = (event) => {
        navigate('email/');
    };
    const handleFocus = (event) => {
        event.target.classList.add(styles.focus);
    };
    
    const handleBlur = (event) => {
        event.target.classList.remove(styles.focus);
    };

    useInterval(() => {
        if ( registered && !associated ) {
            checkDevice(accessCode);
        }
    }, 5 * 1000);

    const registerDevice = async(accessCode) => {
        const data = new URLSearchParams({
            'code': accessCode,
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        };
        const response = await fetch(`${ LOGIN_URL }${ REGISTER_DEVICE_URL }`,
            requestOptions);
        const json = await response.json();

        if (json.response === 'success') {
            setRegistered(true);
        }
    };
    const checkDevice = async (accessCode) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'code=' + accessCode,
        };
        const response = await fetch(`${LOGIN_URL}${CHECK_DEVICE_URL}`,
            requestOptions);
        const json = await response.json();
        if (json.response !== 'error') {
            setAssociated(true);
            setUser(jwt_decode(json.token.access_token));
            localStorage.setItem('access_token', json.token.access_token);
            localStorage.setItem('refresh_token', json.token.refresh_token);
            localStorage.setItem('user',
                JSON.stringify(jwt_decode(json.token.access_token)));
            navigate('/home');
        }
    };

 
    
    useEffect(() => {
        if ( localStorage.getItem('access_code') ) {
            setAccessCode(localStorage.getItem('access_code'));
        } else {
            let retrievedCode = randomString(6, {special: false}).toUpperCase();
            setAccessCode(retrievedCode);
            localStorage.setItem('access_code', retrievedCode);
        }
    }, []);
    
    useEffect(() => {
        if ( accessCode !== '' ) {
            registerDevice(accessCode);
        }
    }, [ accessCode ]);
    
    useEffect(() => {
        document.body.addEventListener('keydown', handleExitButton);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleExitButton);
        };
    }, []);
    
    useEffect(()=>{
        SpatialNavigation.init();
        SpatialNavigation.add( 'buttonContainer', {
            selector: `#buttonContainer .focusable`,
            defaultElement: `#buttonContainer .focusable:first-child`,
            enterTo: `last-focused`,
            leaveFor: {up:``, down: ``, left: ``, right: ``}
        })
        SpatialNavigation.makeFocusable();
        SpatialNavigation.focus('buttonContainer')
        return function cleanup( ){
            SpatialNavigation.remove('buttonContainer');
        }
    },[])

    return (
        <div className={ styles.fastLoginContainer }>
            <div className={ styles.leftOption }>
                <div className={ styles.siteLoginOption }>
                    <h2>Accedi tramite il sito</h2>
                    <div className={ styles.linkTVSteps }>
                        <div className={ styles.step }>
                            <div className={ styles.stepNumber }>
                                <p>1</p>
                            </div>
                            <div className={ styles.stepDescription }>
                                <p>Vai al sito</p>
                                <p>https://www.supertennix.it/</p>
                            </div>
                        </div>
                        <div className={ styles.step }>
                            <div className={ styles.stepNumber }>
                                <p>2</p>
                            </div>
                            <div className={ styles.stepDescription }>
                                <p>Nella sezione “Associa TV” inserisci il
                                    codice</p>
                                <p className={ styles.accessCode }>{ accessCode }</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.passwordOption}>
                    <h2>Utilizza e-mail e password</h2>
                    <div id="buttonContainer">
                            <button
                                className={`focusable infoButton ${styles.loginOption}`}
                                onFocus={ handleFocus }
                                onBlur={ handleBlur }
                                onClick={ handleLogin }>
                                    ACCEDI CON EMAIL
                                </button>
                    </div>
                </div>
            </div>
            <div className={ styles.rightOption }>
                <h2>Accedi tramite l'app mobile</h2>
                <div className={ styles.appMobileLogin }>
                    { !accessCode ? (<Loader/>) : (
                    <QRCode
                    className={ styles.qrContainer }
                    value={ accessCode }
                    renderAs="svg"
                    size={ 300 }
                    level="H"
                    />) }
                    <div className={ styles.qrDescription }>
                        <p>QR Code</p>
                        <p>
                            Accedi all’app mobile dal tuo smartphone e, dal
                            menù, clicca
                            “Associa TV” e scansiona il QR code{ ' ' }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;