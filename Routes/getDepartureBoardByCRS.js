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

const getDepartureBoardByCRS = async (
  { departureStation, destinationStation },
  dateTime,
) => {
  const xml = `
    <sv:GetDepartureBoardByCRSRequest>
        <sv:numRows>8</sv:numRows>
        <sv:crs>${departureStation.toUpperCase()}</sv:crs>
        <sv:filterCrs>${destinationStation.toUpperCase()}</sv:filterCrs>
        <sv:filterType>from</sv:filterType>
        <sv:time>${dateTime}</sv:time>
        <sv:timeWindow>180</sv:timeWindow>
        <sv:filterTOC>VT</sv:filterTOC>
        <sv:services>P</sv:services>
        <sv:getNonPassengerServices>false</sv:getNonPassengerServices>
    </sv:GetDepartureBoardByCRSRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetDepartureBoardByCRSAsync(args);
  const train = await result[0].GetBoardResult;
  return train;
};


const requestTime = (req, res, next) => {
  req.dateTime = new Date().toISOString();
  next();
};

router.use(requestTime);

router.get(
  '/:departureStation-:destinationStation/',
  async (req, res) => {
    try {
      const trains = await getDepartureBoardByCRS(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
