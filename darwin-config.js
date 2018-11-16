const soap = require('soap');

const url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBSVWS/wsdl.aspx';


// Headers needed the colon to remove the :sv due to the wsdlOptions implimentation
const headers = {
  ':AccessToken': {
    ':TokenValue': 'e225d22d-7be9-45cc-b9f8-0398271f5fe3',
  },
};

module.exports = {
  soap,
  url,
  headers,
};
