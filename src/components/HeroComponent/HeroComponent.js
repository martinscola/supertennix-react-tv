import { useState, useEffect } from 'react';
import placeholderImage
    from '../../resources/img/appTV/placeholder-bg-appTV.png';

import styles from './HeroComponent.module.css';
import { strftime, T } from "../../lib/helpers/Translation";

const HeroComponent = ({slideInfo}) => {
    const [ info, setInfo ] = useState([]);

    useEffect(() => {
        // console.log(slideInfo);
        setInfo(slideInfo);
        // console.log('%cNow Active', `color: green`, info);
    }, [slideInfo, info]);

    return (
        <div className={styles.hero}>
            <div className={styles.info}>
                <div className={styles.infoContent}>
                    <h1>{info.title}</h1>
                    { info.overtitle && (
                    <h2>
                        <span>{ strftime( `%x`, info.overtitle ) }</span>
                        <span> - </span>
                        <span>{ strftime( `%X`, info.overtitle ) }</span>
                    </h2>
                    )}
                </div>
            </div>
            <div
                className="media"
                style={ {
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 100), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${
                        info.image || info.background
                    }), url(${ placeholderImage })`,
                    backgroundPosition: `center center`,
                    backgroundSize: `cover`,
                    backgroundRepeat: `no-repeat`,
                } }/>
        </div>
    );
};
export default HeroComponent;
