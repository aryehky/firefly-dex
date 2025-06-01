import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  const [wsConnection, setWsConnection] = useState(null);
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: [],
  });

  const [chartData, setChartData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Price',
        data: [2000, 2100, 2050, 2200, 2150, 2300],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  useEffect(() => {
    // Mock WebSocket connection
    const ws = new WebSocket('wss://mock-websocket-url');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'price') {
        setRealTimePrice(data.price);
        updateChart(data.price);
      } else if (data.type === 'orderbook') {
        setOrderBook(data.orderbook);
      }
    };

    setWsConnection(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const updateChart = (newPrice) => {
    setChartData((prevData) => {
      const newData = { ...prevData };
      newData.datasets[0].data = [...newData.datasets[0].data.slice(1), newPrice];
      return newData;
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order submitted:', { orderType, amount, price, selectedPair });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rainbow-100 via-rainbow-400 to-rainbow-700 animate-gradient-xy">
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" className="text-white font-bold mb-8 text-center">
          Trading
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Box className="mb-4">
                <Typography variant="h6" className="text-white mb-2">
                  {selectedPair} Price Chart
                </Typography>
                <Typography variant="h4" className="text-white">
                  ${realTimePrice.toLocaleString()}
                </Typography>
              </Box>
              <Box className="h-[400px]">
                <Line
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: 'white',
                        },
                      },
                    },
                    scales: {
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'white',
                        },
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'white',
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Typography variant="h6" className="text-white mb-4">
                Place Order
              </Typography>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <FormControl fullWidth>
                  <InputLabel className="text-white">Order Type</InputLabel>
                  <Select
                    value={orderType}
                    label="Order Type"
                    onChange={(e) => setOrderType(e.target.value)}
                    className="text-white bg-white/5"
                  >
                    <MenuItem value="market">Market</MenuItem>
                    <MenuItem value="limit">Limit</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel className="text-white">Trading Pair</InputLabel>
                  <Select
                    value={selectedPair}
                    label="Trading Pair"
                    onChange={(e) => setSelectedPair(e.target.value)}
                    className="text-white bg-white/5"
                  >
                    <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                    <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                    <MenuItem value="ETH/BTC">ETH/BTC</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5"
                  InputLabelProps={{ className: 'text-white' }}
                  inputProps={{ className: 'text-white' }}
                />

                {orderType === 'limit' && (
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-white/5"
                    InputLabelProps={{ className: 'text-white' }}
                    inputProps={{ className: 'text-white' }}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="bg-gradient-to-r from-rainbow-100 via-rainbow-400 to-rainbow-700 text-white hover:opacity-90"
                >
                  Place Order
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Typography variant="h6" className="text-white mb-4">
                Order Book
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="text-red-400 mb-2">
                    Asks
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white">Price</TableCell>
                          <TableCell className="text-white">Amount</TableCell>
                          <TableCell className="text-white">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderBook.asks.map((ask, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell className="text-red-400">{ask.price}</TableCell>
                            <TableCell className="text-white">{ask.amount}</TableCell>
                            <TableCell className="text-white">{ask.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="text-green-400 mb-2">
                    Bids
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white">Price</TableCell>
                          <TableCell className="text-white">Amount</TableCell>
                          <TableCell className="text-white">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderBook.bids.map((bid, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell className="text-green-400">{bid.price}</TableCell>
                            <TableCell className="text-white">{bid.amount}</TableCell>
                            <TableCell className="text-white">{bid.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Trading;