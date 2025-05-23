import React, { useState } from 'react';
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

        // Mock data for the price chart
        const chartData = {
            labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
            datasets: [{
                label: 'BTC/ETH Price',
                data: [0.05, 0.052, 0.051, 0.053, 0.054, 0.052],
                borderColor: '#FF6B6B',
                tension: 0.4,
            }, ],
        };

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

        // Mock order book data
        const orderBook = {
            bids: [
                { price: 0.052, amount: 1.5 },
                { price: 0.051, amount: 2.3 },
                { price: 0.050, amount: 3.1 },
            ],
            asks: [
                { price: 0.053, amount: 1.2 },
                { price: 0.054, amount: 2.1 },
                { price: 0.055, amount: 1.8 },
            ],
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            // TODO: Implement order submission logic
            console.log('Order submitted:', { orderType, amount, price, selectedPair });
        };

        return ( <
                Container maxWidth = "xl"
                sx = {
                    { mt: 4, mb: 4 }
                } >
                <
                Grid container spacing = { 3 } > { /* Price Chart */ } <
                Grid item xs = { 12 }
                md = { 8 } >
                <
                Paper sx = {
                    { p: 2 }
                } >
                <
                Typography variant = "h6"
                gutterBottom >
                Price Chart <
                /Typography> <
                Box sx = {
                    { height: 400 }
                } >
                <
                Line data = { chartData }
                options = { chartOptions }
                /> < /
                Box > <
                /Paper> < /
                Grid >

                { /* Order Book */ } <
                Grid item xs = { 12 }
                md = { 4 } >
                <
                Paper sx = {
                    { p: 2 }
                } >
                <
                Typography variant = "h6"
                gutterBottom >
                Order Book <
                /Typography> <
                Box sx = {
                    { mb: 2 }
                } >
                <
                Typography variant = "subtitle2"
                color = "error" >
                Asks <
                /Typography> {
                orderBook.asks.map((ask, index) => ( <
                    Box key = { index }
                    sx = {
                        { display: 'flex', justifyContent: 'space-between' }
                    } >
                    <
                    Typography color = "error" > { ask.price } < /Typography> <
                    Typography > { ask.amount } < /Typography> < /
                    Box >
                ))
            } <
            /Box> <
        Box >
            <
            Typography variant = "subtitle2"
        color = "success.main" >
            Bids <
            /Typography> {
        orderBook.bids.map((bid, index) => ( <
            Box key = { index }
            sx = {
                { display: 'flex', justifyContent: 'space-between' }
            } >
            <
            Typography color = "success.main" > { bid.price } < /Typography> <
            Typography > { bid.amount } < /Typography> < /
            Box >
        ))
    } <
    /Box> < /
    Paper > <
    /Grid>

{ /* Trading Form */ } <
Grid item xs = { 12 } >
    <
    Paper sx = {
        { p: 2 }
    } >
    <
    Typography variant = "h6"
gutterBottom >
    Place Order <
    /Typography> <
Box component = "form"
onSubmit = { handleSubmit }
sx = {
        { mt: 2 }
    } >
    <
    Grid container spacing = { 2 } >
    <
    Grid item xs = { 12 }
sm = { 6 } >
    <
    FormControl fullWidth >
    <
    InputLabel > Trading Pair < /InputLabel> <
Select value = { selectedPair }
label = "Trading Pair"
onChange = {
        (e) => setSelectedPair(e.target.value)
    } >
    <
    MenuItem value = "BTC/ETH" > BTC / ETH < /MenuItem> <
MenuItem value = "ETH/USDT" > ETH / USDT < /MenuItem> <
MenuItem value = "BTC/USDT" > BTC / USDT < /MenuItem> < /
    Select > <
    /FormControl> < /
    Grid > <
    Grid item xs = { 12 }
sm = { 6 } >
    <
    FormControl fullWidth >
    <
    InputLabel > Order Type < /InputLabel> <
Select value = { orderType }
label = "Order Type"
onChange = {
        (e) => setOrderType(e.target.value)
    } >
    <
    MenuItem value = "market" > Market < /MenuItem> <
MenuItem value = "limit" > Limit < /MenuItem> < /
    Select > <
    /FormControl> < /
    Grid > <
    Grid item xs = { 12 }
sm = { 6 } >
    <
    TextField fullWidth label = "Amount"
type = "number"
value = { amount }
onChange = {
    (e) => setAmount(e.target.value)
}
/> < /
Grid > {
        orderType === 'limit' && ( <
            Grid item xs = { 12 }
            sm = { 6 } >
            <
            TextField fullWidth label = "Price"
            type = "number"
            value = { price }
            onChange = {
                (e) => setPrice(e.target.value)
            }
            /> < /
            Grid >
        )
    } <
    Grid item xs = { 12 } >
    <
    Button type = "submit"
variant = "contained"
color = "primary"
fullWidth size = "large" >
    Place Order <
    /Button> < /
    Grid > <
    /Grid> < /
    Box > <
    /Paper> < /
    Grid > <
    /Grid> < /
    Container >
);
};

export default Trading;