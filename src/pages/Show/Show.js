import { useState, useEffect, Fragment } from 'react';

// HELPERS
import { fetchWrapper } from '../../lib/helpers/fetch-wrapper';
import { baseAPIURI, pagesEndpoint } from '../../lib/utils/constants';

// COMPONENTS
import SlideComponent from '../../components/SlideComponent/SlideComponent';

// 3rd PARTY
import SpatialNavigation from 'spatial-navigation-js'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// CSS
import styles from './Show.module.css'
import VoidContentComponent
    from '../../components/voidContentComponent/voidContentComponent';
import Loader from '../../components/Loader/Loader';

const Show = () => {
    const navigate = useNavigate();
    const params = useParams();
    const showId = params.showId;
    const [ header, setHeader ] = useState(null);
    const [ content, setContent ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);
    const [isFocused, setFocused] = useState(null);
    const [slideMetadata, setSlideMetadata] = useState(null);
    const [slideInfo, setSlideInfo] = useState(null);
    const [lastFocused, setLastFocused] = useState(sessionStorage.getItem("lastFocused") || null);

    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) { //EXIT
            console.log(`%cBack from Show`, `color: deeppink`);
            navigate(-1);
        }
    };

    const watch = (item) => {
        navigate('/watch', {state: {id: item.id}});
    };
    
    const handleFocus = (event, item) => {
        setFocused(item.id);
        event.target.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'center',
        });
    };
    
    const handleBlur = (event) => {
        setFocused(null)
        // event.target.classList.remove(styles.focus);
        // console.log(`%cUNFOCUSED`, 'color: darkred');
    };

    useEffect(() => {
        fetchWrapper.get(`${ baseAPIURI }${ pagesEndpoint }/${ showId }/magazine.json`)
        .then((response) => {
            const header = response[0];
            const content = response[1];
            setHeader(header);
            setContent(content);
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
                leaveFor: { up:'@navBar', down: '', right: ''}
            } );
            SpatialNavigation.makeFocusable();
            SpatialNavigation.focus(`contentGrid`);
        }
        return function cleanup() {
            SpatialNavigation.remove(`contentGrid`);
        }
    },[isLoading, content]);

    useEffect(() => {
        document.body.addEventListener('keydown', handleBackButton);
        return function cleanup() {
            document.body.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    if ( isLoading ) return <Loader size={ 300 }/>;
    return (
        <section className={ styles.showHome }>
            { content.items.length === 0 &&
                <VoidContentComponent text={ 'Nessun risultato trovato' }/> }
            { content.items.length > 0 && (
                <div id={`contentGrid`} className={ styles.contentGrid }>
                        { content.items.map((item, index) => {
                            return (
                                <div key={ index }
                                >
                                        <SlideComponent
                                            watch={ () => watch(item) }
                                            index = {index}
                                            parent = {document.querySelector(`#contentGrid`)}
                                            callback={ () => watch(item) }
                                            setSlideInfo = {setSlideInfo}
                                            setSlideMetadata={setSlideMetadata}
                                            parentId ={ item.id }
                                            parentClass={ content.widget }
                                            handleFocus = {(event)=>handleFocus(event, item)}
                                            handleBlur = {handleBlur}
                                            isFocused = {isFocused}
                                            lastFocused ={ lastFocused }
                                            { ...item }
                                        />
                                    <div className={ styles.showInfo }>
                                        <h5>{ `${ item.title } ` }</h5>
                                        <h6>{ `${ item.subtitle }` }</h6>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </section>
    )
}

export default Show;