import placeholderImage from '../../resources/img/placeholder-slider.png';
import LiveBadgeComponent from '../liveBadgeComponent/liveBadgeComponent';
import useIntersectionObserver from "../../lib/hooks/useIntersectionObserver";
import { strftime, T } from "../../lib/helpers/Translation";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import styles from './LiveComponent.module.css';
import { useNavigate } from "react-router-dom";

const LiveComponent = ({
    parent,
    callback,
    setSlideInfo,
    setSlideMetadata,
    parentClass,
    parentId,
    handleFocus,
    handleBlur,
    isFocused,
    lastFocused,
    index,
    ...item}) => {
    
    const ref = useRef();
    const [isVisible, setVisible] = useState(false);
    const [month, setMonth] = useState(null);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();
    
    useIntersectionObserver({
        root: parent,
        target: ref,
        onIntersect: ([{ isIntersecting }], observerElement) => {
            if (isIntersecting) {
                setVisible(true);
                observerElement.unobserve(ref.current);
            }
        }
    });
    
    const watch = (item) => {
        console.log(item)
        navigate( '/watch', { state: { id: item.id, item: item } } );
    };
    
    const handleKeyDown=(event, item)=> {
        if ( event.key === 'Enter' ){
            event.preventDefault();
            watch(item)
        }
    }
    
    useEffect(()=>{
        if ( item.dateTime ) {
            const upcomingDate = item.dateTime.replace( /\$d\((.+?)\)/g,
            ( match ) => {
            const path = match.substring( 3, match.length - 4 ).trim();
                let spl = path.split( "," );
                let date = "";
                let timeZone = moment.tz.guess();
                if ( spl[0] !== "" ) {
                    date = moment.tz( spl[0] + "Z", timeZone ).toDate();
                }
                return date;
            } );
            setMonth( T( strftime( "%b", upcomingDate ) ) );
            setDate( T( strftime( "%d", upcomingDate ) ) );
        }
    },[item])
    
    return (
        <div
            onClick={ () => watch(item) }
            onKeyDown={(event) => handleKeyDown(event, item)}
            onBlur={handleBlur}
            onMouseOver={(event)=>handleFocus(event, item)}
            onMouseOut={handleBlur}
            onFocus={(event)=>handleFocus(event, item)}
            className={ `focusable ${styles[parentClass]}` }
            ref={ref}
        >
            <div className={ ` ${styles.liveCardDescription}` }>
                { item.status === 'live' ? (
                    <LiveBadgeComponent text={ item.top_left_badge.text }/>
                ) : null }
                <h3>{ item.heading || item.title }</h3>
                <p>{ item.subtitle }</p>
            </div>
            <img
                className={styles.swiperSlideImg}
                src={item.background || item.image || placeholderImage}
                alt={item.title}
            />
        </div>
    );
};

export default LiveComponent;
