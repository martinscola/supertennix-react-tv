import React, { Fragment, useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SlideComponent from '../SlideComponent/SlideComponent';
import CategoryTabComponent from '../CategoryTabComponent/CategoryTabComponent';
import LiveComponent from '../LiveComponent/LiveComponent';
import styles from './HorizontalCarouselComponent.module.css';

const HorizontalCarouselComponent = ( {slideCallback, id, widget, setSlideInfo, setSlideMetadata, index, isActive }) =>{
    const focusRef = useRef();
    const navigate = useNavigate();
    const [isFocused, setFocused] = useState(null)
    const [lastFocused, setLastFocused] = useState(sessionStorage.getItem("lastFocused") || null)
    
    const showInfo = (info) =>{
        info.type === 'series' ?
        navigate('/episodes-info', {state: {info: info}}) :
        navigate('/content-info', {state: {info: info}})
    }

    const viewAll = (url) =>{
        navigate(`${url}`, {state: { url: url } })
    }

    const handleKeyDown = (event, url) => {
        if ( event.key === 'Enter' ){
            viewAll(url)
        }
    }

    const handleFocus = (event, item) => {
        const currentCarousel = event.target.parentNode.parentNode;
        // if(id) {
        //     let lastFocused = {
        //         parentId: id,
        //         id: item.id,
        //         timestamp: Date.now(),
        //     };
        //     sessionStorage.setItem( `lastFocused`,
        //         JSON.stringify( lastFocused ) );
        //     setLastFocused( lastFocused );
        // }
        currentCarousel.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline:'nearest'
        });
        event.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline:'center'
        });
        setSlideInfo(item)
        if(item.metadata)setSlideMetadata(JSON.parse(item.metadata))
        setFocused(item.id);
    };

    const handleBlur = () => {
        setFocused(null)
    };
    
    // useEffect(()=>{
    //     console.log(isActive)
    // },[isActive])

    return (
        <div className={`${styles.horizontalCarouselContainer} `}>
            {/*<CategoryTabComponent widget={widget.widget} title={ widget.heading || widget.name} color="var(--360sports-orange-dark"  />*/}
            <div
                id={id}
                className={ `${ styles.horizontalCarousel }` }
                ref={ index === 0 ? focusRef : null }
                key={ index }
            >
            { widget.items.map((item, index) => {
                return(
                    <Fragment key={index}>
                    { widget.widget === 'LiveCard' ? (
                            <LiveComponent
                                parent = {document.querySelector(`#carouselViewer`)}
                                callback={ item.live === 'live' ? (item) => slideCallback(
                                    item ) : item.live === 'pending' ? (item) => showInfo(item) : ''}
                                setSlideInfo = {setSlideInfo}
                                setSlideMetadata={setSlideMetadata}
                                parentClass={ widget.widget }
                                parentId ={ id }
                                handleFocus = {(event)=>handleFocus(event, item)}
                                handleBlur = {handleBlur}
                                isFocused = {isFocused}
                                lastFocused ={ lastFocused }
                                index={ index }
                                { ...item }
                            />)
                    : (<SlideComponent
                            parent = {document.querySelector(`#carouselViewer`)}
                            callback={ (item) => slideCallback(item)  }
                            setSlideInfo = {setSlideInfo}
                            setSlideMetadata={setSlideMetadata}
                            parentClass={ widget.widget }
                            parentId ={ id }
                            handleFocus = {(event)=>handleFocus(event, item)}
                            handleBlur = {handleBlur}
                            isFocused = {isFocused}
                            lastFocused ={ lastFocused }
                            index = {index}
                            isActive = {isActive}
                            { ...item }

                            />
                    )}
                </Fragment>
                )}
            )}
                {widget.view_all.url && widget.widget !== "MainSlider" && widget.widget !== "ContinueWatchCarousel" && widget.widget !== "LiveCard" && widget.heading !== "Series" &&
                    <SlideComponent
                        parent = {document.querySelector(`#carouselViewer`)}
                        callback={ () => viewAll(widget.view_all.url)  }
                        setSlideInfo = {setSlideInfo}
                        setSlideMetadata={setSlideMetadata}
                        parentClass={ widget.widget }
                        parentId ={ id }
                        handleFocus = {(event)=>handleFocus(event, widget.view_all.url)}
                        handleBlur = {handleBlur}
                        isFocused = {isFocused}
                        lastFocused ={ lastFocused }
                        index = {index}
                        { ...widget.view_all }
                    />
                  // <div
                  //       className={`focusable ${ styles.viewAllElement }`}
                  //       onClick={()=>viewAll(widget.view_all.url)}
                  //       onKeyDown={(event)=>handleKeyDown(event, widget.view_all.url)}
                  //   >
                  //       <div className={styles.viewAllTextContainer}>
                  //           <p className={`text24Regular`}>All</p>
                  //           <i className={`far fa-chevron-right fa-2x`} />
                  //       </div>
                  //   </div>
                }
            </div>
        </div>

    );
}

export default HorizontalCarouselComponent