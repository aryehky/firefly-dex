import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const connectWallet = async() => {
        setIsConnecting(true);
        setError('');

        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    // TODO: Implement actual registration logic
                    setIsRegistered(true);
                    setTimeout(() => {
                        navigate('/trading');
                    }, 2000);
                }
            } else {
                setError('Please install MetaMask or another Web3 wallet to continue');
            }
        } catch (error) {
            setError('Failed to connect wallet. Please try again.');
            console.error('Wallet connection error:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    return ( <
        Container maxWidth = "sm"
        sx = {
            { mt: 8 }
        } >
        <
        Paper sx = {
            { p: 4 }
        } >
        <
        Box sx = {
            { textAlign: 'center', mb: 4 }
        } >
        <
        Typography variant = "h4"
        component = "h1"
        gutterBottom >
        Welcome to FireFlyDex <
        /Typography> <
        Typography variant = "body1"
        color = "text.secondary" >
        Connect your wallet to start trading <
        /Typography> < /
        Box >

        {
            error && ( <
                Alert severity = "error"
                sx = {
                    { mb: 3 }
                } > { error } <
                /Alert>
            )
        }

        {
            isRegistered && ( <
                Alert severity = "success"
                sx = {
                    { mb: 3 }
                } >
                Wallet connected successfully!Redirecting to trading... <
                /Alert>
            )
        }

        <
        Box sx = {
            { textAlign: 'center' }
        } >
        <
        Button variant = "contained"
        size = "large"
        startIcon = {
            isConnecting ? < CircularProgress size = { 20 }
            color = "inherit" / > : < AccountBalanceWalletIcon / >
        }
        onClick = { connectWallet }
        disabled = { isConnecting || isRegistered }
        sx = {
            { minWidth: 200 }
        } > { isConnecting ? 'Connecting...' : 'Connect Wallet' } <
        /Button> < /
        Box >

        <
        Box sx = {
            { mt: 4 }
        } >
        <
        Typography variant = "body2"
        color = "text.secondary"
        align = "center" >
        By connecting your wallet, you agree to our Terms of Service and Privacy Policy <
        /Typography> < /
        Box > <
        /Paper> < /
        Container >
    );
};

export default Auth;