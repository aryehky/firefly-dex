// path: ./components/Navbar.jsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState(0);
  const [isValidNetwork, setIsValidNetwork] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateNetworkInfo = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', updateNetworkInfo);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      updateNetworkInfo();
    }
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
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

  return (
    <nav className="w-full z-50 sticky top-0 bg-skyblue border-b-4 border-deepblue shadow-pixel font-pixel">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-deepblue text-2xl focus:outline-none">≡</button>
          <span className="rainbow-text text-2xl cursor-pointer" onClick={() => router.push('/')}>FireFlyDex</span>
          <div className="hidden md:flex gap-4 ml-8">
            <button onClick={() => router.push('/')} className="text-deepblue hover:text-coral px-3 py-1">HOME</button>
            <button onClick={() => router.push('/trading')} className="text-deepblue hover:text-coral px-3 py-1">TRADING</button>
            <button onClick={() => router.push('/portfolio')} className="text-deepblue hover:text-coral px-3 py-1">PORTFOLIO</button>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          {!isValidNetwork && (
            <button
              onClick={handleNetworkSwitch}
              className="text-deepblue hover:text-coral px-3 py-1"
            >
              Switch to Ethereum Mainnet
            </button>
          )}
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <span className="bg-mint text-deepblue px-2 py-1 rounded-pixel border-2 border-deepblue">{network}</span>
              <span className="bg-mint text-deepblue px-2 py-1 rounded-pixel border-2 border-deepblue">{balance.toFixed(4)} ETH</span>
              <span className="bg-mint text-deepblue px-2 py-1 rounded-pixel border-2 border-deepblue">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="font-pixel bg-coral text-cloud border-2 border-deepblue rounded-pixel px-6 py-2 shadow-pixel hover:scale-105 transition-transform text-lg"
            >
              {isLoading ? '...' : 'CONNECT WALLET'}
            </button>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 bg-skyblue border-b-4 border-deepblue">
          <button onClick={() => router.push('/')} className="text-deepblue hover:text-coral px-3 py-1">HOME</button>
          <button onClick={() => router.push('/trading')} className="text-deepblue hover:text-coral px-3 py-1">TRADING</button>
          <button onClick={() => router.push('/portfolio')} className="text-deepblue hover:text-coral px-3 py-1">PORTFOLIO</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
