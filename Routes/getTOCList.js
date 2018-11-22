const express = require('express');

const router = express.Router();

/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpenlbwsvWS/
for full SOAP info

*/
const {
  soap,
  url,
  headers,
} = require('../darwin-config.js');

const getTOCList = async () => {
  const xml = `
  <tns:GetTOCListRequest>
  <tns:currentVersion></tns:currentVersion>
</tns:GetTOCListRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  console.log(client);
  await client.addSoapHeader(headers);
  const result = await client.GetTOCListAsync(args);
  const train = await result[0];
  return train;
};

router.get(
  '',
  async (req, res) => {
    try {
      const trains = await getTOCList(req.params, req.dateTime);
      res.json(trains);
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
