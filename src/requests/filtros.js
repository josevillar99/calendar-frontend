import axios from "axios";
import variables from "../variables.json";


export const getEventosBy = async (sql1, sql2) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getEventosBy');
    formDataConvert.append("sql1", sql1);
    formDataConvert.append("sql2", sql2);

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