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

const req = `
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

const args2 = {
  _xml: JSON.stringify(req).replace(/\\n|\\t/g, ''),
};

soap.createClient(url, async (err, client) => {
  client.addSoapHeader(headers);
  const result = await client.GetNextDeparturesAsync(args2);
  const train = await result[0].DeparturesBoard.departures;
  return train;
});


const app = express();
const port = 8080;

app.get('/', (req, res) => {
  soap.createClient(url, async (err, client) => {
    client.addSoapHeader(headers);
    const result = await client.GetNextDeparturesAsync(args2);
    const train = await result[0].DeparturesBoard.departures;
    res.send(train);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
