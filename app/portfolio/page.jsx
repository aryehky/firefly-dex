// path:  ./app/portfolio/page.jsx
"use client";
import React, { useState } from 'react';

const Portfolio = () => {
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioData] = useState({
    totalValue: 10000,
    change: 500,
    assets: [
      { symbol: 'ETH', amount: 2.5, value: 5000, change: 200 },
      { symbol: 'BTC', amount: 0.1, value: 3000, change: -100 },
      { symbol: 'USDC', amount: 2000, value: 2000, change: 0 },
    ],
    transactions: [
      { type: 'buy', symbol: 'ETH', amount: 1.5, price: 2000, timestamp: '2024-02-20T10:00:00Z' },
      { type: 'sell', symbol: 'BTC', amount: 0.05, price: 30000, timestamp: '2024-02-19T15:30:00Z' },
      { type: 'buy', symbol: 'USDC', amount: 1000, price: 1, timestamp: '2024-02-18T09:15:00Z' },
    ],
  });

  const filteredTransactions = portfolioData.transactions.filter((transaction) => {
    const matchesFilter = transactionFilter === 'all' || transaction.type === transactionFilter;
    const matchesSearch = transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full px-4 md:px-0 font-pixel bg-skyblue">
      <div className="w-full max-w-5xl mt-12 mb-8">
        <h1 className="text-4xl md:text-5xl text-deepblue font-pixel mb-2">PORTFOLIO</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-cloud border-2 border-deepblue rounded-pixel shadow-pixel p-6 flex flex-col items-center">
            <div className="text-xl text-deepblue mb-2">Portfolio Value</div>
            <div className="text-3xl text-coral mb-2">${portfolioData.totalValue.toLocaleString()}</div>
            <div className="text-lg text-mint">Change: {portfolioData.change >= 0 ? '+' : ''}{portfolioData.change}</div>
          </div>
          <div className="bg-cloud border-2 border-deepblue rounded-pixel shadow-pixel p-6 flex flex-col items-center col-span-2">
            <div className="text-xl text-deepblue mb-2">Assets</div>
            <table className="w-full text-left font-pixel">
              <thead>
                <tr className="text-deepblue">
                  <th>Symbol</th><th>Amount</th><th>Value</th><th>Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.assets.map((asset, i) => (
                  <tr key={i} className="hover:bg-skyblue/30">
                    <td>{asset.symbol}</td>
                    <td>{asset.amount}</td>
                    <td>${asset.value}</td>
                    <td className={asset.change >= 0 ? 'text-mint' : 'text-coral'}>{asset.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Transactions */}
        <div className="bg-cloud border-2 border-deepblue rounded-pixel shadow-pixel p-6">
          <div className="text-xl text-deepblue mb-4">Transactions</div>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search Symbol"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel"
            />
            <select
              value={transactionFilter}
              onChange={e => setTransactionFilter(e.target.value)}
              className="p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel"
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <table className="w-full text-left font-pixel">
            <thead>
              <tr className="text-deepblue">
                <th>Type</th><th>Symbol</th><th>Amount</th><th>Price</th><th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, i) => (
                <tr key={i} className="hover:bg-skyblue/30">
                  <td className={tx.type === 'buy' ? 'text-mint' : 'text-coral'}>{tx.type}</td>
                  <td>{tx.symbol}</td>
                  <td>{tx.amount}</td>
                  <td>${tx.price}</td>
                  <td>{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
