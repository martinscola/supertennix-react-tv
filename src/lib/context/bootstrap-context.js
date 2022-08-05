import { createContext, useState, useEffect, useContext } from "react";
import MessageToast from "../../components/toast/toast"

const BootstrapContext = createContext()

BootstrapContext.displayName = "BootstrapContext"

export const BootstrapContextProvider = ({children}) => {
    const [bootstrap, setBootstrap] = useState(null)
    const [toastMessage, setToastMessage] = useState({message: "", visible: false})

    // const value = { bootstrap }
    const value = { bootstrap: bootstrap, toastMessage: setToastMessage }

    useEffect(async () => {
        setBootstrap(await import('../../node_modules/bootstrap/dist/js/bootstrap'))
    }, [])

    useEffect(async () => {
        if (toastMessage.visible == true) {
            setToastMessage({message: toastMessage.message, visible: false, type:toastMessage.type})
        }
    }, [toastMessage])
    
    return (
        <BootstrapContext.Provider value={value}>
            <MessageToast message={toastMessage.message} visible={toastMessage.visible} type={toastMessage.type} />
                {children}
        </BootstrapContext.Provider>
    )
}
export function useBootstrapContext() {
    const context = useContext(BootstrapContext);
    if(!context) {
      throw new Error('useBootstrapContext must be used under <BootstrapContextProvider/>');
    }
    return context;
 }