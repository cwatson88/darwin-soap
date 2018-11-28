const express = require('express');

const router = express.Router();

/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpenldbsvWS/
for full SOAP info

*/
const {
  soap,
  url,
  headers,
} = require('../darwin-config.js');

const getDepBoardWithDetails = async (
  { departureStation, destinationStation, dateTime },
) => {
  const xml = `
    <sv:GetDepBoardWithDetailsRequest>
    <sv:numRows>10</sv:numRows>
    <sv:crs>${departureStation.toUpperCase()}</sv:crs>
    <sv:time>${dateTime}</sv:time>
    <sv:timeWindow>100</sv:timeWindow>
    <sv:filtercrs>${destinationStation.toUpperCase()}</sv:filtercrs>
    <sv:filterType>to</sv:filterType>
    <sv:filterTOC></sv:filterTOC>
    <sv:services>PBS</sv:services>
    <sv:getNonPassengerServices>false</sv:getNonPassengerServices>
 </sv:GetDepBoardWithDetailsRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetDepBoardWithDetailsAsync(args);
  const train = await result[0].GetBoardWithDetailsResult;
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
      const trains = await getDepBoardWithDetails(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
