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

const getHistoricDepartureBoard = async (
  { departureStation, destinationStation },
) => {
  const xml = `
    <sv:GetHistoricDepartureBoardRequest>
        <sv:numRows>8</sv:numRows>
        <sv:crs>${departureStation.toUpperCase()}</sv:crs>
        <sv:historicDateTime>Wed Oct 18 2017 12:41:34 GMT+0000</sv:historicDateTime>
        <sv:depBoardDate></sv:depBoardDate>
        <sv:depBoardTime></sv:depBoardTime>
        <sv:timeOffset>0</sv:timeOffset>
        <sv:filterCrs>${destinationStation.toUpperCase()}</sv:filterCrs>
        <sv:filterCRSType>to</sv:filterCRSType>
        <sv:filterTOC></sv:filterTOC>
        <sv:services></sv:services>
        <sv:getNonPassengerServices>false</sv:getNonPassengerServices>
        <sv:timeWindow>100</sv:timeWindow>
    </sv:GetHistoricDepartureBoardRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetHistoricDepartureBoardAsync(args);
  const train = await result[0];
  return train;
};

router.get(
  '/:departureStation-:destinationStation/',
  async (req, res) => {
    try {
      const trains = await getHistoricDepartureBoard(req.params);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
