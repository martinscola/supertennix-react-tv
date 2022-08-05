import { Suspense, useEffect, useState, useRef } from 'react';
import { T } from "../../lib/helpers/Translation"
import useIntersectionObserver from '../../lib/hooks/useIntersectionObserver';

// COMPONENTS
import Loader from '../Loader/Loader';

import placeholderImage from '../../resources/img/appTV/placeholder-cardTV.png';
import styles from './SlideComponent.module.css';


const SlideComponent = ({
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
    isActive,
    ...item}) => {
    
    const ref = useRef();
    const [isVisible, setVisible] = useState(false)
    const [slide, setSlide] = useState(null);


    /**
     * Observer to check if the slide is in viewport to load image
     * (Part of Lazy Loading)
     */
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

    const handleKeyDown=(event, item)=> {
        if ( event.key === 'Enter' ){
            event.preventDefault();
            callback(item)
        }
    }

    useEffect(()=>{
        setSlide(document.querySelector(`.id-${item.id}`))
        return function cleanup(){
            setSlide(null)
        }
    },[]);
    
    // useEffect(()=>{
    //     console.log(isActive, item.id);
    // },[isActive])

    return (
        <div
            onClick={ () => callback(item) }
            onKeyDown={(event) => handleKeyDown(event, item)}
            onBlur={handleBlur}
            onMouseOver={(event)=>handleFocus(event, item)}
            onMouseOut={handleBlur}
            onFocus={(event)=>handleFocus(event, item)}
            id={item.id || index}
            className={ `focusable ${ styles[ parentClass ] } id-${ item.id || index} ${isActive === item.id ? styles.activeCategory : ''} ` }
            ref={ref}
        >
            <div className={parentClass === 'VerticalGrid' ? styles.verticalSlideContainer : styles.horizontalSlideContainer}>
                <Suspense fallback={ <Loader size={ 50 }/> }>
                    {isFocused === item.id && (
                        <div className={`${styles.slideInfo}`} />
                    )}
                    {parentClass==='VerticalGrid' ? item.background && isVisible && (
                        <img src={ item.background } alt={ T(item.title) }
                            onError={ (event) => event.target.src = placeholderImage }/>)
                    : item.image && isVisible && (
                        <img src={ item.image } alt={ T(item.title) }
                            onError={ (event) => event.target.src = placeholderImage }/>)
                    }
                    {parentClass === `RectangularCarousel` && (
                        <p className={styles.categorySlide}>{ item.title }</p>
                    )}
                    {item.text === '$t(VIEW ALL)' && (
                        <p className={styles.categorySlide}>Guarda Tutti</p>
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default SlideComponent;
