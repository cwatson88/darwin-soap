const express = require('express');
const { getNextDepartures } = require('./getNextDepartures.js');
const test = require('./Routes/test');

const app = express();
const port = process.env.PORT || 3000;

const requestTime = function (req, res, next) {
  req.requestTime = new Date(Date.now()).toUTCString();
  next();
};

app.use(requestTime);

app.get('/', async (req, res) => {
  try {
    const trains = await getNextDepartures();
    res.send({ message: { time: req.requestTime, trains } });
  } catch (error) {
    console.log(error);
  }
});

app.use('/test', test);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
