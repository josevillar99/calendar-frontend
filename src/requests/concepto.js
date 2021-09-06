import axios from "axios";
import variables from "../variables.json";

export const getAll = async () => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getAllConceptos');
    const response = await axios.post(
        variables.serverURLRoot,
        formDataConvert,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    if (response.data) {
        return response.data;
    }
    throw response.data;
};

export const addConcepto = async (data) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'addConcepto');
    formDataConvert.append("nombre", data);
    const response = await axios.post(
        variables.serverURLRoot,
        formDataConvert,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    // console.log(response)
    return response.data;


};
