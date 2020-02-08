import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Redirect } from 'react-router-dom'

import { Button } from 'primereact/button';
import FileDownload from 'js-file-download';
import { Dialog } from 'primereact/dialog';


export class Documents extends Component {

    constructor() {
        super();
        this.state = {
            user: window.sessionStorage.getItem("user"),
            data: [], idfile: '', item: {},
            categorie: '', description: '',
            accessToken: window.sessionStorage.getItem('Token')
        }
        //this.download = this.download.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.update = this.update.bind(this);

        axios.defaults.headers.common['Authorization'] = this.state.accessToken;

    }

    componentWillMount() {
        axios.get('/api/docs/').then(response => {
            this.setState({
                data: response.data,
            });
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidUpdate() {
        axios.get('/api/docs/').then(response => {
            this.state.data= response.data
           
            // console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    download() {
        // console.log(this);
        axios.get('/api/telechargement/telecharger/' + this.id + '/' + 1, {
            responseType: 'blob'
        }).then((response) => {
            FileDownload(response.data, this.nom);
        });
    }

    show() {
        //console.log(this);
        window.location = '#/showdocument/' + this.id;
    }
    actionTemplate(Column) {
        if (window.sessionStorage.getItem("role") == 3) {
            return <div>
                <Button type="button" icon="pi pi-search" className="p-button-highlight" style={{ marginRight: '.5em' }} onClick={this.show.bind(Column)}></Button>
                <Button type="button" icon="pi pi-download" className="p-button-success" style={{ marginRight: '.5em' }} onClick={this.download.bind(Column)}></Button>
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={(e) => this.edit(Column.id)}></Button>
                <Button type="button" icon="pi pi-times" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={this.delete.bind(Column)}></Button>
            </div>;
        }

        if (window.sessionStorage.getItem("role") == 2) {
            if (Column.user_id == window.sessionStorage.getItem("user")) {
                return <div>
                    <Button type="button" icon="pi pi-search" className="p-button-highlight" style={{ marginRight: '.5em' }} onClick={this.show.bind(Column)}></Button>
                    <Button type="button" icon="pi pi-download" className="p-button-success" style={{ marginRight: '.5em' }} onClick={this.download.bind(Column)}></Button>
                    <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={(e) => this.edit(Column.id)}></Button>
                    <Button type="button" icon="pi pi-times" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={this.delete.bind(Column)}></Button>
                </div>;
            }
            else {
                return <div>
                <Button type="button" icon="pi pi-search" className="p-button-highlight" style={{ marginRight: '.5em' }} onClick={this.show.bind(Column)}></Button>
                <Button type="button" icon="pi pi-download" className="p-button-success" style={{ marginRight: '.5em' }} onClick={this.download.bind(Column)}></Button>
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={(e) => this.edit(Column.id)}></Button>
            </div>;
            }
            
        }
        if (window.sessionStorage.getItem("role") == 1) {
           // console.log(Column.user_id+" "+window.sessionStorage.getItem("user"));
            if (Column.user_id == window.sessionStorage.getItem("user")) {
                return <div>
                    <Button type="button" icon="pi pi-search" className="p-button-highlight" style={{ marginRight: '.5em' }} onClick={this.show.bind(Column)}></Button>
                    <Button type="button" icon="pi pi-download" className="p-button-success" style={{ marginRight: '.5em' }} onClick={this.download.bind(Column)}></Button>
                    <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={(e) => this.edit(Column.id)}></Button>
                    <Button type="button" icon="pi pi-times" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={this.delete.bind(Column)}></Button>
                </div>;
            }
            else {
                return <div>
                    <Button type="button" icon="pi pi-search" className="p-button-highlight" style={{ marginRight: '.5em' }} onClick={this.show.bind(Column)}></Button>
                    <Button type="button" icon="pi pi-download" className="p-button-success" style={{ marginRight: '.5em' }} onClick={this.download.bind(Column)}></Button>
                </div>;
            }
        }

    }

    edit(a) {
        console.log(a);
        axios.get('/api/docs/' + a).then(response => {
            this.setState({
                item: response.data,
                visible2: true
            })
            console.log(this.state.item);
        }).catch(error => {
            console.log(error);
        })
    }

    update() {
        const params = new URLSearchParams();
        console.log(this.state.item);
        params.append('description', this.state.item.description);
        params.append('categorie', this.state.item.categorie);
        params.append('user_id', this.state.item.user);
        axios.put('/api/docs/' + this.state.item.id, params).then(response => {
            this.setState({
                item: '',
                visible2: false
            })
        });

        this.componentDidUpdate();
    }

    updateProperty(property, value) {
        let item = this.state.item;
        item[property] = value;
        this.setState({ item: item });
    }

    delete() {
        axios.delete('/api/docs/' + this.id).then(response => {

            // console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }
    uploadFile() {

        const formData = new FormData();
        formData.append('file', this.state.fichier)
        // console.log(this.state.request);
        axios.post('/api/docs/', formData, {
            headers: { 'Authorization': 'Bearer ' + this.state.accessToken, 'Content-Type': 'multipart/form-data' }
        }
        ).then(response => {
            const params = new URLSearchParams();
            params.append('description', this.state.description);
            params.append('categorie', this.state.categorie);
            params.append('user_id', this.state.user);
            axios.put('/api/docs/' + response.data.id, params).then(response => {
                this.setState({
                    categorie: '',
                    fichier: '',
                    description: '',
                    visible: ''
                })
            });
        })
    }

    renderRedirect = () => {
        if (!window.sessionStorage.getItem("user")) {
            return <Redirect to='/' />
        }
    }
    render() {
        var header = <div style={{ 'textAlign': 'center' }}>
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Recherche globale" size="40" />
        </div>;
        return (
            <div className="p-grid">
                {this.renderRedirect()}


                <div className="p-col-12">
                    <div className="card">

                        <div className="content-section introduction">
                            <div className="feature-intro">
                                <h1>Espace document</h1>
                                <p>Dans cette espace, vous pouvez partager des documents, télécharger ou visualiser leurs contenus.</p>
                                <Button label="Nouveau fichier" icon="pi pi-info-circle" onClick={(e) => this.setState({ visible: true })} />
                            </div>
                        </div>

                        <br />

                        <div className="content-section implementation">
                            <Dialog header="Nouveau document" visible={this.state.visible} style={{ width: '50vw' }} modal={true} onHide={(e) => this.setState({ visible: false })}>
                                <br />
                                <span className="p-float-label">
                                    <InputText id="in" value={this.state.categorie} onChange={(e) => this.setState({ categorie: e.target.value })} />
                                    <label htmlFor="in">Catégorie</label>
                                </span>
                                <br />
                                <span className="">
                                    <label htmlFor="i">Description</label><br />
                                    <InputTextarea id="i" rows={5} cols={50} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} autoResize={true} />

                                </span>
                                <br />
                                <input className="p-button-text	" type="file" onChange={(e) => this.setState({ fichier: e.target.files[0] })} />
                                <Button label="Enregistrer" icon="pi pi-info-circle" onClick={this.uploadFile} />

                            </Dialog>


                            <Dialog header="Modifier document" visible={this.state.visible2} style={{ width: '50vw' }} modal={true} onHide={(e) => this.setState({ visible2: false })}>
                                <br />
                                <span className="p-float-label">
                                    <InputText id="in" value={this.state.item.categorie} onChange={(e) => this.updateProperty("categorie", e.target.value)} />
                                    <label htmlFor="in">Catégorie</label>
                                </span>
                                <br />
                                <span className="">
                                    <label htmlFor="i">Description</label><br />
                                    <InputTextarea id="i" rows={5} cols={50} value={this.state.item.description} onChange={(e) => this.updateProperty("description", e.target.value)} autoResize={true} />

                                </span>
                                <br />
                                <Button label="Modifier" icon="pi pi-info-circle" onClick={this.update} />

                            </Dialog>



                            <DataTable value={this.state.data} globalFilter={this.state.globalFilter} header={header} responsive={true}
                                paginator={true} rows={10} rowsPerPageOptions={[10, 20, 50]}>
                                <Column field="nom" header="Nom" filter={true} filterMatchMode="contains" sortable={true} />
                                <Column field="categorie" header="Catégorie" filter={true} filterMatchMode="contains" style={{ width: '10em' }} sortable={true} />
                                <Column field="user" header="Uploadé par" filter={true} filterMatchMode="contains" style={{ width: '10em' }} sortable={true} />
                                <Column field="date" header="Date" filter={true} filterMatchMode="contains" style={{ width: '10em' }} sortable={true} />

                                <Column field="telechargement" header="Téléchargements" style={{ textAlign: 'center', width: '10em' }} sortable={true} />
                                <Column header="Actions" body={this.actionTemplate} style={{ textAlign: 'center', width: '14em' }} />

                            </DataTable>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
