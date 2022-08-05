import { useState, useEffect, Suspense } from 'react';
import { fetchWrapper } from '../../lib/helpers/fetch-wrapper';
import { baseAPIURI, searchEndpoint } from '../../lib/utils/constants';
import SpatialNavigation from 'spatial-navigation-js'
import { useNavigate } from "react-router-dom";
import { useImage } from 'react-image';

import Loader from '../../components/Loader/Loader';
import placeholderImage from '../../resources/img/placeholder-slider.png';
import styles from './Search.module.css';
import VoidContentComponent
    from '../../components/voidContentComponent/voidContentComponent';

const Search = () => {
    const navigate = useNavigate();
    const [ searchResults, setSearchResults ] = useState(
    JSON.parse(sessionStorage.getItem('lastSearch')) || []);
    const [ query, setQuery ] = useState('');
    const [ isLoading, setLoading ] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const handleBackButton = (event) => {
        if ( event.keyCode === 10009 ) { //EXIT
            console.log(`%cBack from Search`, `color: deeppink`);
            navigate(-1);
        }
    };

    function ImageContainer({item}) {
        const {src} = useImage({
            srcList: [
                item.image,
                item.background,
                placeholderImage ],
        });
        return <img src={ src } alt={ item.title }/>;
    }

    const search = () => {
        setSearchResults([]);
        setLoading(true);
        setNoResults(false);
        if ( query ) {
            fetchWrapper.get(
                `${ baseAPIURI }${ searchEndpoint }?query=${ query }&type=content&determined=true`)
            .then((response) => {
                // console.log(response);
                let arr = [];
                if ( response.success === true ){
                    if(response.data.count.content > 0){
                        arr = response.data.data;
                    }else {
                        setNoResults(true)
                    }
                }
                let lastSearch = {searchDate: Date.now(), searchData: arr};
                setSearchResults(lastSearch);
                sessionStorage.setItem('lastSearch',
                    JSON.stringify(lastSearch));
            });
        }
        setLoading(false);
    };

    const handleKeyDown = (event) => {
        if ( event.keyCode === 40 || event.keyCode === 38 ) {
            if ( event.keyCode === 38 ) {
                SpatialNavigation.focus('@navBar');
                // SpatialNavigation.move('up', `.${ styles.searchFocus }`);
                // document.querySelector(`.${ styles.searchFocus }`)
                // .classList
                // .remove(styles.inputFocus);
            } else if ( event.keyCode === 40 && searchResults ) {
                SpatialNavigation.focus('@searchResults');
                // SpatialNavigation.move('down', `.${ styles.searchFocus }`);
                // document.querySelector(`.${ styles.searchFocus }`)
                // .classList
                // .remove(styles.inputFocus);
            }
        }
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    // const handleFocus = (event) => {
    //     event.target.classList.add(styles.focus);
    //     event.target.scrollIntoView({
    //         behavior: 'smooth',
    //         inline: 'center',
    //         block: 'center',
    //     });
    // };
    //
    // const handleInputFocus = (event) => {
    //     event.target.classList.add(styles.inputFocus);
    //     event.target.blur();
    //     document.querySelector(`.${ styles.searchInput }`).focus();
    // };
    //
    // const handleUnfocus = (event) => {
    //     event.target.classList.remove(styles.focus);
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        search();
    };
    const watch = (item) => {
        navigate('/watch', {state: {id: item.id}});
    };

    useEffect(() => {
        SpatialNavigation.init();
        SpatialNavigation.add(`searchForm`,
        {
            selector: `#searchForm .focusable`
        })
        SpatialNavigation.focus(styles.searchSection);
        return function cleanup(){
            SpatialNavigation.remove(`searchForm`);
        }
    }, []);
    
    useEffect(()=>{
        console.log(searchResults)
        if ( searchResults.searchData && searchResults.searchData.length >= 1 ){
            console.log(`Entering inside SearchResults`)
            SpatialNavigation.add(`searchResults`, {
                selector: `#searchResults .focusable`
            })
            SpatialNavigation.makeFocusable()
            SpatialNavigation.focus(`searchResults`);
        }
        return function cleanup(){
            SpatialNavigation.remove(`searchResults`);
        }
    },[ searchResults ])

    useEffect(() => {
        if ( searchResults !== [] && (Date.now() - searchResults.searchDate) >
            30 * 60 * 1000 ) {
            // console.log(`Stale search data. Clearing session Storage...`);
            setSearchResults([]);
            sessionStorage.removeItem('lastSearch');
        }
    }, [ searchResults ]);

    useEffect(() => {
        document.body.addEventListener('keydown', handleBackButton);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleBackButton);
        };
    }, []);

    return (
        <div className={ styles.searchHome }>
            <form
                id={`searchForm`}
                className={ styles.searchForm }
                onSubmit={ handleSubmit }
            >
                <input
                    type="text"
                    placeholder="Cerca un contenuto"
                    className={ `focusable ${styles.searchInput}` }
                    value={ query }
                    onKeyDown={ handleKeyDown }
                    onChange={ handleChange }
                />
                <div className={ styles.searchButton }>
                    <i onClick={ handleSubmit }
                        className="far fa-search"/>
                </div>
            </form>
            <div id={`searchResults`} className={ styles.searchResults }>
                { isLoading
                ? (<Loader className="loader" size={ 200 }/>)
                : null }
                { noResults &&
                    <VoidContentComponent
                    text={ 'Nessun risultato trovato' }/>
                }
                { searchResults.searchData && searchResults.searchData.length >
                    0 && (
                        <div className={ styles.contentGrid }>
                            { searchResults.searchData.map(
                                (item, index) => {
                                    return (
                                        <div
                                            onClick={ () => watch( item) }
                                            className={ `focusable ${styles.contentElement}` }
                                            key={ index }
                                        >
                                            <Suspense
                                                fallback={ <Loader
                                                    size={ 250 }/> }>
                                                <ImageContainer
                                                    item={ item }
                                                    alt=""/>
                                            </Suspense>
                                            <h5>{ item.title }</h5>
                                        </div>
                                    );
                                }) }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Search;
