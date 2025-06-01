import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    TextField,
    Link,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('');
    const [isValidNetwork, setIsValidNetwork] = useState(false);

    const steps = [
        {
            label: 'Connect Wallet',
            description: 'Connect your Web3 wallet to access FireFlyDex',
            icon: <AccountBalanceWalletIcon />,
        },
        {
            label: 'Verify Network',
            description: 'Ensure you are connected to the correct network',
            icon: <SecurityIcon />,
        },
        {
            label: 'Complete Registration',
            description: 'Set up your account preferences',
            icon: <VerifiedUserIcon />,
        },
    ];

    // Check for existing wallet connection
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                        setNetwork(chainId);
                        validateNetwork(chainId);
                        setActiveStep(1);
                    }
                } catch (error) {
                    console.error('Error checking wallet connection:', error);
                }
            }
        };

        checkWalletConnection();
    }, []);

    // Listen for network changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId) => {
                setNetwork(chainId);
                validateNetwork(chainId);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', () => {});
            }
        };
    }, []);

    const validateNetwork = (chainId) => {
        // Replace with actual FireFly network chainId
        const validChainId = '0x1';
        setIsValidNetwork(chainId === validChainId);
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        setError('');

        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    setNetwork(chainId);
                    validateNetwork(chainId);
                    setActiveStep(1);
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

    const handleNetworkSwitch = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }], // Replace with actual FireFly chainId
            });
            setActiveStep(2);
        } catch (error) {
            if (error.code === 4902) {
                // Chain not added to MetaMask
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1',
                            chainName: 'FireFly Network',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://rpc.firefly.network'],
                            blockExplorerUrls: ['https://explorer.firefly.network']
                        }]
                    });
                    setActiveStep(2);
                } catch (addError) {
                    setError('Failed to add FireFly network. Please try again.');
                }
            } else {
                setError('Failed to switch network. Please try again.');
            }
            console.error('Network switch error:', error);
        }
    };

    const handleComplete = () => {
        setIsRegistered(true);
        setTimeout(() => {
            navigate('/trading');
        }, 2000);
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
        Stepper activeStep = { activeStep }
        orientation = "vertical" >
        {
            steps.map((step, index) => (
                <Step key = { step.label } >
                    <StepLabel
                        StepIconComponent = { () => (
                            <Box sx = {
                                { color: activeStep >= index ? 'primary.main' : 'text.secondary' }
                            } >
                                { step.icon }
                            </Box>
                        ) } >
                        { step.label }
                    </StepLabel>
                    <StepContent>
                        <Typography>{step.description}</Typography>
                        <Box sx={{ mb: 2, mt: 2 }}>
                            {index === 0 && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
                                    onClick={connectWallet}
                                    disabled={isConnecting || isRegistered}
                                    fullWidth
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                                </Button>
                            )}
                            {index === 1 && (
                                <>
                                    {!isValidNetwork && (
                                        <Alert severity="warning" sx={{ mb: 2 }}>
                                            Please switch to the FireFly network to continue
                                        </Alert>
                                    )}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleNetworkSwitch}
                                        fullWidth
                                    >
                                        Switch to FireFly Network
                                    </Button>
                                </>
                            )}
                            {index === 2 && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleComplete}
                                    fullWidth
                                >
                                    Complete Setup
                                </Button>
                            )}
                        </Box>
                    </StepContent>
                </Step>
            ))
        }
        </Stepper>

        <
        Box sx = {
            { mt: 4 }
        } >
        <
        Typography variant = "body2"
        color = "text.secondary"
        align = "center" >
        By connecting your wallet, you agree to our{' '}
        <Link href="#" color="primary">
            Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" color="primary">
            Privacy Policy
        </Link>
        </Typography> < /
        Box > <
        /Paper> < /
        Container >
    );
};

export default Auth;