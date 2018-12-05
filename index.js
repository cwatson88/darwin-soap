const express = require('express');
const cors = require('cors');
const getNextDepartures = require('./Routes/getNextDepartures');
const getDisruptionList = require('./Routes/getDisruptionList');
const getFastestDepartures = require('./Routes/getFastestDepartures');
const getDepartureBoardByCRS = require('./Routes/getDepartureBoardByCRS');
const getDepBoardWithDetails = require('./Routes/getDepBoardWithDetails');
const getHistoricDepartureBoard = require('./Routes/getHistoricDepartureBoard');
const getTOCList = require('./Routes/getTOCList');

const app = express();
const port = process.env.PORT || 3000;

const docs = {
  endpoints: [
    '/getDisruptions/eus',
    '/nextDepartures/eus-bhi/',
    '/departures/eus-bhi/',
    '/departureBoard/eus-bhi/',
    '/fastestDepartures/eus-bhi/',
    '/TOCList',
  ],
};
app.use(cors());
app.get('/', async (req, res) => {
  res.json(docs);
});

app.use('/getDisruptions', getDisruptionList);
app.use(
  '/nextDepartures',
  getNextDepartures,
);
app.use(
  '/departures',
  getDepartureBoardByCRS,
);
app.use(
  '/departureBoard',
  getDepBoardWithDetails,
);
app.use(
  '/getHistoric',
  getHistoricDepartureBoard,
);
app.use(
  '/TOCList',
  getTOCList,
);

app.use('/fastestDepartures', getFastestDepartures);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
