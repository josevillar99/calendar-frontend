import React, { useEffect, useState } from 'react'
import { Navbar } from '../ui/Navbar'
import { AgendaContainer, FilterRow, Table } from './FiltrarElements'

import Cookies from 'universal-cookie';

import * as reqFiltros from '../../requests/filtros';
import * as reqConceptos from '../../requests/concepto';
import * as reqLogin from '../../requests/login';


import moment from 'moment';
import 'moment/locale/es';
import AOS from 'aos';


moment.locale('es');


const Filtros = ({ history }) => {

    const [user, setUser] = useState({ id: '', name: '' })
    const cookies = new Cookies();

    const [filter, setFilter] = useState('0')
    const [filtros, setfiltros] = useState({
        date1: '',
        date2: '',
        number1: '',
        number2: '',
        concepto: '',
    })
    const [data, setData] = useState([{}])
    const [conceptos, setConceptos] = useState([{}])

    useEffect(() => {
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        getData();
    }, [filtros])

    useEffect(() => {
        AOS.init({
            duration: 2000
        });
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        getTokenId();
    }, [])


    const getTokenId = async () => {
        if (cookies.get('token')) {
            let res = await reqLogin.getTokenId(cookies.get('token'), cookies, history);
            // console.log(res)
            setUser(res);
            getConceptos(res);
            setTimeout(() => {
                getData();
            }, 400);
        }
    }

    const getConceptos = async (user) => {
        const response = await reqConceptos.getAll();
        if (response) setConceptos(response);
    }

    const onChangeFilter = (e) => {
        setFilter(e.target.value);
        getData(e.target.value);
    }

    const getData = async (e) => {
        let sql = "";
        let val = 0;
        if (e != undefined) val = e
        else val = filter;
        // console.log({ filtros })
        console.log(user)

        switch (val) {
            case '0':
                sql = 'SELECT e.*, c.nombre FROM eventos AS e LEFT JOIN conceptos c ON e.concepto = c.id where activo = 1 and id_usuario = ' + user.id + ' ORDER BY DATE DESC;'
                break;
            case '1':
                if (filtros.date1 != '' && filtros.date2 === '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && DATE >= "' + filtros.date1 + '" and id_usuario = ' + user.id + ' ORDER BY DATE DESC;';
                } else if (filtros.date1 === '' && filtros.date2 != '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && DATE <= "' + filtros.date2 + '" and id_usuario = ' + user.id + ' ORDER BY DATE DESC;';
                } else if (filtros.date1 != '' && filtros.date2 != '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && DATE >= "' + filtros.date1 + '" && DATE <= "' + filtros.date2 + '" and id_usuario = ' + user.id + ' ORDER BY DATE DESC;';
                } else sql = false;
                break;
            case '2':
                if (filtros.number1 != '' && filtros.number2 != '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && total >= ' + filtros.number1 + ' && total <= ' + filtros.number2 + ' and id_usuario = ' + user.id + ' ORDER BY DATE DESC;'
                } else if (filtros.number1 != '' && filtros.number2 === '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && total >= ' + filtros.number1 + '  and id_usuario = ' + user.id + ' ORDER BY DATE DESC;'
                } else if (filtros.number1 === '' && filtros.number2 != '') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && total <= ' + filtros.number2 + ' and id_usuario = ' + user.id + ' ORDER BY DATE DESC;'
                } else sql = false;
                break;
            case '3':
                if (filtros.concepto != '0') {
                    sql = 'Select e.*, c.nombre from eventos e LEFT JOIN conceptos c ON e.concepto = c.id'
                        + ' where activo = 1 && c.id = ' + filtros.concepto + ' and id_usuario = ' + user.id + ' ORDER BY DATE DESC;'
                } else sql = false;
                break;
        }
        if (sql != false) {
            // console.log(sql)
            const response = await reqFiltros.getEventosBy(sql);
            // console.log(response)
            if (response) setData(response);
            else setData([{}]);
        } else setData([{}]);
    }

    return (
        <>
            <Navbar id='calendar' user={user} />

            <AgendaContainer>
                <div className="row">
                    <FilterRow className="col-md-4 col-12">
                        <div className="form-group">
                            <label>Filtros</label>
                            <select className="form-control"
                                onChange={onChangeFilter}
                            >
                                <option value="" selected disabled>Selecciona...</option>
                                <option value="0">Mostrar Todo</option>
                                <option value="1">Filtrar por Fechas</option>
                                <option value="2">Filtrar por Dinero</option>
                                <option value="3">Filtrar por Concepto</option>
                            </select>
                        </div>
                    </FilterRow>

                    <FilterRow className="col-md-4 col-12">
                        {filter === '1' &&
                            <div className="form-group">
                                <label>Desde</label>
                                <input className="form-control" type="date"
                                    value={filtros.date1} onChange={(e) => setfiltros({
                                        ...filtros, ['date1']: e.target.value
                                    })}>
                                </input>
                            </div>
                        }
                        {filter === '2' &&
                            <div className="form-group">
                                <label>Desde</label>
                                <input className="form-control" type="number"
                                    value={filtros.number1} onChange={(e) => setfiltros({
                                        ...filtros, ['number1']: e.target.value
                                    })}
                                >
                                </input>
                            </div>
                        }
                        {filter === '3' &&
                            <div className="form-group">
                                <label>Concepto</label>
                                <select className="form-control"
                                    onChange={(e) => setfiltros({
                                        ...filtros, ['concepto']: e.target.value
                                    })}
                                >
                                    <option value="0" selected disabled>Selecciona...</option>
                                    {conceptos && conceptos.map((item, i) => {
                                        return (
                                            <option value={item.id}>{item.nombre}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        }

                    </FilterRow>

                    <FilterRow className="col-md-4 col-12">
                        {filter === '1' &&
                            <div className="form-group">
                                <label>Hasta</label>
                                <input className="form-control" type="date"
                                    value={filtros.date2} onChange={(e) => setfiltros({
                                        ...filtros, ['date2']: e.target.value
                                    })}>
                                </input>
                            </div>
                        }
                        {filter === '2' &&
                            <div className="form-group">
                                <label>Hasta</label>
                                <input className="form-control" type="number"
                                    value={filtros.number2} onChange={(e) => setfiltros({
                                        ...filtros, ['number2']: e.target.value
                                    })}
                                >
                                </input>
                            </div>
                        }
                    </FilterRow>

                </div>

                <Table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Titulo</th>
                            <th scope="col">Concepto</th>
                            <th scope="col">Total</th>
                            <th scope="col">Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && !Array.isArray(data) &&
                            <tr>
                                <td colSpan={4} className="tableEmpty">
                                    <h3>No se encuentran datos</h3>
                                </td>
                            </tr>
                        }

                        {data &&
                            Array.isArray(data) &&
                            data.map((item, i) => {
                                if (data.length === 1 && item.title === undefined || data.length == 0) return (
                                    <tr>
                                        <td colSpan={4} className="tableEmpty">
                                            <h3>No se encuentran datos</h3>
                                        </td>
                                    </tr>
                                )
                                if (item.title === '' || item.title === undefined) return (<></>);
                                return (
                                    <tr key={i} className={` ${item.total.replace(',', '.') > 0 ? 'verde' : 'rojo'} `}>
                                        {/* var date = moment("2014-02-27T10:00:00").format('DD-MM-YYYY'); */}
                                        <td>{moment(item.date).format('DD [de] MMMM [del] YYYY')}</td>
                                        <td>{item.title}</td>
                                        <td>{item.nombre}</td>
                                        {/* <td>{item.total}</td> */}
                                        <td>{item.total}</td>
                                        <td></td>
                                    </tr>

                                )
                            })
                        }
                    </tbody>
                </Table>

            </AgendaContainer>
        </>
    )
}

export default Filtros
