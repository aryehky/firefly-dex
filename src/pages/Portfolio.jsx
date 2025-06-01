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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={timeRange} onChange={(e, newValue) => setTimeRange(newValue)}>
                <Tab label="1D" value="1D" />
                <Tab label="1W" value="1W" />
                <Tab label="1M" value="1M" />
                <Tab label="1Y" value="1Y" />
                <Tab label="ALL" value="ALL" />
              </Tabs>
            </Box>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Value
            </Typography>
            <Typography variant="h4" gutterBottom>
              ${portfolioData.totalValue.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                color={performance.change >= 0 ? 'success.main' : 'error.main'}
              >
                {performance.change >= 0 ? '+' : ''}${performance.change.toLocaleString()}
              </Typography>
              <Typography
                variant="body1"
                color={performance.change >= 0 ? 'success.main' : 'error.main'}
              >
                ({performance.change >= 0 ? '+' : ''}{performance.percentageChange}%)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 200 }}
              />
              <FormControl size="small" sx={{ width: 200 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={transactionFilter}
                  label="Filter"
                  onChange={(e) => setTransactionFilter(e.target.value)}
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
                    <TableCell>Type</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={transaction.type.toUpperCase()}
                          color={transaction.type === 'buy' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{transaction.symbol}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>${transaction.price.toLocaleString()}</TableCell>
                      <TableCell>
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
  );
};

export default Portfolio;