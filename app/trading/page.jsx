// path: ./app/trading/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trading = () => {
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('ETH/USDT');
  const [realTimePrice, setRealTimePrice] = useState(0);
  const [orderBook, setOrderBook] = useState({
    asks: [
      { price: 2300.50, amount: 1.25, total: 2875.63 },
      { price: 2300.25, amount: 2.50, total: 5750.63 },
      { price: 2300.00, amount: 3.75, total: 8625.00 },
      { price: 2299.75, amount: 1.00, total: 2299.75 },
      { price: 2299.50, amount: 2.25, total: 5173.88 },
    ],
    bids: [
      { price: 2299.25, amount: 2.00, total: 4598.50 },
      { price: 2299.00, amount: 1.50, total: 3448.50 },
      { price: 2298.75, amount: 3.25, total: 7470.94 },
      { price: 2298.50, amount: 1.75, total: 4022.38 },
      { price: 2298.25, amount: 2.50, total: 5745.63 },
    ]
  });
  const [chartData, setChartData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Price',
        data: [2000, 2100, 2050, 2200, 2150, 2300],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointStyle: 'rect',
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#232324',
        titleColor: '#FF6B6B',
        bodyColor: '#FFFFFF',
        borderColor: '#FF6B6B',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(35, 35, 36, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#232324',
          font: {
            family: 'Press Start 2P',
            size: 8
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(35, 35, 36, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#232324',
          font: {
            family: 'Press Start 2P',
            size: 8
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

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
          {/* Price Chart */}
          <div className="flex-1 bg-white border-2 border-deepblue rounded-pixel shadow-pixel p-6 mb-4 md:mb-0">
            <div className="mb-4">
              <div className="text-xl text-deepblue mb-2">{selectedPair} Price Chart</div>
              <div className="text-3xl text-coral mb-2">${realTimePrice.toLocaleString()}</div>
            </div>
            <div className="h-64 bg-skyblue/30 rounded-pixel border-2 border-deepblue p-4">
              <Line data={chartData} options={chartOptions} />
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
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00"
                className="block w-full mt-1 p-2 border-2 border-deepblue rounded-pixel bg-skyblue text-deepblue font-pixel" 
              />
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
