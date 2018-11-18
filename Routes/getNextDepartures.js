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

const getNextDepartures = async (
  { departureStation, destinationStation },
  dateTime,
) => {
  const xml = `
    <sv:GetNextDeparturesRequest>
        <sv:crs>${departureStation.toUpperCase()}</sv:crs>
        <sv:filterList>
            <sv:crs>${destinationStation.toUpperCase()}</sv:crs>
        </sv:filterList>
        <sv:time>${dateTime}</sv:time>
        <sv:timeWindow>180</sv:timeWindow>
        <sv:filterTOC></sv:filterTOC>
        <sv:services>P</sv:services>
    </sv:GetNextDeparturesRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetNextDeparturesAsync(args);
  const train = await result[0].DeparturesBoard.departures;
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
      const trains = await getNextDepartures(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
