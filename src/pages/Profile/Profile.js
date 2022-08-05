import SpatialNavigation from 'spatial-navigation-js'
import { useNavigate } from 'react-router-dom';
import { useTokensContext } from '../../lib/context/tokens-context';
import { userService } from '../../lib/services/user.service';
import { useEffect, useState } from 'react';
import {appVersion} from '../../lib/utils/constants';
import styles from './Profile.module.css';
import { cleanup } from "@testing-library/react";

const Profile = () => {
    const [ user, setUser ] = useState(
        JSON.parse(localStorage.getItem('user')) || null);
    const {removeTokens} = useTokensContext();
    const navigate = useNavigate();
    const [ subscriptionInfo, setSubscriptionInfo ] = useState(null);

    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) { //EXIT
            console.log(`%cBack from Profile`, `color: deeppink`);
            navigate(-1);
        }
    };

    const handleLogout = () => {
        const refresh_token = userService.getRefreshToken();
        userService.logout(refresh_token, user.user_id)
        .then((response) => {
            removeTokens();
        });
        navigate('/login');
    };

    useEffect(async() => {
        await (userService.getSubscriptionInfo())
        .then((response) => {
            if ( response.data.length > 0 ) {
                setSubscriptionInfo(response.data[0]);
            }
        });
    }, []);
    
    useEffect(()=>{
        SpatialNavigation.init();
        SpatialNavigation.add(`LogoutButton`, {
            selector: `#logoutContainer .focusable`
        });
        SpatialNavigation.makeFocusable();
        SpatialNavigation.focus(`LogoutButton`);
        return function cleanup(){
            SpatialNavigation.remove(`LogoutButton`);
        }
    },[])

    useEffect(() => {
        // console.log(subscriptionInfo);
    }, [ subscriptionInfo ]);

    useEffect(() => {
        document.body.addEventListener('keydown', handleBackButton);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    return (
        <section className={ styles.profile }>
            <div className={ styles.profileInfoContainer }>
                <div className={ styles.profileInfo }>
                    <div className={ styles.info }>
                        <h3>Il Tuo Account</h3>
                        <p>{ user.email }</p>
                    </div>
                    <div className={ styles.info }>
                        <h3>Abbonamento SuperTennix</h3>
                        <p>{ subscriptionInfo
                            ? subscriptionInfo.name_product
                            : `Nessun abbonamento attivo` }
                        </p>
                    </div>
                    { user.language ? (
                        <div className={ styles.info }>
                            <h3>Lingua</h3>
                            <p>{ user.language }</p>
                        </div>) : '' }
                    <div id={`logoutContainer`} className={  styles.logoutContainer }>
                        <button className={`focusable ${styles.logoutButton}`} onClick={ handleLogout }>Logout</button>
                    </div>
                </div>
            </div>
            <div className={ styles.disclaimerContainer }>
                <div className={ styles.disclaimer }>

                    <h3>Note Legali</h3>
                    <p>
                        Le condizioni di utilizzo di SuperTennix sono
                        consultabili
                        all'indirizzo
                        https://www.supertennix.it/terms-and-conditions/.
                    </p>
                    <p>
                        Apprezziamo la tua fiducia nei nostri confronti, e per
                        conoscere le modalità con cui vengono utilizzate e
                        condivise
                        le informazioni che ti riguardano visita l'indirizzo
                        https://www.supertennix.it/policy/.
                    </p>
                <div className={styles.appVersion}>
                    <p>App Version: {appVersion}</p>
                </div>
                </div>
            </div>

        </section>
    );
};

export default Profile;
