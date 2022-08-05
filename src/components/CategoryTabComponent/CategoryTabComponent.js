import { useEffect, useState } from 'react';
import { T } from "../../lib/helpers/Translation"
import styles from "./CategoryTabComponent.module.css"

const CategoryTabComponent = ( { widget, title = 'test',  }) => {
    const [arrayPosition, setArrayPosition] = useState(null)
    const [isLoading, setLoading] = useState(true)

    const backgroundColor = [
        {
            borderImage: `linear-gradient(270deg, rgba(246, 161, 0, 0.3) 0%, rgba(249, 181, 0, 0.8) 34%, var(--360sports-orange-dark) 100%) 100`,
            backgroundImage: `linear-gradient(to left, rgba(249, 181, 0, 0.8) 0%, #f07e00 100%)`
        },
        {
            borderImage: `linear-gradient(270deg, rgba(250, 95, 76, 0.3) 0%, rgba(247, 81, 64, 0.8) 33%, var(--360sports-red-bright) 100%) 100`,
            backgroundImage: `linear-gradient(to right, rgba(250, 95, 76, 0.8) 0%, var(--360sports-red-bright) 100%)`
        },
        {
            borderImage: `linear-gradient(270deg, rgba(188, 225, 30, 0.3) 0%, rgba(173, 216, 25, 0.8) 35%, var(--360sports-green-bright) 100%) 100`,
            backgroundImage: `linear-gradient(to right, rgba(188, 225, 30, 0.8) 0%, var(--360sports-green-bright) 100%)`
        },
        {
            borderImage: `linear-gradient(270deg, rgba(0, 147, 214, 0.3) 0%, rgba(0, 147, 214, 0.8) 38%, var(--360sports-lightblue) 100%) 100`,
            backgroundImage: `linear-gradient(to right, rgba(0, 197, 237, 0.5) 0%, var(--360sports-lightblue) 100%)`
        }
    ];
    useEffect(()=>{
        let arrayNo = (Math.floor(Math.random() * 4))
        setArrayPosition(arrayNo)
        setLoading(false)
    },[])

 return(
        <div className={styles.tabContainer}
            style={{
                    borderImage: `${widget === 'ContinueWatchCarousel' ? backgroundColor[0].borderImage : backgroundColor[arrayPosition].borderImage}`
            }}
        >
            <p className={`${styles.tabText} text24Regular` }
                style={{
                    backgroundImage: `${widget === 'ContinueWatchCarousel' ? backgroundColor[0].backgroundImage : backgroundColor[arrayPosition].backgroundImage}`}}
            >
                { T(title) }
            </p>
        </div>
    )
}

export default CategoryTabComponent;