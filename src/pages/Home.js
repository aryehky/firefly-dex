import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Secure Trading',
            description: 'Advanced security measures to protect your assets and transactions',
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
        },
        {
            title: 'Lightning Fast',
            description: 'High-performance trading engine for instant order execution',
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
        },
        {
            title: 'Easy Integration',
            description: 'Seamless integration with popular wallets and trading tools',
            icon: <IntegrationInstructionsIcon sx={{ fontSize: 40 }} />,
        },
    ];

    return (
        <Container maxWidth="lg">
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 8,
                    pb: 6,
                    textAlign: 'center',
                }}
            >
                <Typography
                    component="h1"
                    variant="h2"
                    color="text.primary"
                    gutterBottom
                >
                    Welcome to FireFlyDex
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    The next generation decentralized exchange for seamless crypto trading
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/trading')}
                    sx={{ mt: 4 }}
                >
                    Start Trading
                </Button>
            </Box>

            {/* Features Section */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {features.map((feature, index) => (
                    <Grid item key={index} xs={12} md={4}>
                        <Box
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography color="text.secondary">
                                {feature.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;