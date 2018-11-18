const express = require('express');
const getNextDepartures = require('./Routes/getNextDepartures');
const getDisruptionList = require('./Routes/getDisruptionList');
const getFastestDepartures = require('./Routes/getFastestDepartures');

const app = express();
const port = process.env.PORT || 3000;

app.use('/getDisruptions', getDisruptionList);
app.use(
  '/nextDepartures',
  getNextDepartures,
);
app.use('/fastestDepartures', getFastestDepartures);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
