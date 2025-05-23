import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Home = () => {
    const navigate = useNavigate();

    const features = [{
            icon: < SecurityIcon sx = {
                { fontSize: 40 }
            }
            />,
            title: 'Secure Trading',
            description: 'Built on the FireFly blockchain for maximum security and transparency'
        },
        {
            icon: < SpeedIcon sx = {
                { fontSize: 40 }
            }
            />,
            title: 'Lightning Fast',
            description: 'Advanced order matching engine for instant trade execution'
        },
        {
            icon: < AccountBalanceWalletIcon sx = {
                { fontSize: 40 }
            }
            />,
            title: 'Easy Integration',
            description: 'Seamless wallet connection and asset management'
        }
    ];

    return ( <
        Box > { /* Hero Section */ } <
        Box sx = {
            {
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
                textAlign: 'center'
            }
        } >
        <
        Container maxWidth = "sm" >
        <
        Typography component = "h1"
        variant = "h2"
        color = "primary"
        gutterBottom >
        FireFlyDex <
        /Typography> <
        Typography variant = "h5"
        color = "text.secondary"
        paragraph >
        Trade cryptocurrencies securely and efficiently on the FireFly blockchain.Experience the future of decentralized trading. <
        /Typography> <
        Button variant = "contained"
        color = "primary"
        size = "large"
        onClick = {
            () => navigate('/trading')
        }
        sx = {
            { mt: 4 }
        } >
        Start Trading <
        /Button> < /
        Container > <
        /Box>

        { /* Features Section */ } <
        Container sx = {
            { py: 8 }
        }
        maxWidth = "md" >
        <
        Grid container spacing = { 4 } > {
            features.map((feature, index) => ( <
                Grid item key = { index }
                xs = { 12 }
                sm = { 6 }
                md = { 4 } >
                <
                Card sx = {
                    {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2
                    }
                } >
                <
                Box sx = {
                    { color: 'primary.main', mb: 2 }
                } > { feature.icon } <
                /Box> <
                CardContent >
                <
                Typography gutterBottom variant = "h5"
                component = "h2" > { feature.title } <
                /Typography> <
                Typography color = "text.secondary" > { feature.description } <
                /Typography> < /
                CardContent > <
                /Card> < /
                Grid >
            ))
        } <
        /Grid> < /
        Container > <
        /Box>
    );
};

export default Home;