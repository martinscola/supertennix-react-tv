import { useEffect, useState } from 'react';
import SpatialNavigation from 'spatial-navigation-js'

import { useLocation, useNavigate } from "react-router-dom";
import { baseAPIURI, pagesEndpoint } from '../../lib/utils/constants';
import VoidContentComponent
    from '../../components/voidContentComponent/voidContentComponent';

import styles from './Sport.module.css';
import Loader from '../../components/Loader/Loader';
import SlideComponent from '../../components/SlideComponent/SlideComponent';
import HorizontalCarouselComponent
    from "../../components/HorizontalCarouselComponent/HorizontalCarouselComponent";
import { fetchWrapper } from "../../lib/helpers/fetch-wrapper";

const Sport = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [sportCode, setSportCode] = useState(location.pathname);
    const [navigation, setNavigation] = useState(false);
    const [ isLoading, setLoading ] = useState(true);
    const [ categories, setCategories ] = useState(null);
    const [ content, setContent ] = useState(null);
    const [slideMetadata, setSlideMetadata] = useState(null);
    const [slideInfo, setSlideInfo] = useState(null);
    const [isFocused, setFocused] = useState(null);
    const [isActive, setActive] = useState(null);
    const [lastFocused, setLastFocused] = useState(sessionStorage.getItem("lastFocused") || null);
    
    const selectCategory = (item) => {
        console.log(item)
        setActive(item.id);
        fetchWrapper.get(`${ baseAPIURI }/api/v1/it/list${ item.url }`)
        .then((response) => {
            const data = response.data.widgets[0];
            setContent(data);
        });
    };

    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) { //EXIT
            console.log(`%cBack from Paddle`, `color: deeppink`);
            navigate(-1);
        }
    };

    const watch = (item) => {
        navigate('/watch', {state: {id: item.id}});
    };

    const handleFocus = (event, item) => {
        event.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline:'center'
        });
        setSlideInfo(item)
        if(item.metadata) {setSlideMetadata( JSON.parse( item.metadata ) );}
        setFocused(item.id);
    };

    const handleBlur = (event) => {
        event.target.classList.remove(styles.focus);
        // console.log(`%cUNFOCUSED`, 'color: darkred');
    };
    
    useEffect(()=>{
        // console.log(sportCode)
        setSportCode(location.pathname);
    },[sportCode, location])

    useEffect(() => {
        setNavigation(false)
        fetchWrapper.get(
            `${ baseAPIURI }${ pagesEndpoint }${sportCode}/tv.sport.json`,
        ).then((response) => {
            const data = response[0];
            setCategories(data);
            setLoading(false);
            setNavigation(true)
        });
        // SpatialNavigation.focus('.categoryCarousel');
    }, [sportCode]);
    
    useEffect(()=>{
        SpatialNavigation.init();
        if(!isLoading && categories) {
                SpatialNavigation.add( `categoriesCarousel`, {
                    selector: `#categoriesCarousel .focusable`,
                    defaultElement: `#categoriesCarousel>div:first-child`,
                    rememberSource: true,
                    enterTo: 'last-focused',
                    restrict: 'self-first',
                    leaveFor: { up:'@navBar', down: '@contentGrid'}
                } );
            SpatialNavigation.makeFocusable();
        }
        return function cleanup() {
                SpatialNavigation.remove(`categoriesCarousel`);
        }
    },[navigation, categories]);
    
    useEffect(()=>{
        SpatialNavigation.init();
        if(!isLoading && content) {
                SpatialNavigation.add( `contentGrid`, {
                    selector: `#contentGrid .focusable`,
                    defaultElement: `#contentGrid focusable:first-child`,
                    rememberSource: true,
                    enterTo: 'last-focused',
                    restrict: 'self-first',
                    leaveFor: { up:'@categoriesCarousel', down: '', right:'', left: ''}
                } );
            SpatialNavigation.makeFocusable();
            SpatialNavigation.focus(`contentGrid`);
        }
        return function cleanup() {
                SpatialNavigation.remove(`contentGrid`);
        }
    },[isLoading, content]);

    useEffect(() => {
        if ( categories && categories.items.length >= 1 ) {
            selectCategory( categories.items[0] );
        }
    }, [ categories ]);

    useEffect(() => {SpatialNavigation.focus('categoryCarousel');}, []);

    useEffect(() => {
        document.body.addEventListener('keydown', handleBackButton);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    // console.log(`%cResponse:`, `color: orange`, content);
    if ( isLoading ) return <Loader size={ 300 }/>;
    return (
        <section
        className={
            categories.items.length > 1
            ? styles.sportHome
            : styles.sportHomeSingleRow
        }
        >
            {/*{console.log(categories)}*/}
            {categories.items && categories.items.length > 1 && (
                <div id="carouselViewer" className={ styles.categoryScroller }>
                    <HorizontalCarouselComponent
                    slideCallback={(item)=>selectCategory(item)}
                    id={ `categoriesCarousel` }
                    widget={ categories }
                    index={ 0 }
                    setSlideInfo={ setSlideInfo }
                    setSlideMetadata={ setSlideMetadata }
                    key={ 0 }
                    isActive = {isActive}
                    />
                </div>) }
            { content !==  null && content.items.length === 0 &&
                <VoidContentComponent text={ 'Nessun risultato trovato' }/> }
            { content !== null && content.items.length > 0 && (
                <div id={`contentGrid`} className={ styles.contentGrid }>
                        { content.items.map((item, index) => {
                            return (
                                <div className={ styles.contentElement }
                                    key={ index }>
                                        <SlideComponent
                                        parent = {document.querySelector(`#contentGrid`)}
                                        callback={ () => watch(item)  }
                                        setSlideInfo = {setSlideInfo}
                                        setSlideMetadata={setSlideMetadata}
                                        parentClass={ content.widget }
                                        parentId ={ 0 }
                                        handleFocus = {(event)=>handleFocus(event, item)}
                                        handleBlur = {handleBlur}
                                        isFocused = {isFocused}
                                        lastFocused ={ lastFocused }
                                        index = {index}
                                        { ...item } />
                                    <p>{ item.title }</p>
                                </div>
                            );
                        })}
                </div>
            )}
        </section>
    );
};

export default Sport;
