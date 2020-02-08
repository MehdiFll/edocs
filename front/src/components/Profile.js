import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import { removeElement } from 'fullcalendar';


export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: ''
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }


    componentDidMount() {
        axios.get('/api/auth/user/' + window.sessionStorage.getItem('user'), {
            headers: {
                Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
            }
        }).then(response => {
            this.setState({
                user: response.data,
            })
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }
    renderRedirect = () => {
        if (!window.sessionStorage.getItem("user")) {
          return <Redirect to='/' />
        }
      }
    render() {
        var role;
        
        return (
            <div className="p-grid">
            {this.renderRedirect()}
                <div className="p-col-12">
                    <div className="card">
                        <h1>My Profile</h1>
                        <h3>Username : {this.state.user.username} </h3>
                        <h3>Nom : {this.state.user.nom} </h3>
                        <h3>Prénom : {this.state.user.prenom} </h3>
                        <h3>Email : {this.state.user.email} </h3>
                       
                    </div>
                </div>
            </div>
        );
    }
}