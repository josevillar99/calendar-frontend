import axios from "axios";
import variables from "../variables.json";

export const getAll = async (id) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getAllConceptos');
    formDataConvert.append("id", id);
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

export const addConcepto = async (data1, data2) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'addConcepto');
    formDataConvert.append("nombre", data1);
    formDataConvert.append("user", data2);
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
