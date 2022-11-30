import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
import Cookies from 'universal-cookie';

import { Navbar } from '../ui/Navbar';
import { messages, Toast } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import * as reqEvento from '../../requests/evento';
import * as reqConcepto from '../../requests/concepto';
import * as reqLogin from '../../requests/login';

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';

import AOS from 'aos';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';

moment.locale('es');



const localizer = momentLocalizer(moment);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px',

        maxWidth: '80%',
        maxHeight: '80%',
    }
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours'); // 3:00:00
const nowPlus1 = now.clone().add(3, 'hours');

const initEvent = {
    title: '',
    notes: '',
    total: 0,
    start: new Date(Date.parse(now.toDate())),
    end: new Date(Date.parse(nowPlus1.toDate())),
    dateStart: null
}

const demoEvents = [
    {
        title: 'Compra',
        notes: '1223231232',
        total: -21,
        start: new Date(Date.parse(now.clone().add(2, 'hours').toDate())),
        end: new Date(Date.parse(now.clone().add(3, 'hours').add(22, 'minutes').toDate())),
        dateStart: null,
        concepto: 9,
        nombre_concepto: 'FISIO'
    },
    {
        title: 'Compra',
        notes: '1223231232',
        total: -35.43,
        start: new Date(Date.parse(now.toDate())),
        end: new Date(Date.parse(nowPlus1.toDate())),
        dateStart: null,
        concepto: 6,
        nombre_concepto: 'COMPRA ONLINE'
    },
    {
        title: 'Compra',
        notes: '1223231232',
        total: 120,
        start: new Date(Date.parse(now.clone().add(1, 'days').toDate())),
        end: new Date(Date.parse(now.clone().add(1, 'days').add(15, 'hours').toDate())),
        dateStart: null,
        concepto: 3,
        nombre_concepto: 'CAMARERO'
    },
]


export const CalendarScreen = ({ history }) => {


    const [user, setUser] = useState({ id: '', name: '' })
    const cookies = new Cookies();

    useEffect(() => {
        AOS.init({
            duration: 2000
        });
        checkTokenAvaliable();
        getTokenId();
    }, []);

    const checkTokenAvaliable = async () => {

        if (cookies.get('token')) {
            let res = await reqLogin.checkToken(cookies.get('token'), cookies, history);
            // console.log(res)
        } else {
            // console.log('FALSE')
            history.replace(`/login`);
        }
    }

    const getTokenId = async () => {
        if (cookies.get('token')) {
            let res = await reqLogin.getTokenId(cookies.get('token'), cookies, history);
            console.log(res)
            setUser(res);
            getAllConceptos(res);
            getAllEventos(res);
        }
    }

    const [activeEvent, setActiveEvent] = useState(null)
    const views = { month: true, agenda: true, week: true };
    const [events, setEvents] = useState([{}]);
    const [optionsConcepto, setOptionsConcepto] = useState([]);

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');
    const [resumen, setResumen] = useState('Desconocido')
    const [month, setMonth] = useState(moment().format("MMM").substr(0,3))
    const [year, setYear] = useState(moment().format("YYYY"));
    const [openModal, setOpenModal] = useState(false)
    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [titleValid, setTitleValid] = useState(true);
    const [conceptoValid, setConceptoValid] = useState(true);
    const [formValues, setFormValues] = useState(initEvent);
    const { notes, title, start, end, concepto, total } = formValues;

    useEffect(() => {
        getTotal();
    }, [month]);

    const onDoubleClick = (e) => {
        setOpenModal(true);
    }

    const onSelectEvent = (e) => {
        // console.log(e)
        setFormValues({
            ...e,
            concepto: {
                value: e.concepto,
                label: e.nombre_concepto
            }
        })
        setActiveEvent(e)
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        setActiveEvent(null);
    }

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: event.total.replace(',', '.') > 0 ? 'green' : event.total.replace(',', '.') < 0 ? 'red' : 'gray',
            borderRadius: '3px',
            display: 'inline-block',
            color: 'white',

            border: 'none',
            borderColor: 'transparent'
        }

        return {
            style
        }
    };

    const getAllEventos = async (user) => {
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        // console.log(user)

        // if (user.id === 0) {
        //     setEvents(demoEvents)
        // } else {
        const response = await reqEvento.GetEventos(user.id);
        if (response && Array.isArray(response)) {
            response.map((item, i) => {
                item.start = new Date(Date.parse(item.start));
                item.end = new Date(Date.parse(item.end));
            })
            setEvents(response);
        } else {
            setEvents([{}])
        }
        // }
    }

    const getAllConceptos = async (user) => {
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        let response = '';
        if (user){ response = await reqConcepto.getAll(user.id, cookies.get('token'), cookies, history);
        }else response = await reqConcepto.getAll(1, cookies.get('token'), cookies, history);
        let arrConceptos = [];

        if (response && Array.isArray(response)) {
            response.map((item, i) => {
                arrConceptos.push({
                    value: item.id,
                    label: item.nombre
                })
            })
        }
        setOptionsConcepto(arrConceptos);
    }

    const getTotal = async () => {
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        const response = await reqEvento.getTotal(month, year);
        if(response) setResumen(Math.round((response.total) * 100) / 100);
    }

    //MODAL
    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    }

    const closeModal = () => {
        setOpenModal(false);
        setActiveEvent(null)
        setFormValues(initEvent);
        setConceptoValid(true);
        setTitleValid(true);
    }

    const handleStartDateChange = (e) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = (e) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = async (e) => {

        e.preventDefault();

        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }

        const momentStart = moment(start);
        const momentEnd = moment(end);

        const startDate = moment(start).format("YYYY-MM-DD");

        if (momentStart.isAfter(momentEnd)) {
            return Swal.fire('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        if (concepto && concepto.value) {
            // console.log(concepto)
            if (concepto.value == 0) {
                return setConceptoValid(false);
            }
        } else {
            return setConceptoValid(false);
        }

        setConceptoValid(true);



        // if (user.id == 0) {
        //     Swal.fire(
        //         'Denegado',
        //         'No tienes permisos',
        //         'warning'
        //     )
        // } else {
        if (activeEvent) {
            const res = await reqEvento.UpdateEvento(formValues, startDate);
            console.log('11-> ' + res)
            if (res) {
                Toast.fire({
                    icon: 'success',
                    title: 'Actualizado correctamente.'
                })
            }
        } else {
            const res = await reqEvento.AddEvento(formValues, user.id, startDate, cookies.get('token'), cookies, history);
            console.log(res)
            if (res) {
                Toast.fire({
                    icon: 'success',
                    title: 'Añadido correctamente.'
                })
            }
        }

        getAllEventos(user);

        setTitleValid(true);
        closeModal();

        // }
    }

    //cambio del input del option selected
    const handleChange = async (e) => {
        if (!cookies.get('token')) {
            history.replace(`/login`);
            return;
        }
        if (e) {
            if (e.__isNew__) {
                const res = await reqConcepto.addConcepto(e.label, user.id);
                setFormValues({
                    ...formValues,
                    concepto: {
                        value: res,
                        label: e.label
                    }
                })
                getAllConceptos();
            } else {
                setFormValues({
                    ...formValues,
                    concepto: e
                })
            }
        } else {
            setFormValues({
                ...formValues,
                concepto: {
                    value: 0,
                    label: 'Select...'
                }
            })
        }
    }

    const deleteEvento = async () => {
        if (user.id == 0) {
            Swal.fire(
                'Denegado',
                'No tienes permisos',
                'warning'
            )
        } else {
            const res = await reqEvento.DeleteEvento(activeEvent.id)
            if (res == 'true') {
                Swal.fire('Eliminado', '', 'success',)
                getAllEventos(user)
            }
        }
    }

    const handleOpenModal = () => {
        
        setFormValues({
            ...formValues,
            start: now.toDate(),
            end: nowPlus1.toDate()
        })
        setDateStart(now.toDate())
        setDateEnd(nowPlus1.toDate())
        setOpenModal(true)
    }

    const selectDia = (e) => {
        if (e.toString().includes('00:00:00')) {
            setFormValues({
                ...formValues,
                start: moment(e).minutes(0).seconds(0).add(12, 'hours')._d,
                end: moment(e).minutes(0).seconds(0).add(15, 'hours')._d
            })
            setDateStart(moment(e).minutes(0).seconds(0).add(12, 'hours')._d)
            setDateEnd(moment(e).minutes(0).seconds(0).add(15, 'hours')._d)
            setOpenModal(true);
        }
        setLastView('month')        
        let date = new Date(e);
        setMonth(date.toLocaleString('en-us', { month: 'short' }));
    }

    return (
        <div className="calendar-screen">
            <Navbar id='calendar' user={user} total={resumen}/>


            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                defaultView={lastView}
                onNavigate={selectDia}
                components={{
                    event: CalendarEvent
                }}
                eventPropGetter={eventStyleGetter}
            />

            {/* BOTONES DE ABAJO */}
            <button button
                className="btn btn-primary fab"
                onClick={handleOpenModal}
            >
                <i className="fas fa-plus"></i>
            </button>
            {
                (activeEvent) &&
                <button
                    className="btn btn-danger fab-danger"
                    onClick={deleteEvento}
                >
                    <i className="fas fa-trash"></i>
                    <span> Borrar evento </span>
                </button>
            }

            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                style={customStyles}
                closeTimeoutMS={200}
                className="modal"
                overlayClassName="modal-fondo"
            >
                <h1> {(activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
                <hr />
                <form
                    data-aos="fade-right"
                    className="container"
                    onSubmit={handleSubmitForm}
                >

                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            className={`form-control ${!titleValid && 'is-invalid'} `}
                            placeholder="Título del evento"
                            name="title"
                            autoComplete="off"
                            value={title}
                            onChange={handleInputChange}
                        />
                    </div>


                    <div className="form-group">
                        <label>Fecha y hora inicio</label>
                        <DateTimePicker
                            onChange={handleStartDateChange}
                            value={dateStart}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha y hora fin</label>
                        <DateTimePicker
                            onChange={handleEndDateChange}
                            value={dateEnd}
                            minDate={dateStart}
                            className="form-control"
                        />
                    </div>

                    <hr />
                    <div className="row">
                        <div className="col-md-9">
                            <div >
                                <label>Concepto</label>
                                <CreatableSelect
                                    isClearable
                                    onChange={handleChange}
                                    className={` ${!conceptoValid && 'errorConcepto'} `}
                                    options={optionsConcepto}
                                    value={concepto}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Total</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Total"
                                    name="total"
                                    autoComplete="off"
                                    value={total}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>


                    {/*
                        6-7-8 compras producto/precio unidad/tot
                    */}

                    {
                        formValues.concepto &&
                        (
                            formValues.concepto.value == 6 ||
                            formValues.concepto.value == 7 ||
                            formValues.concepto.value == 8
                        )
                        &&
                        <>

                        </>

                    }

                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Notas</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    // placeholder="Total"
                                    // name="total"
                                    autoComplete="off"
                                // value={total}
                                // onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-block btnGuardar"
                    >
                        <i className="far fa-save"></i>
                        <span> Guardar</span>
                    </button>

                </form>

            </Modal>




        </div >
    )
}
