import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { fetchWrapper } from '../../lib/helpers/fetch-wrapper';
import { baseAPIURI, pagesEndpoint } from '../../lib/utils/constants';

import Loader from '../../components/Loader/Loader';
import HeroComponent from '../../components/HeroComponent/HeroComponent';
import MainCarouselComponent
    from '../../components/MainCarouselComponent/MainCarouselComponent';

import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const [widgets, setWidgets] = useState(null);
    const [slideInfo, setSlideInfo] = useState([])
    const [slideMetadata, setSlideMetadata] = useState(null)
    const [isLoading, setLoading] = useState(true);
    
    const handleExitButton = (event) => {
        if ( event.keyCode === 10182 ) { //EXIT
            // console.log(`%cGoodbye`, `color: deeppink`);
            window.tizen.application.getCurrentApplication().exit();
        }
    };
    
    const watch = (item) => {
        console.log(item)
            navigate( '/watch', { state: { id: item.id, item: item } } );
    };
    
    useEffect(() => {
        document.body.addEventListener('keydown', handleExitButton);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleExitButton);
        };
    }, []);
    
    
    useEffect(() => {
        setLoading(true)
        if(!widgets) {
            fetchWrapper.get( `${ baseAPIURI }${ pagesEndpoint }/1/tv.home.json`,
        {
                    headers: {
                    'Authorization': `Bearer ${ localStorage.getItem(
                'access_token' ) }`,
                },
                })
            .then( ( response ) => {
                setWidgets( response );
                setLoading( false );
            } );
        }
    }, []);
    
    return (
        isLoading ? <Loader size={300} /> :
        <section className={styles.homeSection}>
            <HeroComponent slideInfo={slideInfo} slideMetadata={slideMetadata}/>
            <MainCarouselComponent
                slideCallback ={(item) => watch (item)}
                setSlideInfo={setSlideInfo}
                setSlideMetadata={setSlideMetadata}
                widgets={widgets}
            />
        </section>
    )
}

export default Home;