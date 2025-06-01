import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const [orderType, setOrderType] = useState('limit');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('BTC/ETH');
  const [realTimePrice, setRealTimePrice] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
    datasets: [
      {
        label: 'BTC/ETH Price',
        data: [0.05, 0.052, 0.051, 0.053, 0.054, 0.052],
        borderColor: '#FF6B6B',
        tension: 0.4,
      },
    ],
  });
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: []
  });

  // WebSocket connection setup
  useEffect(() => {
    const ws = new WebSocket('wss://api.fireflydex.com/ws');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Subscribe to price updates
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'price',
        pair: selectedPair
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'price') {
        setRealTimePrice(data.price);
        // Update chart data
        setChartData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data.slice(1), data.price]
          }]
        }));
      } else if (data.type === 'orderbook') {
        setOrderBook(data.orderbook);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWsConnection(ws);

    return () => {
      ws.close();
    };
  }, [selectedPair]);

  // Update WebSocket subscription when pair changes
  useEffect(() => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'subscribe',
        channel: 'price',
        pair: selectedPair
      }));
    }
  }, [selectedPair, wsConnection]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  // Mock trading history data
  const tradingHistory = [
    {
      id: 1,
      type: 'buy',
      pair: 'BTC/ETH',
      amount: 0.1,
      price: 0.052,
      total: 0.0052,
      status: 'completed',
      date: '2024-03-15 14:30',
    },
    {
      id: 2,
      type: 'sell',
      pair: 'BTC/ETH',
      amount: 0.05,
      price: 0.053,
      total: 0.00265,
      status: 'pending',
      date: '2024-03-15 14:25',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement order submission logic
    console.log('Order submitted:', { orderType, amount, price, selectedPair });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Price Chart - {selectedPair}
            </Typography>
            {realTimePrice && (
              <Typography variant="h4" color="primary" gutterBottom>
                ${realTimePrice.toFixed(2)}
              </Typography>
            )}
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Order Book */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Book
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="error">
                Asks
              </Typography>
              {orderBook.asks.map((ask, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="error">{ask.price}</Typography>
                  <Typography>{ask.amount}</Typography>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="success.main">
                Bids
              </Typography>
              {orderBook.bids.map((bid, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="success.main">{bid.price}</Typography>
                  <Typography>{bid.amount}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Trading Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Place Order
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trading Pair</InputLabel>
                    <Select
                      value={selectedPair}
                      label="Trading Pair"
                      onChange={(e) => setSelectedPair(e.target.value)}
                    >
                      <MenuItem value="BTC/ETH">BTC/ETH</MenuItem>
                      <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                      <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      value={orderType}
                      label="Order Type"
                      onChange={(e) => setOrderType(e.target.value)}
                    >
                      <MenuItem value="market">Market</MenuItem>
                      <MenuItem value="limit">Limit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
                {orderType === 'limit' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Place Order
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Trading History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Pair</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradingHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Chip
                          label={order.type.toUpperCase()}
                          color={order.type === 'buy' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{order.pair}</TableCell>
                      <TableCell align="right">{order.amount}</TableCell>
                      <TableCell align="right">{order.price}</TableCell>
                      <TableCell align="right">{order.total}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Trading;