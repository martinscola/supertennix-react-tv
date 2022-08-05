import { useEffect, useState } from 'react';

// 3RD PARTY
import SpatialNavigation from 'spatial-navigation-js';
import { Outlet } from 'react-router-dom';


// COMPONENTS
import NavbarComponent from './components/NavbarComponent/NavbarComponent';

// RESOURCES
import { TokensProvider } from './lib/context/tokens-context';

// STYLING
import './App.css';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    
    const handleSpecialButtons = (event) => {
        switch ( event.keyCode ) {
            case 65376: // Done
                // console.log('%cDone', `color: lightblue`);
                SpatialNavigation.resume();
                break;
            case 65385: // Cancel
                // console.log(`%cCancel`, `color:orange`);
                SpatialNavigation.resume();
                break;
            case 10182: //EXIT
                // console.log(`%cGoodbye`, `color: deeppink`);
                window.tizen.application.getCurrentApplication().exit();
                break;
        }
    };
    
    // console.log((typeof tizen === 'undefined'));
    if ( typeof window.tizen !== 'undefined' ) {
        var value = window.tizen.tvinputdevice.getSupportedKeys();
        // console.log(value);
        window.tizen.tvinputdevice.registerKeyBatch([
            'MediaPlay',
            'MediaPause',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9' ]);
    }
    
    
    /**
     * Uncomment to review Spatial Navigation Behavior
     */
      // const validEvents = [
      //     'sn:willmove',
      //     'sn:willunfocus',
      //     'sn:unfocused',
      //     'sn:willfocus',
      //     'sn:focused',
      //     'sn:enter-down',
      //     'sn:enter-up',
      //     'sn:navigatefailed'
      // ];
      //
      // const eventHandler = function(evt) {
      //     console.log(evt.type, evt.target, evt.detail);
      // };
      //
      // useEffect(()=>{
      //     validEvents.forEach(function(type) {
      //         window.addEventListener(type, eventHandler);
      //     });
      //     return function cleanup(){
      //         validEvents.forEach(function(type) {
      //             window.removeEventListener(type, eventHandler);
      //         });
      //     }
      //
      // },[])

    useEffect(()=>{
        SpatialNavigation.init();
    },[])

    useEffect(() => {
        window.addEventListener('keydown', handleSpecialButtons);
        return function removeHandleButtonEL() {
            document.body.removeEventListener('keydown', handleSpecialButtons);
        };
    }, []);

    return (
        <TokensProvider>
            <main className="main">
                { user ? <NavbarComponent profile={ user } /> : null}
                <Outlet context={[user, setUser]}/>
            </main>
        </TokensProvider>
    );
}

export default App;
