import { Fragment, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SpatialNavigation from 'spatial-navigation-js'
import { useTokensContext } from '../../lib/context/tokens-context';
import styles from './NavbarComponent.module.css';
import logo from '../../resources/img/logo_supertennix.svg';

const NavbarComponent = () => {
    const {tokens} = useTokensContext();
    const location = useLocation();
    const [ name, setName ] = useState(JSON.parse(sessionStorage.getItem('profile')).name);
    const navigate = useNavigate();
    const navLinks = [
        {name: 'home', url: '/home', icon: ''},
        {name: 'tennis', url: '/1', icon: ''},
        {name: 'padel', url: '/2', icon: ''},
        {name: 'programmi', url: '/shows', icon: ''},
        {
            name: 'cerca',
            url: '/search',
            icon: <i className="far fa-search white mr-2"/>,
        },
        {name: 'profilo', url: '/profile', icon: name ? name.charAt(0) : ''},
    ];

    const activeClassName = styles.active;
    
    
    const handleKeyDown = (url, event) =>{
        if(event.keyCode=== 13){
            navTo(url)
        }
    }
    
    const navTo = (url) => {
        navigate(url);
    };
    
    const setActiveClass = (path) => {
        return (location.pathname === path ? styles.activeContainer : ''
        )
    }
    
    useEffect(()=>{
        SpatialNavigation.init();
        SpatialNavigation.add( 'navBar', {
            selector: `#navbar .focusable`,
            defaultElement: '#navbar .focusable:first-child',
            enterTo: 'last-focused',
            leaveFor: {  left:'', up:'', right: ''}
        });
        SpatialNavigation.makeFocusable();
        return function cleanup () {
            // console.log(`Removing Navigation`);
            SpatialNavigation.remove('navBar');
        }
    },[])

    useEffect(() => {
        !tokens && setName(tokens.user.given_name);
    }, [ tokens ]);

    useEffect(() => {
        navigate('/home');
    }, []);
    
    // useEffect(()=>{
    //     console.log(location)
    // },[location])

    return (
        <nav id={`navbar`} className={ styles.navbar }>
            <div className={ styles.logo }>
                <img src={ logo } alt="Logo SuperTennix"/>
            </div>
            { !localStorage.getItem('user') ? <Fragment/> :
                <ul className={ styles.options }  id={`navBar`}>
                    { navLinks.map((link, index) => {
                        return (
                            <li className={ `focusable ${ styles.optionsList } ${setActiveClass(link.url)}` }
                                key={ index }
                                onClick={ () => navTo(link.url) }
                                onKeyDown={(event)=>{handleKeyDown(link.url, event)}}
                            >
                                <NavLink
                                    to={ link.url }
                                    className={ ({isActive}) =>
                                        isActive
                                        ? activeClassName
                                        : undefined }
                                >
                                    <button
                                        className={ ` ${ styles.navButton }  ${ link.name === 'profilo' && name ? styles.circle : '' } `
                                    }>
                                        { link.icon !== ''
                                        ? link.icon
                                        : link.name }
                                    </button>
                                </NavLink>
                            </li>
                        );
                    }) }
                </ul>
            }
        </nav>
    );
};

export default NavbarComponent;
