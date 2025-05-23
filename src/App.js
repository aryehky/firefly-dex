import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Auth from './pages/Auth';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF6B6B',
        },
        secondary: {
            main: '#4ECDC4',
        },
        background: {
            default: '#1A1A1A',
            paper: '#2D2D2D',
        },
    },
});

function App() {
    return ( <
        ThemeProvider theme = { theme } >
        <
        CssBaseline / >
        <
        Router >
        <
        Navbar / >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/trading"
        element = { < Trading / > }
        /> <
        Route path = "/portfolio"
        element = { < Portfolio / > }
        /> <
        Route path = "/auth"
        element = { < Auth / > }
        /> < /
        Routes > <
        /Router> < /
        ThemeProvider >
    );
}

export default App;