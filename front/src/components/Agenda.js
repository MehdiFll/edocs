import React, { Component } from 'react';
import 'fullcalendar-reactwrapper-cdl/dist/css/fullcalendar.min.css';
import FullCalendar from 'fullcalendar-reactwrapper-cdl';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Redirect } from 'react-router-dom'

import axios from 'axios';

export class Agenda extends Component {

    constructor() {
        super();
        if (window.sessionStorage.getItem("user") == null) {
            console.log("yo");
        }
        this.state = {
            user: window.sessionStorage.getItem("user"), item: {}, visible: false,
            titre: '', start: '', end: '', date: '',
            accessToken: window.sessionStorage.getItem('Token'),
        };
        axios.defaults.headers.common['Authorization'] = this.state.accessToken;
        axios.get('/api/agenda/user/' + this.state.user).then(response => {
            this.setState({
                events: response.data
            })
            console.log(this.state.events);
            //this.render();
        }).catch(error => {
            console.log(error);
        })

        console.log(this.state.user);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.newEvent = this.newEvent.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
        this.updateProperty = this.updateProperty.bind(this);
    };

    newEvent(date, jsEvent, view) {
        this.setState({
            visible: true,
            date: date._d
        })
        console.log(date._d);

    }

    updateProperty(property, value) {
        let item = this.state.item;
        item[property] = value;
        this.setState({ item: item });
    }

    showEvent(date, event, view) {
        console.log(date)
        this.updateProperty('title', date.title);
        this.updateProperty('start', date.start._i);
        this.updateProperty('end', date.end._i);
        this.setState({
            visible2: true
        })
        console.log(this.state.item)

    }

    saveEvent() {
        const params = new URLSearchParams();

        var year = this.state.date.getFullYear();
        var month = this.state.date.getMonth() + 1;
        var day = this.state.date.getDate();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;


        var heure = this.state.start.getHours();
        var minute = this.state.start.getMinutes();

        var heure2 = this.state.end.getHours();
        var minute2 = this.state.end.getMinutes();
        if (minute2 < 10) minute2 = '0' + minute2;
        if (heure2 < 10) heure2 = '0' + heure2;
        if (minute < 10) minute = '0' + minute;
        if (heure < 10) heure = '0' + heure;

        var start_time = "" + year + "-" + month + "-" + day + " " + heure + ":" + minute;
        var end_time = "" + year + "-" + month + "-" + day + " " + heure2 + ":" + minute2;
        //console.log(end_time);


        params.append('nom', this.state.titre);
        params.append('date_debut', start_time);
        params.append('date_fin', end_time);
        params.append('user_id', this.state.user);
        axios.post('/api/agenda/', params).then(response => {
            this.setState({
                title: '',
                start: '',
                end: '',
                visible: false
            })
        });

    }

    deleteEvent() {

    }


    renderRedirect = () => {
        if (!window.sessionStorage.getItem("user")) {
            return <Redirect to='/' />
        }
    }

    render() {

        const scheduleHeader = {
            left: 'prev,next, today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };


        const dialogFooter = (
            <div>
                <Button label="Enregistrer" icon="pi pi-info-circle" onClick={this.saveEvent} />

            </div>
        );

        return (

            <div className="p-grid">

                {this.renderRedirect()}
                <div className="p-col-12">
                    <div className="card">

                        <Dialog header="Nouveau événement" style={{ height: '20em', width: '20em' }} footer={dialogFooter} visible={this.state.visible} modal={true} onHide={(e) => this.setState({ visible: false })}>
                            <br />

                            <div className="p-grid">
                                <div className="p-col">
                                    <span className="p-float-label">
                                        <InputText id="in" value={this.state.titre} onChange={(e) => this.setState({ titre: e.target.value })} />
                                        <label htmlFor="in">Titre</label>
                                    </span>
                                    <br />
                                    <span className="">
                                        <label htmlFor="in">Date début</label><br />
                                        <Calendar id="in" timeOnly={true} showTime={true} hourFormat="24" value={this.state.start} onChange={(e) => this.setState({ start: e.target.value })} />

                                    </span>
                                    <br />
                                    <br />

                                    <span className="">
                                        <label htmlFor="in">Date fin</label>
                                        <br />

                                        <Calendar id="in" timeOnly={true} showTime={true} hourFormat="24" value={this.state.end} onChange={(e) => this.setState({ end: e.target.value })} />

                                    </span>


                                    <br /><br /><br />


                                </div>

                            </div>

                        </Dialog>

                        <Dialog header="Nouveau événement" style={{ height: '15em' }} visible={this.state.visible2} onHide={(e) => this.setState({ visible2: false })}>
                            <br />

                            <div className="p-grid">
                                <div className="p-col">
                                    <span className=''>
                                        <label htmlFor="in">Titre</label>
                                        <h4>{this.state.item.title}</h4>
                                    </span>
                                    <br />
                                    <span className="">
                                        <label htmlFor="in">Date début</label><br />
                                        <h4>{this.state.item.start}</h4>

                                    </span>
                                    <br />
                                    <br />

                                    <span className="">
                                        <label htmlFor="in">Date fin</label>
                                        <h4>{this.state.item.end}</h4>
                                        <br />

                                        <p></p>

                                    </span>


                                    <br /><br /><br />


                                </div>

                            </div>

                        </Dialog>

                        <h1>Schedule</h1>
                        {this.state.events &&
                            <FullCalendar
                                header={scheduleHeader}


                                editable={true}
                                eventLimit={true} // allow "more" link when too many events
                                events={this.state.events}
                                locale="fr"

                                eventClick={(date, event, view) => { this.showEvent(date, event, view) }}
                                dayClick={(date, jsEvent, view) => { this.newEvent(date, jsEvent, view) }}
                            />

                        }
                    </div>
                </div>
            </div>
        );
    }
}