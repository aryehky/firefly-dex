import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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

const Portfolio = () => {
  const [timeRange, setTimeRange] = useState('1D');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 10000,
    change: 500,
    changePercentage: 5.2,
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

  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [8000, 8500, 9200, 8800, 9500, 10000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  const calculatePerformanceMetrics = () => {
    const currentValue = portfolioData.totalValue;
    const previousValue = currentValue - portfolioData.change;
    const percentageChange = (portfolioData.change / previousValue) * 100;

    return {
      change: portfolioData.change,
      percentageChange: percentageChange.toFixed(2),
    };
  };

  const filteredTransactions = portfolioData.transactions.filter((transaction) => {
    const matchesFilter = transactionFilter === 'all' || transaction.type === transactionFilter;
    const matchesSearch = transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const performance = calculatePerformanceMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rainbow-100 via-rainbow-400 to-rainbow-700 animate-gradient-xy">
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" className="text-white font-bold mb-8 text-center">
          Portfolio
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Box className="border-b border-white/20 mb-4">
                <Tabs 
                  value={timeRange} 
                  onChange={(e, newValue) => setTimeRange(newValue)}
                  className="text-white"
                >
                  <Tab label="1D" value="1D" className="text-white" />
                  <Tab label="1W" value="1W" className="text-white" />
                  <Tab label="1M" value="1M" className="text-white" />
                  <Tab label="1Y" value="1Y" className="text-white" />
                  <Tab label="ALL" value="ALL" className="text-white" />
                </Tabs>
              </Box>
              <Box className="h-[400px]">
                <Line 
                  data={chartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: 'white'
                        }
                      }
                    },
                    scales: {
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'white'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'white'
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Typography variant="h6" className="text-white mb-4">
                Portfolio Value
              </Typography>
              <Typography variant="h4" className="text-white mb-4">
                ${portfolioData.totalValue.toLocaleString()}
              </Typography>
              <Box className="flex items-center gap-2">
                <Typography
                  variant="body1"
                  className={performance.change >= 0 ? 'text-green-400' : 'text-red-400'}
                >
                  {performance.change >= 0 ? '+' : ''}${performance.change.toLocaleString()}
                </Typography>
                <Typography
                  variant="body1"
                  className={performance.change >= 0 ? 'text-green-400' : 'text-red-400'}
                >
                  ({performance.change >= 0 ? '+' : ''}{performance.percentageChange}%)
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
              <Box className="mb-6 flex gap-4">
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-white/5"
                  InputLabelProps={{ className: 'text-white' }}
                  inputProps={{ className: 'text-white' }}
                />
                <FormControl size="small" className="w-48">
                  <InputLabel className="text-white">Filter</InputLabel>
                  <Select
                    value={transactionFilter}
                    label="Filter"
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="text-white bg-white/5"
                  >
                    <MenuItem value="all">All Transactions</MenuItem>
                    <MenuItem value="buy">Buys</MenuItem>
                    <MenuItem value="sell">Sells</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-white">Type</TableCell>
                      <TableCell className="text-white">Symbol</TableCell>
                      <TableCell className="text-white">Amount</TableCell>
                      <TableCell className="text-white">Price</TableCell>
                      <TableCell className="text-white">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((transaction, index) => (
                      <TableRow key={index} className="hover:bg-white/5">
                        <TableCell>
                          <Chip
                            label={transaction.type.toUpperCase()}
                            color={transaction.type === 'buy' ? 'success' : 'error'}
                            size="small"
                            className="text-white"
                          />
                        </TableCell>
                        <TableCell className="text-white">{transaction.symbol}</TableCell>
                        <TableCell className="text-white">{transaction.amount}</TableCell>
                        <TableCell className="text-white">${transaction.price.toLocaleString()}</TableCell>
                        <TableCell className="text-white">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Portfolio;