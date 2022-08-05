import { useEffect, useState, useRef } from 'react';
// 3RD PARTY
import videojs from 'video.js';
import { useLocation, useNavigate } from 'react-router-dom';
// COMPONENTS
import VideoJS from './VideoJS';
import Loader from '../Loader/Loader';
// HELPERS
import useInterval from '../../lib/hooks/useInterval';
import {
    baseAPIURI,
    videoRefreshTimes,
    apiEndpoint,
} from '../../lib/utils/constants';
import { videoHelpers } from '../../lib/helpers/videoHelpers';
import { fetchWrapper } from '../../lib/helpers/fetch-wrapper';
// CSS
import styles from './VideoPlayerComponent.module.css';
import NoVideoComponent from '../NoVideoComponent/NoVideoComponent';

window.header = '';
const VideoPlayerComponent = () => {
    const [ content, setContent ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);
    const [ videoDuration, setVideoDuration ] = useState(null);
    const [ videoJsOptions, setVideoJsOptions ] = useState({});
    const [ videoInfo, setVideoInfo ] = useState(null);
    const [ error, setError ] = useState('');

    const state = useLocation();
    const id = state.state ? state.state.id : null;
    const playerRef = useRef(null);
    const navigate = useNavigate();

    /**
     * Function to handle Player's behavior
     * @param player
     */
    const handlePlayerReady = (player) => {
        playerRef.current = player;
        // you can handle player events here
        player.on('waiting', () => {
            // console.log('player is waiting');
        });
        player.on('dispose', () => {
            // console.log('player will dispose');
        });
        player.on('ended', () => {
            navigate(-1);
        });
        player.on('loadedmetadata', function() {
            setVideoDuration(player.cache_.duration);
        });
    };

    /**
     * updates the request url for the live stream with the token retrieved
     * from video Refresh Token
     * @param options
     * @returns {*}
     */
    videojs.Vhs.xhr.beforeRequest = function(options) {
        if ( window.header !== '' ) {
            options.uri = options.uri.replace(/\/(token=.*?)\//gi,
                '/' + window.header + '/');
        }
        return options;
    };

    /**
     *
     * useEffect function to retrieve and update video token for live stream
     *
     */
    useEffect(async() => {
        const data = await fetchWrapper.get(
            `${ baseAPIURI }${ apiEndpoint }/content/${ id }`);
        console.log(data.data);
        data.data.access === false &&
        setError(`Questo contenuto è disponibile solo per utenti abbonati`);
        data.data.status === 'pending' &&
        setError('La trasmissione non è ancora iniziata');
        data.data.videos.length === 0 && data.data.status !== 'pending' &&
        setError('Nessun video disponibile');
        data.data.videos.length > 0 && setContent(data.data);
        // console.log('VideoPlayerComponent, line 79', data.data);
        data.data.videos.length > 0 &&
        setVideoInfo(data.data);
        window.header = data.data.videos[0].header;

    }, []);

    /**
     * Interval used to fetch and set the new Video header for
     * the continuous play of the video
     */
    useInterval(async() => {
        // console.log(content, id);
        if ( content && id ) {
            const data = new URLSearchParams(
                {
                    'path': content.videos[0].hls,
                    'content_id': content.id_content,

                });
            if ( content.videos[0].tag === 'live' ) {
                const newHeader = await videoHelpers.videoRefreshToken(data);
                window.header = newHeader.data.header;
            }
        }
    }, 30 * 1000);

    useEffect(() => {
        // console.log(content);
        setVideoJsOptions({
            autoplay: true,
            controls: false,
            fluid: true,
            muted: false,
            preload: 'auto',
            techOrder: [ 'html5' ],
            html5: {
                vhs: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            },
            sources: [
                {
                    src: content ? content.videos[0].hls : '',
                  // src: `https://360sports-l3-vod.secure.footprint.net/VMFS1/FILES/public/videos/360sports/205768/hls/manifest.m3u8`,
                    type: 'application/x-mpegURL',
                } ],
        });
        setLoading(false);

    }, [ content ]);

    return (
        <div className={ styles.videoContainer }>
            { isLoading && <Loader size={ 300 }/> }
            { !isLoading &&
                videoInfo &&
                <VideoJS options={ videoJsOptions }
                        onReady={ handlePlayerReady }
                        videoDuration={ videoDuration && videoDuration }
                        videoInfo={ videoInfo }
                /> }
            { !isLoading && error &&
                <NoVideoComponent message={ error }/> }


        </div>
    );
};

export default VideoPlayerComponent;
