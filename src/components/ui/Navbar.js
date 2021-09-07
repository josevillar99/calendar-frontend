import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';


export const Navbar = (props) => {

    const { id, user, history } = props;

    const cookies = new Cookies();

    const salir = () => {
        cookies.remove('token');
        window.location.reload();
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">{user ? user.name : ''}</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    {/* className={`box ${isBoxVisible ? "" : "hidden"}`} */}
                    <li className={`nav-item ${id == 'calendar' ? 'active' : ''} `}>
                        <Link to="/" className="nav-link">Calendar</Link>
                    </li>
                    <li className={`nav-item ${id == 'filtros' ? 'active' : ''} `}>
                        <Link to="/filtros" className="nav-link">Filtros</Link>
                    </li>
                    {user.id == 5 &&
                        <li clasName={`nav-item ${id == 'admin' ? 'active' : ''} `}>
                            <Link to="/" className={`nav-link" `} >Admin</Link>
                        </li>
                    }
                </ul>
                <span>
                    <button className="btn btn-outline-danger" onClick={salir}>
                        <i className="fas fa-sign-out-alt"></i> Salir
                    </button>
                </span>
            </div>
        </nav>
    )
}
