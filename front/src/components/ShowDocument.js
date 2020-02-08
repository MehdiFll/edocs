import React, { Component } from 'react';
import axios from 'axios';
import FileViewer from 'react-file-viewer';
import { Redirect } from 'react-router-dom'

export class ShowDocument extends Component {

    constructor() {
        super();
        this.state = {
            data: '', idfile: '',  item: '',
            user: window.sessionStorage.getItem("user"),
            accessToken: window.sessionStorage.getItem('Token'),

        };
        axios.defaults.headers.common['Authorization'] = this.state.accessToken;

    }

    componentWillMount() {
        this.setState({ idfile: this.props.match.params.id });
        console.log(this.props.match.params.id);

        axios.get('/api/docs/' + this.props.match.params.id).then(response => {
            this.setState({
                data: response.data,
            });
            console.log(response.data);
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
        let categorie; let description; let date; let nom; let user; var type; let file; let telechargement;
        if (this.state.data) {
            categorie = this.state.data.categorie;
            description = this.state.data.description;
            date = this.state.data.date;
            nom = this.state.data.nom;
            user = this.state.data.user;
            telechargement = this.state.data.telechargement;
            var res = nom.split(".");
            type = res[1];
            file = 'http://localhost:8080/api/telechargement/visualiser/' + this.props.match.params.id;
        }
        return (
            <div className="p-grid">
            {this.renderRedirect()}

                <div className="p-col-12">
                    <div className="card">
                        <h1>Détails document</h1><br />
                        <h2>{nom}</h2>
                        <div className="p-grid">
                            <div className="p-col-4">
                                <h4>Catégorie: {categorie}</h4>
                                <h4>Uploadé le: {date}</h4><h4> Par: {user}</h4>
                                <h4>Nombre de téléchargement: {telechargement}</h4>
                            </div>
                            <div className="p-col">
                                <h4>Description :</h4>
                                <p>{description}</p>
                            </div>
                        </div>
                        <h2>Visualiation en ligne</h2>
                        <div className="p-col-10 p-offset-1">
                            <FileViewer
                                fileType={type}
                                filePath={file}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}