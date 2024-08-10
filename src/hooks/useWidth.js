import { useState, useEffect } from 'react'

export function useWidth() {
    const [width, setMinWidth] = useState({ minWidth: "130px" });

    //Función de controlar el tamaño de las cartas del set al inicio
    const cambiarMinWidth = () => {
        switch (true) {
            case (window.innerWidth < 600):
                setMinWidth({ minWidth: "75px" });
                break;

            case (window.innerWidth < 900 && window.innerWidth > 600):
                setMinWidth({ minWidth: "125px" });
                break;
        }
    }

    useEffect(() => { //Controlar tamaño de pantalla al inicio
        cambiarMinWidth();
    }, []);

    return { width };
}

