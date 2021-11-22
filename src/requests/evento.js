import axios from "axios";
import variables from "../variables.json";

export const AddEvento = async (data1, data2, data3) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'newEvento');
    formDataConvert.append("title", data1.title);
    formDataConvert.append("start", data1.start);
    formDataConvert.append("end", data1.end);
    formDataConvert.append("concepto", data1.concepto.value);
    formDataConvert.append("total", data1.total);
    formDataConvert.append("dateStart", data3);
    formDataConvert.append("id_usuario", data2);


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

export const GetEventos = async (data) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getEventos');
    formDataConvert.append("id", data);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        // console.log(response)
        if (response.data) {
            return response.data;
        }
        return false;
    } catch (a) {
        console.log(a)
        return false;
    }
};

export const UpdateEvento = async (data1, data2) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'updateEvento');
    formDataConvert.append("title", data1.title);
    formDataConvert.append("start", data1.start);
    formDataConvert.append("end", data1.end);
    formDataConvert.append("concepto", data1.concepto.value);
    formDataConvert.append("total", data1.total);
    formDataConvert.append("id", data1.id);
    formDataConvert.append("dateStart", data2);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        console.log(response)
        if (response.data == 0) {
            return true;
        }
        return false;
    } catch (a) {
        console.log(a)
        return false;
    }
};

export const DeleteEvento = async (data) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'deleteEvento');
    formDataConvert.append("id", data);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        
        if (response.data) {
            return response.data;
        }
        return false;
    } catch (a) {
        console.log(a)
        return false;
    }
};

export const getTotal = async (data) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'getTotal');
    formDataConvert.append("mes", data);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        // console.log(response)
        if (response.data) {
            return response.data;
        }
        return false;
    } catch (a) {
        console.log(a)
        return false;
    }
}