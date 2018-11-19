const express = require('express');

const router = express.Router();

/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpenLDBsvWS/
for full SOAP info

*/
const {
  soap,
  url,
  headers,
} = require('../darwin-config.js');

const getDepBoardWithDetails = async (
  { departureStation, destinationStation },
) => {
  const xml = `
    <sv:GetDepBoardWithDetailsRequest>
        <sv:numRows>8</sv:numRows>
        <sv:crs>${departureStation.toUpperCase()}</sv:crs>
        <sv:filterCrs>${destinationStation.toUpperCase()}</sv:filterCrs>
        <sv:filterType>to</sv:filterType>
        <sv:timeOffset>0</sv:timeOffset>
        <sv:timeWindow>100</sv:timeWindow>
    </sv:GetDepBoardWithDetailsRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetDepBoardWithDetailsAsync(args);
  const train = await result[0].GetBoardResult;
  return train;
};


const requestTime = (req, res, next) => {
  req.dateTime = new Date().toISOString();
  next();
};

router.use(requestTime);

router.get(
  '/:destinationStation/:departureStation/',
  async (req, res) => {
    try {
      const trains = await getDepBoardWithDetails(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
