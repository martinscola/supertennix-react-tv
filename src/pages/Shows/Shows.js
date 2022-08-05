import { useState, useEffect } from 'react';
import axios from 'axios';
import SpatialNavigation from 'spatial-navigation-js'
import SlideComponent from '../../components/SlideComponent/SlideComponent';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import styles from './Shows.module.css';
import { fetchWrapper } from "../../lib/helpers/fetch-wrapper";

const Shows = () => {
    const baseURLAPI = process.env.REACT_APP_BASE_API_URL;
    const pagesURL = process.env.REACT_APP_PAGES_ENDPOINT;
    const [ showInfo, setShowInfo ] = useState(null);
    const [ content, setContent ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);
    const [slideMetadata, setSlideMetadata] = useState(null);
    const [slideInfo, setSlideInfo] = useState(null)
    const [isFocused, setFocused] = useState(null)
    const [lastFocused, setLastFocused] = useState(sessionStorage.getItem("lastFocused") || null)
    const navigate = useNavigate();

    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) { //EXIT
            console.log(`%cBack`, `color: deeppink`);
            navigate(-1);
        }
    };

    const selectShow = (item) => {
        // console.group(`%cACCESSED`, 'color: green; font-weight: bold');
        // console.log(item.id);
        // console.groupEnd();
        navigate(`/show/${ item.id }`);
    };

    const handleFocus = (event, item) => {
        setFocused(item.id);
        event.target.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'center',
        });
        setShowInfo(item);
    };
    
    const handleBlur = (event) => {
        setFocused(null)
        // event.target.classList.remove(styles.focus);
        // console.log(`%cUNFOCUSED`, 'color: darkred');
    };

    useEffect(() => {
        document.body.addEventListener('keydown', handleBackButton);
        return function cleanup() {
            document.body.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    useEffect(() => {
        fetchWrapper.get(`${ baseURLAPI }${ pagesURL }/magazines.json`)
        .then((response) => {
            console.log(response[0] )
            const data = response[0];
            setContent(data);
            setLoading(false);
        });
    }, []);
    
    useEffect(()=>{
        SpatialNavigation.init();
        if(!isLoading && content) {
            SpatialNavigation.add( `contentGrid`, {
                selector: `#contentGrid .focusable`,
                defaultElement: `#contentGrid focusable:first-child`,
                rememberSource: true,
                enterTo: 'last-focused',
                restrict: 'self-first',
                leaveFor: { up:'@navBar', down: ''}
            } );
            SpatialNavigation.makeFocusable();
            SpatialNavigation.focus(`contentGrid`);
        }
        return function cleanup() {
            SpatialNavigation.remove(`contentGrid`);
        }
    },[isLoading, content]);
    

    if ( isLoading ) return <Loader size={ 300 }/>;
    return (
        <section className={ styles.showsHome }>
            <div id={`contentGrid`} className={ styles.grid }>
                { content.items.map((item, index) => {
                    return (
                        <SlideComponent
                        key={index}
                        index = {index}
                        parent = {document.querySelector(`#contentGrid`)}
                        callback={ () => selectShow(item) }
                        setSlideInfo = {setSlideInfo}
                        setSlideMetadata={setSlideMetadata}
                        parentId ={ item.id }
                        parentClass={ `${content.widget}` }
                        handleFocus = {(event)=>handleFocus(event, item)}
                        handleBlur = {handleBlur}
                        isFocused = {isFocused}
                        lastFocused ={ lastFocused }
                        { ...item }
                        />
                    );
                }) }
            </div>
            { showInfo && (<div className={ styles.showDescription }>
                <div className={ styles.showDescriptionImageContainer }>
                    <img src={ showInfo.background } alt={ showInfo.title }/>
                </div>
                <div>
                    <h3>{ showInfo.title }</h3>
                    <p>{ showInfo.description }</p>
                </div>
            </div>) }
        </section>
    );
};

export default Shows;
