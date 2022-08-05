import React, { useEffect, useState } from 'react';
// 3RD PARTY
import SpatialNavigation from 'spatial-navigation-js';
import { useOutletContext } from 'react-router-dom';
// COMPONENTS
import HorizontalCarouselComponent
    from '../HorizontalCarouselComponent/HorizontalCarouselComponent';
// STYLING
import styles from "./MainCarouselComponent.module.css";

const MainCarouselComponent = ({ slideCallback, setSlideInfo,setSlideMetadata, widgets }) => {
    const [navigation, setNavigation] = useState(false)
    const [carouselList, setCarouselList] = useState([])
    const [widgetList, setWidgetList] = useState([])
    // const [profile, setProfile] = useOutletContext()
    const [lastFocused, setLastFocused] = useState(JSON.parse(sessionStorage.getItem("lastFocused")) ||null)
    
    useEffect(()=>{
        let tempCarouselList = []
        let tempWidgetList = [];
        setNavigation(false)
        widgets.map((widget, index) => {
            if ( widget.items !== null ) {
                tempWidgetList.push(widget)
                tempCarouselList.push( {
                    name: `${widget.widget}`,
                    carousel:`carousel-${ index }`,
                    id: `carouselId-${index}`
                })
            }
        })
        setNavigation(true);
        setCarouselList(tempCarouselList)
        setWidgetList(tempWidgetList)
    },[widgets])
    
    useEffect(()=>{
        SpatialNavigation.init();
        if(navigation) {
            carouselList.map( ( carousel, index ) => {
                SpatialNavigation.add( carousel.id, {
                    selector: `#${carousel.id} .focusable`,
                    defaultElement: `#${carousel.id} focusable:first-child`,
                    rememberSource: true,
                    enterTo: 'last-focused',
                    restrict: 'self-first',
                    leaveFor: { left:'@navigation', right: ''}
                } );
            } );
            SpatialNavigation.makeFocusable();
            
        }
        return function cleanup() {
            carouselList.map((carousel)=>{
                // console.log(`Killing Carousel`)
                SpatialNavigation.remove(carousel.id);
            })
        }
    },[navigation, carouselList]);
    
    useEffect(()=>{
        if(navigation){
            if(lastFocused && lastFocused.parentId){
                // console.log( lastFocused );
                if ( (Date.now() - lastFocused.timestamp) >2 * 60 * 60 * 1000 ) {
                    setLastFocused(null)
                    sessionStorage.removeItem('lastFocused');
                    // console.log(`Too old! Switching to ${ carouselList[0].id }`);
                    SpatialNavigation.focus( `${ carouselList[0].id }` );
                }else{
                    SpatialNavigation.focus( `${ lastFocused.parentId }` );
                }
            } else {
                // console.log(`No Last Focused Element, focusing on ${ carouselList[0].id }`);
                SpatialNavigation.focus( `${ carouselList[0].id }` );
            }
            
        }},[navigation]);
    
    return (
        <div id="carouselViewer" className={ styles.viewer }>
            <div className={ styles.verticalCarousel }>
            { widgetList.map( ( widget, index ) => {
                if ( widget.items !== null && widget.items.length > 0 ) {
                    return (
                        <HorizontalCarouselComponent
                            slideCallback = {(item)=>slideCallback(item)}
                            id={ `carouselId-${ index }` }
                            widget={ widget }
                            index={ index }
                            setSlideInfo={ setSlideInfo }
                            setSlideMetadata={ setSlideMetadata }
                            key={ index }
                        />
                    );
                }
            } ) }
            </div>
        </div>
    );
};

export default MainCarouselComponent;
