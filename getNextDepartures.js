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
const dateTime = new Date('2018/11/17 20:30').toJSON();
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

const args = {
  _xml: JSON.stringify(req).replace(/\\n|\\t/g, ''),
};

const getNextDepartures = async () => {
  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetNextDeparturesAsync(args);
  const train = await result[0].DeparturesBoard.departures;
  return train;
};

module.exports = { getNextDepartures };
