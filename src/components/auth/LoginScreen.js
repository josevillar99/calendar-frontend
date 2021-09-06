import React, { useState } from 'react';
import { login } from '../../requests/login';
import './login.css';
import Cookies from 'universal-cookie';


export const LoginScreen = ({ history }) => {

    const cookies = new Cookies();

    const [formValues, setFormValues] = useState({
        email: '',
        pass: ''
    })

    const checkLogin = async (e) => {
        e.preventDefault()
        // console.log(formValues)
        if (formValues.email !== '' && formValues.pass !== '') {
            const response = await login(formValues.email, formValues.pass);
            // console.log(response);
            if (response !== 'false') {
                if (Array.isArray(response)) {
                    cookies.set('token', response);
                    history.replace(`/`);
                } else {
                    cookies.set('token', response);
                    history.replace(`/`);
                }
            }
        }
    }


    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-12 login-form-1">
                    <h3>Login</h3>
                    <form>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                value={formValues.email}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    email: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={formValues.pass}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    pass: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Login"
                                onClick={checkLogin}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}