import styles from './liveBadgeComponent.module.css';

const LiveBadgeComponent = (text = "live") => {
    return (
        <div className={ styles.liveBadge }>
            <i className={ `fas fa-circle fa-xs ${ styles.liveIcon }` }/>
            <p>{ text.text.toUpperCase() }</p>
        </div>
    );
};

export default LiveBadgeComponent;
