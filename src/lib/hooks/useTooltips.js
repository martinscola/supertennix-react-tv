import { useState, useEffect } from "react";
import { useBootstrapContext } from '../../lib/context/bootstrap-context';    

export default function useTooltips() {
    const { bootstrap } = useBootstrapContext()

    useEffect(() => {

        if (bootstrap != null) {
            var tooltipPresent = [].slice.call(document.querySelectorAll('.tooltip')).map(function(element) {
                return element.outerHTML = ""
            })
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: "hover",
                })
            });
        }
    }, [bootstrap])
}