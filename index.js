const express = require('express');


/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpenLDBsvWS/
for full SOAP info

*/
const {
  soap,
  url,
  headers,
} = require('./darwin-config.js');

const departureStation = 'EUS';
const destinationStation = 'BHI';
const dateTime = new Date().toJSON();
const minutesTo = 180; // integer between 0 and 1440 mins

const reqData = `
    <sv:GetNextDeparturesRequest>
        <sv:crs>${departureStation}</sv:crs>
        <sv:filterList>
            <sv:crs>${destinationStation}</sv:crs>
        </sv:filterList>
        <sv:time>${dateTime}</sv:time>
        <sv:timeWindow>${minutesTo}</sv:timeWindow>
        <sv:filterTOC></sv:filterTOC>
        <sv:services>P</sv:services>
    </sv:GetNextDeparturesRequest>`;

const args = {
  _xml: JSON.stringify(reqData).replace(/\\n|\\t/g, ''),
};

const app = express();
const port = process.env.PORT || 3000;

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

app.get('/', (req, res) => {
  try {
    soap.createClient(url, async (err, client) => {
      await client.addSoapHeader(headers);
      const result = await client.GetNextDeparturesAsync(args);
      const train = await result[0].DeparturesBoard.departures;
      res.send({ message: { time: req.requestTime, train } });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
