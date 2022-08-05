import { useEffect } from "react";
const useIntersectionObserver = ({
    root,
    target,
    onIntersect,
    threshold = 0.05,
    rootMargin = "0px"
}) => {
    useEffect(() => {
        const observer = new IntersectionObserver(onIntersect, {
            root,
            rootMargin,
            threshold
        });
        const current = target.current;
        observer.observe(current);
        return () => {
            // console.log(current)
            // console.log(`Target ${current.classList} is not visible anymore`)
            observer.unobserve(current);
        };
    });
};
export default useIntersectionObserver;