import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SpatialNavigation from "spatial-navigation-js";
import styles from "./VideoControls.module.css";

const VideoControls = ( props ) => {
    const navigate = useNavigate();
    const [ activity, setActivity ] = useState( true );
    const timer = useRef( null );
    
    const {
        paused,
        currentTime,
        videoDuration,
        timeProgress,
        handleReproduction,
        handleSeekTime,
        title
    } = props;
    
    const handleClose = ( event ) => {
        if ( event.key === "Enter" ) {
            navigate( -1 );
        }
    };
    
    const handleVideo = ( event ) => {
        // console.log(`You're Inside Video Window`);
        // SpatialNavigation.pause();
        if ( event.keyCode === 40 ) {
            SpatialNavigation.focus( styles.bottomRow );
        } else if ( event.keyCode === 38 ) {
            SpatialNavigation.focus( styles.closeButton );
        } else if ( event.keyCode === 37 ) {
            // console.log(`Skip!`);
            SpatialNavigation.pause();
            handleSeekTime( event.key );
            SpatialNavigation.resume();
        } else if ( event.keyCode === 39 ) {
            // console.log(`Skip!`);
            SpatialNavigation.pause();
            handleSeekTime( event.key );
            SpatialNavigation.resume();
        } else if ( event.keyCode === 13 ) {
            handleReproduction();
        } else if ( event.keyCode === 10009 ) {
            console.log( `Video Player Controller Back` );
            handleClose();
        }
    };
    
    const handleActivity = ( event ) => {
        setActivity( true );
    };
    
    useEffect( () => {
        // console.log(videoDuration);
    }, [ videoDuration ] );
    
    /**
     * Timeout to clear the player control overlay
     *
     */
    useEffect( () => {
        timer.current = setTimeout( () => setActivity( false ), 10 * 1000 );
        return () => clearTimeout( timer.current );
    }, [ activity ] );
    
    /**
     *
     * Add Event Listeners for controlling the user inputs
     */
    useEffect( () => {
        window.addEventListener( "keydown", handleActivity );
        window.addEventListener( "mousemove", handleActivity );
        return function RemoveKeydownEventListener() {
            window.removeEventListener( "keydown", handleActivity );
            window.removeEventListener( "mousemove", handleActivity );
        };
    }, [] );
    
    /**
     *
     * Function that adds of removes "hidden" class to Controls overlay
     * according to "activity" state
     *
     */
    useEffect( () => {
        if ( !activity ) {
            SpatialNavigation.focus( "playerWindow" );
            document.querySelector( `.${ styles.topRow }` )
            .classList
            .add( styles.hidden );
            document.querySelector( `.${ styles.bottomRow }` )
            .classList
            .add( styles.hidden );
        } else {
            document.querySelector( `.${ styles.topRow }` )
            .classList
            .remove( styles.hidden );
            document.querySelector( `.${ styles.bottomRow }` )
            .classList
            .remove( styles.hidden );
        }
    }, [ activity ] );
    
    useEffect( () => {
        SpatialNavigation.init();
        SpatialNavigation.add( "upperControls", {
            selector: "#topRow .focusable",
            defaultElement: `#topRow .focusable:first-child`,
            enterTo: "last-focused",
            leaveFor: {
                down: "@playerWindow",
                up: "@bottomControls",
                left: "",
                right: ""
            }
        } );
        SpatialNavigation.add( "playerWindow", {
            selector: `#playerWindow.focusable`,
            defaultElement: "#playerWindow.focusable",
            enterTo: "last-focused",
            leaveFor: {
                up: `@upperControls`,
                left: ``,
                right: ``,
                down: `@bottomControls`
            }
            
        } );
        SpatialNavigation.add( "bottomControls", {
            selector: `#bottomRow .focusable`,
            defaultElement: "#bottomRow .focusable:nth-child(2)",
            enterTo: "last-focused",
            leaveFor: {
                up: `@playerWindow`,
                left: ``,
                right: ``,
                down: `@upperControls`
            }
            
        } );
        SpatialNavigation.makeFocusable();
        SpatialNavigation.focus( "playerWindow" );
        return function cleanup() {
            SpatialNavigation.remove( "upperControls" );
            SpatialNavigation.remove( "playerWindow" );
            SpatialNavigation.remove( "bottomControls" );
        };
    }, [] );
    
    return (
        <div className={ ` ${ styles.videoControlsContainer } ` }>
            <div id={ `topRow` } className={ ` ${ styles.topRow }  ` }>
                <div className={ `focusable ${ styles.closeButton }` }
                    onClick={ handleClose }
                    onKeyDown={ ( event ) => handleClose( event ) }
                >
                    < i className={ ` fal fa-times` } />
                </div>
                <h2> { title ?? "" }</h2>
            </div>
            <div id={ `playerWindow` }
                className={ `focusable ${ styles.playerWindow }` }
                onKeyDown={ ( event ) => handleVideo( event ) }
            />
            <div id={ `bottomRow` } className={ `${ styles.bottomRow } ` }>
                <div className={ styles.progressBar }
                    style={ typeof timeProgress === "number"
                    ? { width: `${ timeProgress }%` }
                    : 0 } />
                <div className={ styles.controlBar }>
                    <div
                        className={ styles.timeWidget }>{ currentTime &&
                        videoDuration !== Infinity &&
                        (`${ currentTime } / ${ new Date(
                        videoDuration * 1000 ).toISOString()
                        .substring( 11, 19 ) }`) }
                    </div>
                    <div className={ styles.buttonGroup }>
                        { currentTime &&
                        videoDuration !== Infinity &&
                            <div
                                onClick={ () => handleSeekTime( "ArrowLeft" ) }
                                className={ `focusable ${ styles.videoControlButton }` }
                            >
                                <i className="fas fa-backward fa-5x" />
                            </div> }
                            <div
                            onClick={ handleReproduction }
                            className={ `focusable ${ styles.videoControlButton }` }
                            >
                                { !paused ?
                                    <i className="fas fa-pause fa-5x" /> :
                                    <i className="fas fa-play fa-5x" />
                                }
                            </div>
                        { currentTime &&
                            videoDuration !== Infinity &&
                            <div
                                onClick={ () => handleSeekTime( "ArrowRight" ) }
                                className={ `focusable ${ styles.videoControlButton }` }
                            >
                                <i className="fas fa-forward fa-5x" />
                            </div> }
                    </div>
                    <div className={ styles.videoQualityWidget } />
                </div>
            </div>
        </div>
    );
};

export default VideoControls;