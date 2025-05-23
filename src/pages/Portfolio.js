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

    return ( <
        Container maxWidth = "xl"
        sx = {
            { mt: 4, mb: 4 }
        } >
        <
        Grid container spacing = { 3 } > { /* Portfolio Summary */ } <
        Grid item xs = { 12 }
        md = { 4 } >
        <
        Paper sx = {
            { p: 2 }
        } >
        <
        Typography variant = "h6"
        gutterBottom >
        Portfolio Value <
        /Typography> <
        Typography variant = "h4"
        color = "primary" >
        $ { portfolioData.totalValue.toLocaleString() } <
        /Typography> <
        Box sx = {
            { height: 300, mt: 2 }
        } >
        <
        Pie data = { pieChartData }
        options = { pieChartOptions }
        /> < /
        Box > <
        /Paper> < /
        Grid >

        { /* Assets Table */ } <
        Grid item xs = { 12 }
        md = { 8 } >
        <
        Paper sx = {
            { p: 2 }
        } >
        <
        Typography variant = "h6"
        gutterBottom >
        Your Assets <
        /Typography> <
        TableContainer >
        <
        Table >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell > Asset < /TableCell> <
        TableCell align = "right" > Amount < /TableCell> <
        TableCell align = "right" > Value(USD) < /TableCell> <
        TableCell align = "right" > % of Portfolio < /TableCell> < /
        TableRow > <
        /TableHead> <
        TableBody > {
            portfolioData.assets.map((asset) => ( <
                TableRow key = { asset.symbol } >
                <
                TableCell > { asset.symbol } < /TableCell> <
                TableCell align = "right" > { asset.amount } < /TableCell> <
                TableCell align = "right" >
                $ { asset.value.toLocaleString() } <
                /TableCell> <
                TableCell align = "right" > {
                    ((asset.value / portfolioData.totalValue) * 100).toFixed(2)
                } %
                <
                /TableCell> < /
                TableRow >
            ))
        } <
        /TableBody> < /
        Table > <
        /TableContainer> < /
        Paper > <
        /Grid>

        { /* Transaction History */ } <
        Grid item xs = { 12 } >
        <
        Paper sx = {
            { p: 2 }
        } >
        <
        Typography variant = "h6"
        gutterBottom >
        Transaction History <
        /Typography> <
        TableContainer >
        <
        Table >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell > Date < /TableCell> <
        TableCell > Type < /TableCell> <
        TableCell > Pair < /TableCell> <
        TableCell align = "right" > Amount < /TableCell> <
        TableCell align = "right" > Price < /TableCell> <
        TableCell align = "right" > Total < /TableCell> <
        TableCell > Status < /TableCell> < /
        TableRow > <
        /TableHead> <
        TableBody > {
            portfolioData.transactions.map((tx) => ( <
                TableRow key = { tx.id } >
                <
                TableCell > { tx.date } < /TableCell> <
                TableCell >
                <
                Chip label = { tx.type.toUpperCase() }
                color = { tx.type === 'buy' ? 'success' : 'error' }
                size = "small" /
                >
                <
                /TableCell> <
                TableCell > { tx.pair } < /TableCell> <
                TableCell align = "right" > { tx.amount } < /TableCell> <
                TableCell align = "right" > $ { tx.price } < /TableCell> <
                TableCell align = "right" > $ { tx.total } < /TableCell> <
                TableCell >
                <
                Chip label = { tx.status }
                color = "primary"
                size = "small" /
                >
                <
                /TableCell> < /
                TableRow >
            ))
        } <
        /TableBody> < /
        Table > <
        /TableContainer> < /
        Paper > <
        /Grid> < /
        Grid > <
        /Container>
    );
};

export default Portfolio;