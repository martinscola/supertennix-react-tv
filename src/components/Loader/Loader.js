import styles from './Loader.module.css';
import LoaderImage from './Loader.svg';
const Loader = ({ size }) => {
    return (
        <div className={styles.spinner}>
            <img src={LoaderImage} width={size} height={size} alt="Loading" />
        </div>
    );
};

export default Loader;
