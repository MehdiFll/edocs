import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom'


export class AppInlineProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
        this.logout = this.logout.bind(this);

    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

  logout(){
      window.sessionStorage.removeItem('user');
      window.sessionStorage.setItem('username', '');
      window.sessionStorage.setItem('token', 0);
      window.sessionStorage.setItem('showPanel',false);

  }

    render() {
        return  (
            <div className="profile">
                <div>
                    <img src="assets/layout/images/profile.png" alt="" />
                </div>
                <a className="profile-link" onClick={this.onClick}>
                    <span className="username">{window.sessionStorage.getItem('username')}</span>
                    <i className="pi pi-fw pi-cog"/>
                </a>
                <ul className={classNames({'profile-expanded': this.state.expanded})}>
                    <li><Link to='/profile'><i className="pi pi-fw pi-user"/><span>Account</span></Link></li>
                    <li><a href='/' onClick={this.logout}><i className="pi pi-fw pi-power-off"/><span>Logout</span></a></li>
                </ul>
            </div>
        );
    }
}