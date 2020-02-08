import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Redirect } from 'react-router-dom'


export class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginrequest: { username: '', password: '' },
        }
        this.login = this.login.bind(this);
    }


    updateProperty(property, value) {
        let item = this.state.loginrequest;
        item[property] = value;
        this.setState({ loginrequest: item });
    }


    login() {
        axios.post('/api/auth/signin', this.state.loginrequest).then(response => {
            if (response.data) {
                if (response.data.accessToken) {
                   // console.log(response.data.role[0].id);
                    window.sessionStorage.setItem('Token', "Bearer " + response.data.accessToken);
                    window.sessionStorage.setItem('user', response.data.user);
                     window.sessionStorage.setItem('role', response.data.role[0].id);
                    window.sessionStorage.setItem('showPanel', true);
                    axios.get('/api/auth/user/' + window.sessionStorage.getItem('user'), {
                        headers: {
                            Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                        }
                    }).then(response => {
                        window.sessionStorage.setItem('username', response.data.username);
                        this.props.history.push({
                            pathname: '/Profile',
                        });

                    }).catch(error => {
                        console.log(error);
                    })

                }
            } else {
                this.props.history.push('/');
            }
        }).catch(error => {
            console.log(error);
        })
    }
    renderRedirect = () => {
        if (window.sessionStorage.getItem("user")) {
            return <Redirect to='/Profile' />
        }

    }
    render() {
        return (

            <div className="p-grid">
                {this.renderRedirect()}
                <div className="p-col-12">
                    <div className="card">
                        <h1>Login Page</h1>
                        <div className="p-col-12 p-md-2">
                            <label htmlFor="input">Username</label>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <InputText value={this.state.loginrequest.username} onChange={(e) => this.updateProperty('username', e.target.value)} />
                        </div>
                        <div className="p-col-12 p-md-2">
                            <label htmlFor="input">Password</label>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <InputText type="password" value={this.state.loginrequest.password} onChange={(e) => this.updateProperty('password', e.target.value)} />
                        </div>

                        <Button label="Login" icon="pi pi-user" onClick={this.login} />
                    </div>
                </div>
            </div>
        );
    }
}