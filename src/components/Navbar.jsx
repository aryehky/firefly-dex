import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningIcon from '@mui/icons-material/Warning';

const Navbar = () => {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState(0);
  const [isValidNetwork, setIsValidNetwork] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const updateNetworkInfo = useCallback(async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const validChainId = '0x1'; // Ethereum Mainnet
        setIsValidNetwork(chainId === validChainId);
        setNetwork(chainId === validChainId ? 'Ethereum Mainnet' : 'Unknown Network');
      } catch (error) {
        console.error('Error getting network:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', updateNetworkInfo);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      updateNetworkInfo();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', updateNetworkInfo);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [updateNetworkInfo]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      updateBalance(accounts[0]);
    } else {
      setWalletConnected(false);
      setWalletAddress('');
      setBalance(0);
    }
  };

  const updateBalance = async (address) => {
    if (window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        setBalance(parseInt(balance, 16) / 1e18);
      } catch (error) {
        console.error('Error getting balance:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      setIsLoading(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
      setIsLoading(false);
    }
  };

  const handleNetworkSwitch = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
                blockExplorerUrls: ['https://etherscan.io'],
              }],
            });
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        }
      }
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1':
        return 'FireFly Network';
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
    <AppBar position="static" className="bg-transparent backdrop-blur-lg border-b border-white/20">
      <Toolbar className="justify-between">
        <div className="flex items-center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            className="text-white mr-4"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="rainbow-text font-bold">
            FireFlyDex
          </Typography>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-12"
        >
          <MenuItem onClick={() => handleNavigation('/')} className="text-white hover:bg-white/10">
            Home
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/trading')} className="text-white hover:bg-white/10">
            Trading
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/portfolio')} className="text-white hover:bg-white/10">
            Portfolio
          </MenuItem>
        </Menu>

        <div className="flex items-center gap-4">
          {!isValidNetwork && (
            <Tooltip title="Switch to Ethereum Mainnet">
              <Chip
                label="Wrong Network"
                color="error"
                onClick={handleNetworkSwitch}
                className="cursor-pointer"
              />
            </Tooltip>
          )}
          
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <Chip
                label={network}
                className="bg-white/10 text-white border border-white/20"
              />
              <Chip
                label={`${balance.toFixed(4)} ETH`}
                className="bg-white/10 text-white border border-white/20"
              />
              <Chip
                label={`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                className="bg-white/10 text-white border border-white/20"
              />
            </div>
          ) : (
            <Button
              variant="contained"
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-gradient-to-r from-rainbow-100 via-rainbow-400 to-rainbow-700 text-white hover:opacity-90"
            >
              {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 