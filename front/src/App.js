import React, {Component} from 'react';
import classNames from 'classnames';
import {AppMenu} from './AppMenu';
import {AppInlineProfile} from './AppInlineProfile';
import {Route} from 'react-router-dom';
import {Login} from './components/login';
import { Register } from './components/register';
import { Documents } from './components/Documents';
import { Mesdocuments } from './components/Mesdocuments';
import { Agenda } from './components/Agenda';
import { ShowDocument } from './components/ShowDocument';
import { Profile } from './components/Profile';
import {ScrollPanel} from 'primereact/components/scrollpanel/ScrollPanel';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'fullcalendar/dist/fullcalendar.css';
import './layout/layout.css';
import './App.css';
import { Forum } from './components/Forum';

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            //hidePanel:false
        };

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.createMenu();
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }
       
        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
        setTimeout(() => {this.layoutMenuScroller.moveBar(); }, 500);
    }

    onMenuItemClick(event) {
        if(!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }

    createMenu() {
        if(window.sessionStorage.getItem("role")==3){
            this.menu = [
            
                {label: 'Nouveau compte', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/register' } },
                {label: 'Forum', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/forum' } },
                {label: 'Documents', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/documents'}},
                {label: 'Mes documents', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/mesdocuments'}},
                {label: 'Agenda', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/agenda'}},
                
            ];
        }
       else {
        this.menu = [
            
    
            {label: 'Forum', icon: 'pi pi-fw pi-calendar', command: () => { window.location = '#/forum' } },
            {label: 'Documents', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/documents'}},
            {label: 'Mes documents', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/mesdocuments'}},
            {label: 'Agenda', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/agenda'}},
            
        ];
       }
    }


    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }



    componentWillMount(){
 
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    render() {
        let logo = this.state.layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg': 'assets/layout/images/logo.svg';

        let wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });
        let sidebarClassName = classNames("layout-sidebar", {'layout-sidebar-dark': this.state.layoutColorMode === 'dark'});

        return (
            
            <div className={wrapperClass} onClick={this.onWrapperClick}>
                      
                
                   <div className={sidebarClassName} onClick={this.onSidebarClick}>
                        {window.sessionStorage.getItem("user") && <ScrollPanel ref={(el) => this.layoutMenuScroller = el} style={{ height: '100%' }}>
                            <div className="layout-sidebar-scroll-content" >
                                <div className="layout-logo">

                                </div>
                                <AppInlineProfile/>
                                <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                            </div>
                        </ScrollPanel>}
                    </div>
                
               
                   
                <div className="layout-main">
                    <Route path="/" exact component={Login} />
                 
                    <Route path="/forum" component={Forum} />
                    <Route path="/register" component={Register} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/documents" component={Documents} />
                    <Route path="/mesdocuments" component={Mesdocuments} />
                    <Route path="/agenda" component={Agenda} />
                    <Route path="/showdocument/:id" component={ShowDocument} />

                </div>

                

                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default App;