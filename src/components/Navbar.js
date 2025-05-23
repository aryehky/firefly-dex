import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    const connectWallet = async() => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(accounts[0]);
                setIsWalletConnected(true);
            } else {
                alert('Please install MetaMask or another Web3 wallet');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    return ( <
        AppBar position = "static" >
        <
        Toolbar >
        <
        IconButton edge = "start"
        color = "inherit"
        aria - label = "menu"
        sx = {
            { mr: 2 }
        } >
        <
        MenuIcon / >
        <
        /IconButton>

        <
        Typography variant = "h6"
        component = "div"
        sx = {
            { flexGrow: 1 }
        } >
        FireFlyDex <
        /Typography>

        <
        Box sx = {
            { display: 'flex', gap: 2 }
        } >
        <
        Button color = "inherit"
        component = { RouterLink }
        to = "/trading" >
        Trading <
        /Button> <
        Button color = "inherit"
        component = { RouterLink }
        to = "/portfolio" >
        Portfolio <
        /Button> <
        Button variant = "contained"
        color = "secondary"
        startIcon = { < AccountBalanceWalletIcon / > }
        onClick = { connectWallet } > {
            isWalletConnected ?
            `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'
        } <
        /Button> < /
        Box > <
        /Toolbar> < /
        AppBar >
    );
};

export default Navbar;