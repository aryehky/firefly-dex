import React, { useState } from 'react';
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
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
    const [tabValue, setTabValue] = useState(0);

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
                TableCell align = "right" > Value(USD) < /TableCell> < /
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
                        TableCell align = "right" > $ { asset.value.toLocaleString() } < /TableCell> < /
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
                TableContainer component = { Paper } >
                <
                Table >
                <
                TableHead >
                <
                TableRow >
                <
                TableCell > Type < /TableCell> <
                TableCell > Asset < /TableCell> <
                TableCell align = "right" > Amount < /TableCell> <
                TableCell align = "right" > Price < /TableCell> <
                TableCell > Date < /TableCell> < /
                TableRow > <
                /TableHead> <
                TableBody > {
                    portfolioData.transactions.map((transaction, index) => ( <
                        TableRow key = { index } >
                        <
                        TableCell component = "th"
                        scope = "row"
                        sx = {
                            {
                                color: transaction.type === 'buy' ? 'success.main' : 'error.main',
                            }
                        } > { transaction.type.toUpperCase() } <
                        /TableCell> <
                        TableCell > { transaction.pair.split('/')[0] } < /TableCell> <
                        TableCell align = "right" > { transaction.amount } < /TableCell> <
                        TableCell align = "right" > $ { transaction.price.toLocaleString() } < /TableCell> <
                        TableCell > { transaction.date } < /TableCell> < /
                        TableRow >
                    ))
                } <
                /TableBody> < /
                Table > <
                /TableContainer>
            )
        } <
        /Container>
    );
};

export default Portfolio;