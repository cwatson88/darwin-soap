const express = require('express');

const router = express.Router();

/*
### GetDisruptionList:

see https: //lite.realtime.nationalrail.co.uk/OpenLDBsvWS/
for full SOAP info

*/
const { soap, url, headers } = require('../darwin-config.js');

const getDisruptionList = async ({ crs }) => {
  const xml = `
    <sv:GetDisruptionListRequest>
      <sv:CRSList>
        <sv:crs>${crs.toUpperCase()}</sv:crs>
      </sv:CRSList>
    </sv:GetDisruptionListRequest>`;

  const args = {
    _xml: JSON.stringify(xml).replace(/\\n|\\t/g, ''),
  };

  const client = await soap.createClientAsync(url);
  await client.addSoapHeader(headers);
  const result = await client.GetDisruptionListAsync(args);
  const train = await result['0'].GetDisruptionListResult;
  return train;
};

router.get('/:crs', async (req, res) => {
  try {
    const trains = await getDisruptionList(req.params);
    res.json(trains);
  } catch (error) {
    console.log('error');
  }
});

module.exports = router;
