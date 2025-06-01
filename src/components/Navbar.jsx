import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningIcon from '@mui/icons-material/Warning';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isValidNetwork, setIsValidNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      validateNetwork(chainId);
    } catch (error) {
      console.error('Error getting network info:', error);
    }
  };

  const validateNetwork = (chainId) => {
    // Replace with actual FireFly network chainId
    const validChainId = '0x1';
    setIsValidNetwork(chainId === validChainId);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Replace with actual FireFly chainId
      });
    } catch (error) {
      if (error.code === 4902) {
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
        } catch (addError) {
          alert('Failed to add FireFly network');
        }
      } else {
        alert('Failed to switch network');
      }
    }
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
              <Tooltip title={isValidNetwork ? "Network Status" : "Please switch to FireFly Network"}>
                <Chip
                  icon={isValidNetwork ? <SignalCellularAltIcon /> : <WarningIcon />}
                  label={getNetworkName(network)}
                  color={isValidNetwork ? "primary" : "error"}
                  variant="outlined"
                  size="small"
                  onClick={handleNetworkSwitch}
                  sx={{ cursor: 'pointer' }}
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
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <AccountBalanceWalletIcon />}
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