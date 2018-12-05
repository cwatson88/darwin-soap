const express = require('express');

const router = express.Router();

const format = require('date-fns/format');

/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpensvsvWS/
for full SOAP info

*/
const {
  soap,
  url,
  headers,
} = require('../darwin-config.js');

const getDepBoardWithDetails = async (
  {
    departureStation, destinationStation, timeWindow = 5, TOC = '',
  }, dateTime,
) => {
  const xml = `
  <sv:GetDepBoardWithDetailsRequest>
         <sv:numRows>10</sv:numRows>
         <sv:crs>${departureStation.toUpperCase()}</sv:crs>
         <sv:time>${dateTime}</sv:time>
         <sv:timeWindow>${timeWindow}</sv:timeWindow>
         <sv:filtercrs>${destinationStation.toUpperCase()}</sv:filtercrs>
         <sv:filterType>to</sv:filterType>
         <sv:filterTOC>${TOC}</sv:filterTOC>
         <sv:services>PBS</sv:services>
         <sv:getNonPassengerServices>true</sv:getNonPassengerServices>
      </sv:GetDepBoardWithDetailsRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetDepBoardWithDetailsAsync(args);
  const train = await result[0];
  return train;
};


const requestTime = (req, res, next) => {
  const date = new Date();
  req.dateTime = format(date, 'YYYY-MM-DDTHH:mm:ss');
  next();
};

router.use(requestTime);

router.get(
  '/:departureStation-:destinationStation/:timeWindow?/:TOC?/',
  async (req, res) => {
    try {
      const trains = await getDepBoardWithDetails(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      res.json(error);
    }
  },
);

module.exports = router;
