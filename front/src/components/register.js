import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { Message } from 'primereact/message';
import { Redirect } from 'react-router-dom'

import axios from 'axios';

export class Register extends Component {

    constructor() {
        super();
        this.state = {
            signuprequest: { nom: '', prenom: '', email: '', role: [], username: '', password: '', passwordconfirmation: '' },
            styleconfirmation: { border: '1px solid red' },
            rolesSelectItems: [
                { label: 'Admin et professeur', value: 'admin2' },
                { label: 'Professeur', value: 'pm' },
                { label: 'Etudiant', value: 'user' },
                { label: 'Admin', value: 'admin' },
            ],
            passwordmsg: true
        }
        this.register = this.register.bind(this);
        this.confirmpass = this.confirmpass.bind(this);
        this.handleroles = this.handleroles.bind(this);
        this.handlepassword = this.handlepassword.bind(this);
    }
    updateProperty(property, value) {
        let item = this.state.signuprequest;
        item[property] = value;
        this.setState({ signuprequest: item });
    }

    confirmpass(e) {
        this.updateProperty('passwordconfirmation', e.target.value);
        if (this.state.signuprequest.password) {
            if (this.state.signuprequest.password === this.state.signuprequest.passwordconfirmation) {
                this.setState({ styleconfirmation: { border: '1px solid green' } });
            } else this.setState({ styleconfirmation: { border: '1px solid red' } });
        }
    }

    renderRedirect = () => {
        if (!window.sessionStorage.getItem("user")) {
            
          return <Redirect to='/' />
        }
        console.log(window.sessionStorage.getItem("role"));
        if(window.sessionStorage.getItem("role")!=3){
            return <Redirect to='/Profile' />
        }
      }

    register() {
        if (this.state.signuprequest.password.length < 7) {
            this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Mot de passe avec moins de 7 caractères' });
        }
        else {
            axios.post('/api/auth/signup', this.state.signuprequest).then(response => {
                if (response.data === "User registered successfully!") {
                    this.growl.show({ severity: 'success', summary: 'Succès', detail: 'Vous êtes inscrits vous pouvez vous connectez' });
                    this.props.history.push('/');

                } else if (response.data.error === "username existe") {
                    this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Username déjà existant' });

                } else if (response.data.error === "email existe") {
                    this.growl.show({ severity: 'error', summary: 'Erreur', detail: 'Email déjà existant' });

                }
            }).catch(error => {
                console.log(error);
            })
        }
    }


    handlepassword(e) {
        this.updateProperty('password', e.target.value);
        if (this.state.signuprequest.password.length < 7)
            this.state.passwordmsg = false;
        else this.state.passwordmsg = true;
    }

    handleroles(e) {
        this.state.signuprequest.role = [];
        switch (e.target.value) {
            case 'admin':
                this.state.signuprequest.role.push("admin");
                break;
            case 'admin2':
                this.state.signuprequest.role.push("admin");
                this.state.signuprequest.role.push("pm");

                break;
            case 'user':
                this.state.signuprequest.role.push("user");

                break;
            case 'pm':
                this.state.signuprequest.role.push("pm");
                break;

            default:

                break;

        }
    }

    render() {

        return (
            <div className="p-grid">
            {this.renderRedirect()}

                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12">
                    <div className="card">
                        <h1>Page d'inscription</h1>
                        <p>Veuillez remplir le formulaire.</p>

                        <label htmlFor="input">Nom</label>
                        <div className="p-col-12 p-md-4">
                            <InputText value={this.state.signuprequest.nom} onChange={(e) => this.updateProperty('nom', e.target.value)} />
                        </div>
                        <label htmlFor="input">Prenom</label>
                        <div className="p-col-12 p-md-4">
                            <InputText value={this.state.signuprequest.prenom} onChange={(e) => this.updateProperty('prenom', e.target.value)} />
                        </div>
                        <label htmlFor="input">Username</label>

                        <div className="p-col-12 p-md-4">
                            <InputText value={this.state.signuprequest.username} onChange={(e) => this.updateProperty('username', e.target.value)} />
                        </div>
                        <label htmlFor="input">Email</label>

                        <div className="p-col-12 p-md-4">
                            <InputText value={this.state.signuprequest.email} onChange={(e) => this.updateProperty('email', e.target.value)} />
                        </div>
                        <label htmlFor="input">Password</label>

                        <div className="p-col-12 p-md-4">
                            <Password value={this.state.signuprequest.password} onChange={(e) => this.handlepassword(e)} />
                            <div hidden={this.state.passwordmsg}><Message severity="error" text="Minimum 7 caractères"></Message></div>

                        </div>
                        <br />
                        <label htmlFor="input">Password Confirmation</label>
                        <div className="p-col-12 p-md-4">
                            <InputText style={this.state.styleconfirmation} type="password" value={this.state.signuprequest.passwordconfirmation}
                                onChange={(e) => this.confirmpass(e)} />
                        </div>
                        <label htmlFor="input">Roles</label>


                        <div className="p-col-12 p-md-4">
                            <Dropdown value={this.state.signuprequest.role} options={this.state.rolesSelectItems} onChange={(e) => { this.handleroles(e) }} placeholder="Choisir le rôle" />
                        </div>
                        <h5>{this.state.signuprequest.role}</h5>
                        <Button label="Register" icon="pi pi-user" onClick={this.register} />

                    </div>
                </div>
            </div>
        );
    }
}