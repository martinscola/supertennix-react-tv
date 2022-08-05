import styles from './NoVideoComponent.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NoVideoComponent = ({message}) => {
    const navigate = useNavigate();

    const handleButton = (event) => {
        if ( event.keyCode === 10009 || event.keyCode === 13 ) {
            console.log(`No Video Component Back`);
            navigate(-1);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleButton);
        return function removeHandleButtonEL() {
            window.removeEventListener('keydown', handleButton);
        };
    }, []);

    return (
        <div className={ styles.noVideoHome }>
            <h3>{ message }</h3>
        </div>
    );
};

export default NoVideoComponent;