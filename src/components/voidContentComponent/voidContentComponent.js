import styles from './VoidContentComponent.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoidContentComponent = ({text}) => {
    return (
        <div className={ styles.voidContent }>
            <h2>{ text }</h2>
        </div>
    );
};

export default VoidContentComponent;
