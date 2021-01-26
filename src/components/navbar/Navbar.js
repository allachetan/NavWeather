import React from "react";
import './Navbar.css'

function Navbar(props){
    return (
        <nav className="Navbar">
            <h1>Nav Weather</h1>
            <ul className="NavbarList">
                <li><a href="https://github.com/allachetan/NavWeather" target="_blank" className="Link" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://chetanalla.com" target="_blank" className="Link" rel="noopener noreferrer">About</a></li>
            </ul>
        </nav>
    )
}

export default Navbar;