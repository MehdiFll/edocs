import React, { Component } from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';


export class CrudArticle extends Component {

    constructor() {
        super();
        this.state = { data: [] };
        
    }

    componentWillMount() {
        axios.get('/api/sujet', {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZWhkaSIsImlhdCI6MTU0ODEwNjUxNSwiZXhwIjoxNTQ4MTkyOTE1fQ.j40x8Am5lBlAEW83I9aflucZDv2utM0w6Lf1BsiA_WG-5PDlyfz5SBRkwlKppjVmLY6j6z330gcGgj0OF1XLfQ' //the token is a variable which holds the token
            }
           }).then(response => {
            this.setState({
                data: response.data,
            })
        }).catch(error => {
            console.log(error);
        })
      
    }

   

    render() {

console.log(this.state.data);
        return (

            <div></div>
        );
    }
}
if (document.getElementById('article')) {
    ReactDom.render(<CrudArticle />, document.getElementById('article'));
}