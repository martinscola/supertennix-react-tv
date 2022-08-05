import { useEffect, useRef, useState } from 'react';
// COMPONENTS
import VideoControls from './VideoControls';

// HELPERS
import useInterval from '../../lib/hooks/useInterval';
// 3RD PARTY
import videojs from 'video.js';
// CSS
import 'video.js/dist/video-js.css';
import styles from './VideoJS.module.css';

export const VideoJS = (props) => {
    const [ currentTime, setCurrentTime ] = useState('');
    const [ paused, setPaused ] = useState(false);
    const [ remainingTime, setRemainingTime ] = useState('');
    const [ timeProgress, setTimeProgress ] = useState(0);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const {
        options,
        onReady,
        videoDuration,
        videoInfo,
    } = props;

    const handleReproduction = () => {
        playerRef.current.paused()
        ? playerRef.current.play()
        : playerRef.current.pause();
        setPaused(playerRef.current.paused());
        return playerRef.current.paused();
    };

    const handleTimeSeek = (direction) => {

        if ( playerRef.current.cache_.duration === Infinity ) {
            // console.log(`Live Video. No Skip for You!`);
            return;
        }
        if ( direction === 'ArrowRight' ) {
            playerRef.current.currentTime(
                playerRef.current.currentTime() + 30);
        } else if ( direction === 'ArrowLeft' ) {
            playerRef.current.currentTime(
                playerRef.current.currentTime() - 30);
        }
    };
    
    /**
     * Initializing VideoJS
     */
    useEffect(() => {
        // make sure Video.js player is only initialized once
        if ( !playerRef.current ) {
            const videoElement = videoRef.current;
            if ( !videoElement ) return;

            const player = playerRef.current = videojs(videoElement, options,
                () => {
                    // console.log('player is ready');
                    onReady && onReady(player);
                });

        } else {
            // you can update player here [update player through props]
            const player = playerRef.current;
            player.src(options.sources[0]);
            player.on('ended', () => {
            });
        }
    }, [ options, videoRef, onReady ]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;
        return () => {
            if ( player ) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [ playerRef ]);

    /**
     *
     * Interval that retrieves and sets current and Remaining Time for the Control overlay
     *
     */
    useInterval(() => {
            let actualTime;
            let timeLeft;
            if ( playerRef ) {
                actualTime = new Date(
                    playerRef.current.currentTime() * 1000).toISOString()
                .substring(11, 19);
                if ( videoDuration !== Infinity ) {
                    timeLeft = new Date(
                        playerRef.current.remainingTime() * 1000).toISOString()
                    .substring(11, 19);
                }
            }
            setCurrentTime(actualTime);
            setRemainingTime(timeLeft);
            setTimeProgress(playerRef.current.currentTime() * 100 / videoDuration);
            // console.log(actualTime);
        }
        ,
        500,
    );

    useEffect(() => {
        // console.log(videoInfo);
    }, [ videoInfo ]);

    return (
        <div className={ styles.videoContainer } data-vjs-player>
            <VideoControls
                paused={ paused }
                currentTime={ currentTime }
                videoDuration={ videoDuration }
                timeProgress={ timeProgress }
                remainingTime={ remainingTime }
                handleReproduction={ handleReproduction }
                handleSeekTime={ handleTimeSeek }
                title={ videoInfo.title }
            />
            <video-js ref={ videoRef }
                      className="video-js vjs-fluid vjs-big-play-centered"/>
        </div>
    );
}

export default VideoJS;