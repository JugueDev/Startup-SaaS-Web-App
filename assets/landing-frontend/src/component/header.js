import React from 'react';
import {Link} from 'react-router-dom';
import './header.css'

function Header (){
    return(
<div className="header">  
    <img className="img" src="/logo_header.png" alt=""/>   
    <ul className="ul">
        <li className="li"><Link to="/" className="a">Home</Link></li>
        <li className="li"><Link to="/about" className="a">About Us</Link></li>
        <li className="li"><Link to="/contact" className="a">Contact Us</Link></li>
    </ul>
</div>
)
}
  
  export default Header;