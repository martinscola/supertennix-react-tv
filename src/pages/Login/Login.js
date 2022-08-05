// import useLogin from "../services/useLogin";
import { Outlet, useOutletContext } from "react-router-dom";
import { appVersion } from "../../lib/utils/constants";
import styles from './Login.module.css';

const Login = () => {
    const [user, setUser] = useOutletContext();
    return (
        <div className={ styles.loginHome }>
            <Outlet context={[user, setUser]}/>
            <div className={styles.appVersion}>
                <p>Version {appVersion}</p>
            </div>
        </div>
    );
};

export default Login;
