import axios from "axios";
import variables from "../variables.json";


export const getEventosBy = async (sql) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getEventosBy');
    formDataConvert.append("sql", sql);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        // console.log(response)
        if (response.data) {
            return response.data;
        }
    } catch (a) {
        console.log(a)
        return '1';
    }
};