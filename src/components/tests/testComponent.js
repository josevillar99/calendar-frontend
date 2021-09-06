import React, { useEffect } from 'react'

import axios from "axios";
import variables from "../../variables.json";

const TestComponent = () => {

    useEffect(() => {
        prueba1();
    }, [])

    const prueba1 = async () => {
        // console.log('1')
        const formDataConvert = new FormData();
        // formDataConvert.append("evento", 'getAllConceptos');
        const response = await axios.post(
            variables.serverURLRoot,
            formDataConvert,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(response)
    }

    return (
        <div>
            No se muestra nada
        </div>
    )
}

export default TestComponent
