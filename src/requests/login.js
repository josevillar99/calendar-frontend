import axios from "axios";
import variables from "../variables.json";


export const login = async (email, pass) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'login');
    formDataConvert.append("email", email);
    formDataConvert.append("pass", pass);


    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        // console.log(response);
        if (response.data) {
            return response.data;
        }
    } catch (a) {
        console.log(a)
        return '1';
    }
};

export const checkToken = async (token, cookies, history) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'checkToken');
    formDataConvert.append("token", token);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        // console.log(response);
        // return response;
        if (response.data) {
            // console.log(response.data)
            if (response.data.id !== 1 && response.data.id !== 0) {
                cookies.remove('token');
                history.replace(`/login`);
            } else return 'ben';
        }
    } catch (a) {
        return 'false';
    }
};

export const getTokenId = async (token, cookies, history) => {
    const formDataConvert = new FormData();
    formDataConvert.append("evento", 'checkToken');
    formDataConvert.append("token", token);

    try {
        const response = await axios.post(
            variables.serverURLRoot + '/index.php',
            formDataConvert
        );
        if (response) if (response.data.id == 1) return { id: 1, name: 'JoseV' };
        else if (response.data.id == 0) return { id: 0, name: 'DEMO' };
        else {
            cookies.remove('token');
            history.replace(`/login`);
        }
    } catch (a) {
        return 'false';
    }
}
