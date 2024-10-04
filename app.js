const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const app = express();

// Set up the view engine and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Replace with your actual Football Data API key
const footballDataAPIKey = 'YOUR_FOOTBALL_DATA_API_KEY';

// Home Route - Show matches for today by default or for a selected date
app.get('/', (req, res) => {
    const selectedDate = req.query.date || dayjs().format('YYYY-MM-DD');
    const apiUrl = `https://api.football-data.org/v2/matches?dateFrom=${selectedDate}&dateTo=${selectedDate}`;

    axios.get(apiUrl, {
        headers: { 'X-Auth-Token': footballDataAPIKey }
    })
    .then(response => {
        const matches = response.data.matches;
        res.render('matches', { matches, selectedDate });
    })
    .catch(error => {
        console.error('Error fetching match data:', error.message);
        res.render('error', { message: 'Failed to load match data. Please try again later.' });
    });
});

// Error handling for invalid routes
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page not found!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
