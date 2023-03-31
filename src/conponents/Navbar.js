import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import {MenuItems} from './MenuItems'
import LoginForm from './LoginForm';
import './Navbar.css';

class Navbar extends Component{
    state={clicked:false}

    handleClick = () =>{
        this.setState({clicked:!this.state.clicked})
    }

    Logout =() =>{
        <LoginForm/>
    }

    render(){
        return(
            <nav className='NavbarItems'>
                <ul className={this.state.clicked? 'nav-menu active':'nav-menu'}>
                    {MenuItems.map((item,index)=>{
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                <span>{item.icon} <br/>
                                    {item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
              { /* <div  className='nav-log'>
                <div className='nav-logout'>
               <FaIcons.FaUserCog size={25}/>
                <p>Logout</p>
                </div>
                </div> */}
            </nav>
            
        )
    }
}

export default Navbar;