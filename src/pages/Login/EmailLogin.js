import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from './EmailLogin.module.css';
import SpatialNavigation from 'spatial-navigation-js'
import { userService } from '../../lib/services/user.service';
import jwt_decode from 'jwt-decode';
import {
    useTokensContext,
} from '../../lib/context/tokens-context';

const EmailLogin = () => {
    const [ error, setError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [user, setUser] = useOutletContext();
    const {addTokens} = useTokensContext();
    const navigate = useNavigate();

    /**
     * handles the Back Button Event for Remote Controls
     * @param event
     */
    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) {
            console.log(`Email Login Back`);
            navigate(-1);
        }
    };

    /**
     *
     * Calls the login Service and if successful,
     * sets access_token, refresh_token and user into LocalStorage
     *
     *
     */
    const handleSubmit = () => {
        setError(false);
        userService.login(username, password).then((response) => {
            if ( response.response !== 'KO' ) {
                localStorage.setItem('access_token',
                    response.token.access_token);
                localStorage.setItem('refresh_token',
                    response.token.refresh_token);
                localStorage.setItem('user',
                    JSON.stringify(jwt_decode(response.token.access_token)));
                sessionStorage.setItem('profile', JSON.stringify(jwt_decode(response.token.access_token)));
                addTokens();
                setUser(jwt_decode(response.token.access_token));
                navigate('/home');
            } else {
                setError(true);
                setErrorMessage(`Non è possibile accedere con le credenziali
                                    proviste`);
            }
        });
    };

    /**
     * validates that the username is a valid email
     * @param event
     */
    const handleValidation = (event) => {
        event.preventDefault();
        // console.log(`start validating`);
        // console.log(
        //     `RegEx test: ${ !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(
        //         username)) }`);
        setError(false);
        setErrorMessage('');
        if ( !username || !password ) {
            // console.log(`empty user/pass`);
            setError(true);
            setErrorMessage(
                `I campi e-mail e password non possono essere vuoti`);
        } else if ( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
            username)) ) {
            // console.log(`Bad email`);
            setError(true);
            setErrorMessage(`Devi inserire un e-mail valido`);
        } else {
            handleSubmit(event);
        }
    };

    /**
     *
     * Handles the keyDown Event on the input fields
     * to manage focus between elements
     *
     * @param event
     */
    const handleKeyDown = (event) => {
        console.log(event.key)
        if ( event.key === 'Enter' ){
            if ( username && password ){
                handleValidation(event)
            }
        }
        if ( event.keyCode === 10009 ) {
            SpatialNavigation.resume();
        }
        if ( event.keyCode === 40 || event.keyCode === 38 ) {
            if ( event.keyCode === 40 ) {
                if ( event.target.parentElement.classList.contains(
                    'username') ) {
                    SpatialNavigation.move('down', `.username`);
                    event.target.parentElement.classList.remove(
                        styles.inputFocus);
                } else if ( event.target.parentElement.classList.contains(
                    'password') ) {
                    event.target.parentElement.classList.remove(
                        styles.inputFocus);
                    SpatialNavigation.move('down', `.password`);
                }
            } else if ( event.keyCode === 38 ) {
                if ( event.target.parentElement.classList.contains(
                    'username') ) {
                    event.target.parentElement.classList.remove(
                        styles.inputFocus);
                    SpatialNavigation.move('up', `.username`);
                } else if ( event.target.parentElement.classList.contains(
                    'password') ) {
                    event.target.parentElement.classList.remove(
                        styles.inputFocus);
                    SpatialNavigation.move('up', `.password`);
                }
            }
        }
    };

    const handleUserChange = (event) => {
        setError(false);
        // console.log(`Username: ${ event.target.value }`);
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setError(false);
        // console.log(`Password: ${ event.target.value } `);
        setPassword(event.target.value);
    };

    const handleShowPass = (event) => {
        console.log(event.target)
        event.preventDefault();
        const passBox = document.querySelector(`.${ styles.passwordInput }`);
        if ( passBox.type ===
            'password' ) { passBox.type = 'text';} else {passBox.type = 'password';}
    };

    const handleInputFocus = (event) => {
        event.target.classList.add(styles.inputFocus);
    };

    const handleRecoverPass = () => {
        // console.log('Recover Pass');
        // navigate("/recoverPass");
    };

    const handleInputUnfocus = (event) => {
        event.target.classList.remove(styles.inputFocus);
    };

    const handleButtonFocus = (event) => {
        console.log(event.target)
        event.target.classList.add(styles.focus);
    };

    const handleButtonUnfocus = (event) => {
        event.target.classList.remove(styles.focus);
    };

    useEffect(() => {
        SpatialNavigation.add(`loginForm`,{
            selector: `#loginForm .focusable`
        });
        SpatialNavigation.makeFocusable();
        SpatialNavigation.focus('loginForm');
        return function cleanup( ){
            SpatialNavigation.remove('loginForm');
        }
    }, []);

    /**
     *
     * Add Event Listeners for controlling the user inputs
     */
    useEffect(() => {
        window.addEventListener('keydown', handleBackButton);
        return function RemoveKeydownEventListener() {
            window.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    return (
        <div className={ styles.emailLoginContainer }>
            <div className={ styles.leftContainer }>
                <div className={ styles.titleDescription }>
                    <h2>Accedi con e-mail e password</h2>
                    <p>Se ancora non hai un account, visita il sito
                        www.supertennix.com</p>
                </div>
                <form id={`loginForm`}
                    onSubmit={ handleValidation }
                    className={ styles.loginForm }>
                    <input
                        onFocus={ handleInputFocus }
                        onBlur={ handleInputUnfocus }
                        onKeyDown={ handleKeyDown }
                        onChange={ handleUserChange }
                        placeholder="e-mail"
                        value={ username }
                        className={ `focusable ${styles.usernameInput}` }
                        type="text"/>
                    <input onFocus={ handleInputFocus }
                    onBlur={ handleInputUnfocus }
                    onKeyDown={ handleKeyDown }
                    onChange={ handlePassword }
                    placeholder="Password"
                    value={ password }
                    className={ `focusable ${styles.passwordInput}` }
                    type="password"/>
                    <div className={ styles.errorBox }>
                        { error &&
                            <p>{ errorMessage }</p> }
                    </div>
                    <div className={ styles.buttonContainer }>
                            <button className="focusable secondaryButton"
                                    onFocus={ handleButtonFocus }
                                    onBlur={ handleButtonUnfocus }
                                    onClick={ handleShowPass }>
                                Mostra Password
                            </button>
                            <button className="focusable primaryButton"
                                    onFocus={ handleButtonFocus }
                                    onBlur={ handleButtonUnfocus }
                                    onClick={ handleValidation }>
                                Accedi
                            </button>
                    </div>
                </form>
                
            </div>

            <div className={ styles.rightContainer }/>
        </div>
    )
}

export default EmailLogin