import React, { useEffect } from 'react'

export const CalendarEvent = ({ event }) => {



    return (
        <small id="calendarEvent">
            {event.title} <br/> {event.total == "" ? 'precio desconocido': event.total+'€'}
        </small>
    )
}
