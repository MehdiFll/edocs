import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactDom from 'react-dom';
import axios from 'axios';
import logo from "../pic.png";
import { Redirect } from 'react-router-dom'

export class Forum extends Component {

    constructor() {
        super();
        this.state = {
            Subjects: [],
            Comments: [],
            subject: { titre: '', date: ' ', contenu: '', user: { username: "" } },
            commentaire: { contenu: '', date: '', user: { username: "" } },
            layout: 'list',
            selectedSubject: null,
            visible: false,
            sortKey: null,
            sortOrder: null,
            displayDialog: false,
            supprimer: false,
            isAdmin: false
        };
        this.itemTemplate = this.itemTemplate.bind(this);
        this.itemTemplateCom = this.itemTemplateCom.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.AjouterPost = this.AjouterPost.bind(this);
        this.supprimerPost = this.supprimerPost.bind(this);
        this.getComments = this.getComments.bind(this);
        this.ajoutercom = this.ajoutercom.bind(this);
    }



    updateProperty(property, value) {
        let item = this.state.subject;
        item[property] = value;
        this.setState({ subject: item });
    }

    updatePropertyCom(property, value) {
        let item = this.state.commentaire;
        item[property] = value;
        this.setState({ commentaire: item });
    }

    componentDidMount() {
        if (window.sessionStorage.getItem('Token')) {
            axios.get('/api/sujet', {
                headers: {
                    Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                }
            }).then(response => {
                this.setState({
                    Subjects: response.data,
                })
                console.log(response.data)
            }).catch(error => {
                console.log(error);
            })
            if (window.sessionStorage.getItem('user')) {
                axios.get('/api/auth/user/' + window.sessionStorage.getItem('user'), {
                    headers: {
                        Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                    }
                }).then(response => {
                    window.sessionStorage.setItem('username', response.data.username);
                    this.state.subject.user = window.sessionStorage.getItem('username');
                    this.state.commentaire.user = window.sessionStorage.getItem('username');
                    response.data.roles.forEach(element => {
                        if (element.id === 3) this.setState({
                            isAdmin: true,
                        });
                    });
                }).catch(error => {
                    console.log(error);
                })
            }

        } else {
            this.props.history.push('/404');
        }
        console.log(window.sessionStorage.getItem('user'));
    }

    getComments(subject) {
        this.setState({
            visible: true,
            selectedSubject: subject
        })
        axios.get('/api/commentaires/' + subject.id,
            {
                headers: {
                    Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                }
            }
        ).then(response => {
            this.setState({
                Comments: response.data
            });
        }).catch(error => {
            console.log(error);
        })


    }
    renderRedirect = () => {
        if (!window.sessionStorage.getItem("user")) {
            return <Redirect to='/' />
        }
    }

    AjouterPost(e) {

        this.setState({
            displayDialog: false,
        });
        let today = new Date();
        var minutes = today.getMinutes();

        if (minutes < 10) minutes = '0' + minutes;

        let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() + " at " + today.getHours() + ":" + minutes;
        this.updateProperty('date', date);


        const params = new URLSearchParams();
        params.append('titre', this.state.subject.titre);
        params.append('contenu', this.state.subject.contenu);
        params.append('date', this.state.subject.date);
        params.append('user_id', window.sessionStorage.getItem('user')); //add the user_id of the current session instead of 1
        axios.post('/api/sujet/', params,
            {
                headers: {
                    Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                }
            }
        ).then(response => {
            if (response.data.status === "success") {
                this.growl.show({ severity: 'success', summary: 'Succès', detail: 'Votre Poste a été publié dans le forum' });
                var max = 0;
                //finding the max id to make the new subject on top of the list
                this.state.Subjects.forEach(element => {
                    if (element.id > max) max = element.id;
                });


                //console.log(max);
                this.setState({
                    subject: { id: max + 1, titre: this.state.subject.titre, date: this.state.subject.date, contenu: this.state.subject.contenu, user: { username: window.sessionStorage.getItem('username') } },//need to add the true
                    //username later of the current session
                });
                this.state.Subjects.push(this.state.subject);
                this.setState({
                    Subjects: this.state.Subjects,
                    subject: {
                        id: '', titre: '', date: '', contenu: '', user: { username: "" }
                    }
                });
            }

        }).catch(error => {
            console.log(error);
        })
    }

    supprimerPost(subject) {
        axios.delete('/api/sujet/' + subject.id, {
            headers: {
                Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
            }
        }).then(response => {
            if (response.data.status === "success") {
                this.growl.show({ severity: 'success', summary: 'Succès', detail: 'Votre Poste a été supprimé du forum' });
                var index = this.state.Subjects.indexOf(subject);
                delete this.state.Subjects[index];
                this.setState({
                    Subjects: this.state.Subjects,
                });
            }
        }).catch(error => {
            console.log(error);
        })

    }
    ajoutercom() {
        let today = new Date();
        var minutes = today.getMinutes();

        if (minutes < 10) minutes = '0' + minutes;

        let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() + " at " + today.getHours() + ":" + minutes;
        this.updatePropertyCom('date', date);


        const params = new URLSearchParams();
        params.append('contenu', this.state.commentaire.contenu);
        params.append('date', this.state.commentaire.date);
        params.append('user_id', window.sessionStorage.getItem('user')); //add the user_id of the current session instead of 1
        axios.post('/api/commentaires/' + this.state.selectedSubject.id, params,
            {
                headers: {
                    Authorization: window.sessionStorage.getItem('Token'), //the token is a variable which holds the token
                }
            }
        ).then(response => {
            if (response.data.status === "success") {
                this.growl.show({ severity: 'success', summary: 'Succès', detail: 'Votre Commentaire a été publié' });
                var max = 0;
                //finding the max id to make the new commentaire on top of the list
                this.state.Comments.forEach(element => {
                    if (element.id > max) max = element.id;
                });

                //console.log(max);
                this.setState({
                    commentaire: { id: max + 1, titre: this.state.commentaire.titre, date: this.state.commentaire.date, contenu: this.state.commentaire.contenu, user: { username: window.sessionStorage.getItem('username') } },//need to add the true
                    //username later of the current session
                });
                this.state.Comments.push(this.state.commentaire);
                this.setState({
                    Comments: this.state.Comments,
                    commentaire: { id: '', titre: '', date: '', contenu: '', user: { username: "" } }
                });
            }

        }).catch(error => {
            console.log(error);
        })

    }

    supprimerCom(com) {
        axios.delete('/api/commentaires/' + this.state.selectedSubject.id + '/' + com.id, {
            headers: {
                Authorization: window.sessionStorage.getItem('Token') //the token is a variable which holds the token
            }
        }).then(response => {
            if (response.data.status === "success") {
                this.growl.show({
                    severity: 'success', summary: 'Succès'
                    , detail: 'Votre commentaire a été supprimé du forum'
                });
                var index = this.state.Comments.indexOf(com);
                delete this.state.Comments[index];
                this.setState({
                    Comments: this.state.Comments,
                });
            }
        }).catch(error => {
            console.log(error);
        })

    }
    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({
                sortOrder: -1,
                sortField: value.substring(1, value.length),
                sortKey: value
            });
        }
        else {
            this.setState({
                sortOrder: 1,
                sortField: value,
                sortKey: value
            });
        }
    }

    renderListItem(subject) {
        return (

            <div className="p-col-12" style={{ borderBottom: '1px solid #d9d9d9' }}>
                <div style={{ float: 'right' }}> <Button icon="pi pi-search" onClick={(e) => this.getComments(subject)}></Button>
                    <div hidden={!this.state.isAdmin}><Button name={this.state.subject.id} className="p-button-danger" icon="pi pi-times"
                        onClick={this.supprimerPost.bind(this, subject)}></Button></div> </div>
                <div className="p-col-12 p-md-3">
                    <img src={logo} />
                </div>


                <div className="p-col-12 p-md-8 subject-details">
                    <div className="p-grid">
                        <strong><div className="p-col-2 p-sm-6">{subject.user.username}</div></strong>
                        <div className="p-col-10 p-sm-6">{subject.date}</div>

                        <div className="p-col-2 p-sm-6">Titre:</div>
                        <div className="p-col-10 p-sm-6">{subject.titre}</div>

                        <div className="p-col-2 p-sm-6">Contenu:</div>
                        <div className="p-col-10 p-sm-6">{subject.contenu}</div>


                    </div>
                </div>


            </div>
        );
    }



    itemTemplate(subject, layout) {
        if (!subject) {
            return;
        }

        if (layout === 'list')
            return this.renderListItem(subject);

    }

    itemTemplateCom(com) {
        if (!com) {
            return;
        } else {

            return (

                <div style={{ height: '7vw' }}>
                    <div hidden={!this.state.isAdmin}><Button name={com.id} style={{ float: 'right' }} className="p-button-danger" icon="pi pi-times"
                        onClick={this.supprimerCom.bind(this, com)}></Button></div>
                    <strong><p>{com.user.username}</p></strong>
                    <p>{com.contenu}</p>

                    <hr className="ui-widget-content" style={{ borderTop: 1 }} />

                </div>
            );
        }

    }

    renderComHeader() {
        const sortOptions = [
            { label: 'anciens', value: '!id' },
            { label: 'Les plus recent', value: 'id' },


        ];
        return (
            <div className="p-grid">
                <div className="p-col-6" style={{ textAlign: 'left' }}>
                    <Dropdown options={sortOptions} value={this.state.sortKey}
                        onChange={this.onSortChange} style={{ width: '8vw' }} placeholder="Classer par" />
                </div>
            </div>
        );
    }
    renderHeader() {
        const sortOptions = [
            { label: 'anciens', value: 'id' },
            { label: 'Les plus recent', value: '!id' },


        ];

        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-6" style={{ textAlign: 'left' }}>
                    <Dropdown options={sortOptions} value={this.state.sortKey}
                        placeholder="Classer par" onChange={this.onSortChange} />
                    <Button label="Ajouter un Poste" style={{ float: 'right' }}
                        icon="pi pi-plus" onClick={(e) => this.setState({ displayDialog: true })}>
                    </Button>

                </div>

                <Dialog visible={this.state.displayDialog} header="Nouveau Poste" style={{ width: '50vw', height: '25vw' }} modal={true} onHide={() => this.setState({ displayDialog: false })}>


                    <br />
                    <span className="p-float-label">
                        <InputText value={this.state.subject.titre} size={75} style={{ align: 'left' }} onChange={(e) => { this.updateProperty('titre', e.target.value) }} />
                        <label htmlFor="out">Titre</label>
                    </span>
                    <br />
                    <InputTextarea placeholder="Ce que vous voulez publier" rows={7} cols={75} value={this.state.subject.contenu} onChange={(e) => { this.updateProperty('contenu', e.target.value) }} autoResize={true} />


                    <br />
                    <Button label="Publier" onClick={this.AjouterPost}></Button>
                </Dialog>
                <div className="p-col-6" style={{ textAlign: 'left' }}>
                </div>
            </div>
        );
    }

    render() {
        const header = this.renderHeader();
        return (
            <div>
                {this.renderRedirect()}

                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>Forum</h1>
                        <p>Partager vos documents, projets, annonces, idées aves vos professeurs et amis.</p>
                    </div>
                </div>

                <div className="content-section implementation">
                    <DataView value={this.state.Subjects} layout={this.state.layout} header={header}
                        itemTemplate={this.itemTemplate}
                        sortOrder={this.state.sortOrder} sortField={this.state.sortField} />

                    <Dialog header="Détail du post " visible={this.state.visible} blockScroll={true} style={{ height: '40vw', width: '40vw', overflowX: 'auto' }} modal={true} onHide={() => this.setState({ visible: false })}>
                        <div className="feature-intro" style={{
                            scroll: true
                        }}>
                            <h1>{this.state.selectedSubject ? this.state.selectedSubject.titre : "null"}</h1>
                            <p>{this.state.selectedSubject ? this.state.selectedSubject.contenu : "null"}</p>
                        </div>
                        <DataView value={this.state.Comments} layout={this.state.layout} header={this.renderComHeader()}
                            itemTemplate={this.itemTemplateCom} sortOrder={this.state.sortOrder} sortField={this.state.sortField} />
                        <InputText value={this.state.commentaire.contenu} placeholder={"Votre commentaire.."} size={45} style={{ align: 'left' }} onChange={(e) => { this.updatePropertyCom('contenu', e.target.value) }} />
                        <Button icon="pi pi-plus" onClick={this.ajoutercom}></Button>

                    </Dialog>
                </div>

            </div>
        );
    }

}
if (document.getElementById('Forum')) {
    ReactDom.render(<Forum />, document.getElementById('Forum'));
}