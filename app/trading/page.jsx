// path: ./app/trading/page.jsx
"use client";

import React, { useState, useEffect } from 'react';

const Trading = () => {
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('ETH/USDT');
  const [realTimePrice, setRealTimePrice] = useState(0);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [chartData, setChartData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Price',
        data: [2000, 2100, 2050, 2200, 2150, 2300],
      },
    ],
  });

  useEffect(() => {
    const ws = new WebSocket('wss://mock-websocket-url');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'price') {
        setRealTimePrice(data.price);
        setChartData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data.slice(1), data.price],
            },
          ],
        }));
      } else if (data.type === 'orderbook') {
        setOrderBook(data.orderbook);
      }
    };
    return () => ws.close();
  }, []);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', { orderType, amount, price, selectedPair });
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full px-4 md:px-0 font-pixel bg-skyblue">
      <div className="w-full max-w-5xl mt-12 mb-8">
        <h1 className="text-4xl md:text-5xl text-deepblue font-pixel mb-2">TRADING</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Price Chart Placeholder */}
          <div className="flex-1 bg-white border-2 border-deepblue rounded-pixel shadow-pixel p-6 mb-4 md:mb-0">
            <div className="mb-4">
              <div className="text-xl text-deepblue mb-2">{selectedPair} Price Chart</div>
              <div className="text-3xl text-coral mb-2">${realTimePrice.toLocaleString()}</div>
            </div>
            <div className="h-64 flex items-center justify-center text-deepblue bg-skyblue/30 rounded-pixel border-2 border-deepblue">
              {/* Replace with a pixel-art chart or keep as placeholder */}
              <span className="font-pixel text-lg">[Chart Placeholder]</span>
            </div>
          </div>
          {/* Place Order */}
          <form onSubmit={handleOrderSubmit} className="flex-1 bg-white border-2 border-deepblue rounded-pixel shadow-pixel p-6 flex flex-col gap-4">
            <div className="text-xl text-deepblue mb-2">Place Order</div>
            <label className="text-deepblue">Order Type
              <select value={orderType} onChange={e => setOrderType(e.target.value)} className="block w-full mt-1 p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel">
                <option value="market">Market</option>
                <option value="limit">Limit</option>
              </select>
            </label>
            <label className="text-deepblue">Trading Pair
              <select value={selectedPair} onChange={e => setSelectedPair(e.target.value)} className="block w-full mt-1 p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel">
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/BTC">ETH/BTC</option>
              </select>
            </label>
            <label className="text-deepblue">Amount
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="block w-full mt-1 p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel" />
            </label>
            {orderType === 'limit' && (
              <label className="text-deepblue">Price
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="block w-full mt-1 p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel" />
              </label>
            )}
            <button type="submit" className="font-pixel bg-coral text-white border-2 border-deepblue rounded-pixel px-6 py-2 shadow-pixel hover:scale-105 transition-transform text-lg mt-2">PLACE ORDER</button>
          </form>
        </div>
        {/* Order Book */}
        <div className="mt-8 bg-white border-2 border-deepblue rounded-pixel shadow-pixel p-6">
          <div className="text-xl text-deepblue mb-4">Order Book</div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="text-coral mb-2">Asks</div>
              <table className="w-full text-left font-pixel">
                <thead>
                  <tr className="text-deepblue">
                    <th>Price</th><th>Amount</th><th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.asks.map((ask, i) => (
                    <tr key={i} className="hover:bg-skyblue/30">
                      <td className="text-coral">{ask.price}</td>
                      <td>{ask.amount}</td>
                      <td>{ask.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex-1">
              <div className="text-mint mb-2">Bids</div>
              <table className="w-full text-left font-pixel">
                <thead>
                  <tr className="text-deepblue">
                    <th>Price</th><th>Amount</th><th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.bids.map((bid, i) => (
                    <tr key={i} className="hover:bg-skyblue/30">
                      <td className="text-mint">{bid.price}</td>
                      <td>{bid.amount}</td>
                      <td>{bid.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
