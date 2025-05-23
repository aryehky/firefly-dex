import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
            updateNetworkInfo();
            updateBalance(accounts[0]);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          updateBalance(accounts[0]);
        } else {
          setWalletConnected(false);
          setWalletAddress('');
          setBalance('0.00');
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        updateNetworkInfo();
      });
    }
  }, []);

  const updateNetworkInfo = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
    } catch (error) {
      console.error('Error getting network info:', error);
    }
  };

  const updateBalance = async (address) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      // Convert balance from wei to ETH
      const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
      setBalance(ethBalance);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          updateNetworkInfo();
          updateBalance(accounts[0]);
          handleClose();
        }
      } else {
        alert('Please install MetaMask to use this feature');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x3':
        return 'Ropsten Testnet';
      case '0x4':
        return 'Rinkeby Testnet';
      case '0x5':
        return 'Goerli Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          FireFlyDex
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/trading')}>
            Trading
          </Button>
          <Button color="inherit" onClick={() => navigate('/portfolio')}>
            Portfolio
          </Button>
          {walletConnected && (
            <>
              <Tooltip title="Network Status">
                <Chip
                  icon={<SignalCellularAltIcon />}
                  label={getNetworkName(network)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Wallet Balance">
                <Chip
                  icon={<AccountBalanceIcon />}
                  label={`${balance} ETH`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
            </>
          )}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="wallet"
            aria-controls="wallet-menu"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
          <Menu
            id="wallet-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {walletConnected ? (
              <>
                <MenuItem disabled>
                  {formatAddress(walletAddress)}
                </MenuItem>
                <MenuItem onClick={handleClose}>Disconnect</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleWalletConnect}>Connect Wallet</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;