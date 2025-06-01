import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tabs,
    Tab,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

const Portfolio = () => {
    const [tabValue, setTabValue] = useState(0);
    const [timeRange, setTimeRange] = useState('1M');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock portfolio data
    const portfolioData = {
        totalValue: 12500.00,
        assets: [
            { symbol: 'BTC', amount: 0.5, value: 25000.00 },
            { symbol: 'ETH', amount: 5.0, value: 10000.00 },
            { symbol: 'USDT', amount: 5000.00, value: 5000.00 },
        ],
        transactions: [{
                id: 1,
                type: 'buy',
                pair: 'BTC/ETH',
                amount: 0.1,
                price: 0.05,
                total: 0.005,
                date: '2024-02-20 14:30:00',
                status: 'completed',
            },
            {
                id: 2,
                type: 'sell',
                pair: 'ETH/USDT',
                amount: 1.0,
                price: 2000,
                total: 2000,
                date: '2024-02-19 10:15:00',
                status: 'completed',
            },
        ],
        performance: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [10000, 10500, 11000, 10800, 11500, 12500],
        },
    };

    // Prepare data for pie chart
    const pieChartData = {
        labels: portfolioData.assets.map(asset => asset.symbol),
        datasets: [{
            data: portfolioData.assets.map(asset => asset.value),
            backgroundColor: [
                '#FF6B6B',
                '#4ECDC4',
                '#45B7D1',
            ],
        }, ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    // Prepare data for performance chart
    const performanceChartData = {
        labels: portfolioData.performance.labels,
        datasets: [{
            label: 'Portfolio Value (USD)',
            data: portfolioData.performance.data,
            borderColor: '#FF6B6B',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
        }],
    };

    const performanceChartOptions = {
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

    // Calculate portfolio performance metrics
    const calculatePerformanceMetrics = () => {
        const data = portfolioData.performance.data;
        const currentValue = data[data.length - 1];
        const previousValue = data[0];
        const change = currentValue - previousValue;
        const percentageChange = (change / previousValue) * 100;

        return {
            change,
            percentageChange,
            isPositive: change >= 0
        };
    };

    const performanceMetrics = calculatePerformanceMetrics();

    // Filter transactions based on search and filter criteria
    const filteredTransactions = portfolioData.transactions.filter(transaction => {
        const matchesSearch = transaction.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            transaction.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = transactionFilter === 'all' || transaction.type === transactionFilter;
        return matchesSearch && matchesFilter;
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return ( <
        Container maxWidth = "lg"
        sx = {
            { mt: 4, mb: 4 }
        } >
        <
        Typography variant = "h4"
        gutterBottom >
        Portfolio <
        /Typography>

        {
            /* Portfolio Summary */
            <
            Grid container spacing = { 3 }
            sx = {
                { mb: 4 }
            } >
            <
            Grid item xs = { 12 }
            md = { 6 } >
            <
            Paper sx = {
                { p: 2 }
            } >
            <
            Typography variant = "h6"
            gutterBottom >
            Portfolio Value <
            /Typography>
            <
            Typography variant = "h4"
            color = "primary" >
            $ { portfolioData.totalValue.toLocaleString() } <
            </Typography>
            <
            Box sx = {
                { display: 'flex', alignItems: 'center', mt: 1 }
            } >
            <
            Typography variant = "body1"
            color = { performanceMetrics.isPositive ? 'success.main' : 'error.main' } >
            { performanceMetrics.isPositive ? '+' : '' }
            { performanceMetrics.percentageChange.toFixed(2) } % <
            </Typography>
            <
            Typography variant = "body2"
            color = "text.secondary"
            sx = {
                { ml: 1 }
            } >
            ({ performanceMetrics.isPositive ? '+' : '' } $ { performanceMetrics.change.toLocaleString() }) <
            </Typography>
            </
            Box >
            <
            Box sx = {
                { height: 300, mt: 2 }
            } >
            <
            Line data = { performanceChartData }
            options = { performanceChartOptions } />
            </
            Box >
            </
            Paper >
            </
            Grid >
            <
            Grid item xs = { 12 }
            md = { 6 } >
            <
            Paper sx = {
                { p: 2 }
            } >
            <
            Typography variant = "h6"
            gutterBottom >
            Asset Allocation <
            /Typography>
            <
            Box sx = {
                { height: 300 }
            } >
            <
            Pie data = { pieChartData }
            options = { pieChartOptions } />
            </
            Box >
            </
            Paper >
            </
            Grid >
            </
            Grid >
        }

        <
        Box sx = {
            { borderBottom: 1, borderColor: 'divider', mb: 3 }
        } >
        <
        Tabs value = { tabValue }
        onChange = { handleTabChange } >
        <
        Tab label = "Assets" / >
        <
        Tab label = "Transaction History" / >
        <
        /Tabs> < /
        Box >

        {
            tabValue === 0 && ( <
                TableContainer component = { Paper } >
                <
                Table >
                <
                TableHead >
                <
                TableRow >
                <
                TableCell > Asset < /TableCell> <
                TableCell align = "right" > Balance < /TableCell> <
                TableCell align = "right" > Value(USD) < /TableCell> <
                TableCell align = "right" > % of Portfolio < /TableCell> < /
                TableRow > <
                /TableHead> <
                TableBody > {
                    portfolioData.assets.map((asset) => ( <
                        TableRow key = { asset.symbol } >
                        <
                        TableCell component = "th"
                        scope = "row" > { asset.symbol } <
                        /TableCell> <
                        TableCell align = "right" > { asset.amount } < /TableCell> <
                        TableCell align = "right" > $ { asset.value.toLocaleString() } < /TableCell> <
                        TableCell align = "right" > { ((asset.value / portfolioData.totalValue) * 100).toFixed(2) } % < /TableCell> < /
                        TableRow >
                    ))
                } <
                /TableBody> < /
                Table > <
                /TableContainer>
            )
        }

        {
            tabValue === 1 && ( <
                <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Search Transactions"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Type</InputLabel>
                                <Select
                                    value={transactionFilter}
                                    label="Filter by Type"
                                    onChange={(e) => setTransactionFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="buy">Buy</MenuItem>
                                    <MenuItem value="sell">Sell</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Time Range</InputLabel>
                                <Select
                                    value={timeRange}
                                    label="Time Range"
                                    onChange={(e) => setTimeRange(e.target.value)}
                                >
                                    <MenuItem value="1W">1 Week</MenuItem>
                                    <MenuItem value="1M">1 Month</MenuItem>
                                    <MenuItem value="3M">3 Months</MenuItem>
                                    <MenuItem value="1Y">1 Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table>
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
                                {filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            <Chip
                                                label={transaction.type.toUpperCase()}
                                                color={transaction.type === 'buy' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{transaction.pair}</TableCell>
                                        <TableCell align="right">{transaction.amount}</TableCell>
                                        <TableCell align="right">${transaction.price}</TableCell>
                                        <TableCell align="right">${transaction.total}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.status}
                                                color={getStatusColor(transaction.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )
        } <
        /Container>
    );
};

export default Portfolio;