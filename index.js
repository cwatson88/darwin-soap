var soap = require("soap");
var url = "https://lite.realtime.nationalrail.co.uk/OpenLDBSVWS/wsdl.aspx";

// this worked and put sv: infront of *MOST of the xml, see args below
const wsdlOptions = {
  overrideRootElement: {
    namespace: 'sv:',
    xmlnsAttributes: [{
      name: 'sv',
      value: "http://thalesgroup.com/RTTI/2017-10-01/ldbsv/"
    }]
  }
};

// Headers needed the colon to remove the :sv due to the wsdlOptions implimentation
const headers = {
  ":AccessToken": {
    ":TokenValue": "e225d22d-7be9-45cc-b9f8-0398271f5fe3"
  }
};

/* 
using args didn't work as the filter list didn't include the pre - tag sv:
Instead now use the template strings below (req) this works
*/
const args = {
  "sv:GetNextDeparturesRequest":{
    "sv:crs": "EUS",
    "sv:filterList": [{
      "sv:crs": "BHI"
    }],
    "sv:time": "2018-11-11T20:00:00",
    "sv:timeWindow": 120,
    "sv:filterTOC": null,
    "sv:services": "P"
  }
};


const req =  `
  		<sv:GetNextDeparturesRequest>
			<sv:crs>EUS</sv:crs>
			<sv:filterList>
				<sv:crs>BHI</sv:crs>
			</sv:filterList>
			<sv:time>2018-11-15T11:03:00</sv:time>
			<sv:timeWindow>120</sv:timeWindow>
			<sv:filterTOC></sv:filterTOC>
			<sv:services>P</sv:services>
		</sv:GetNextDeparturesRequest>`

const args2 = {
  _xml: JSON.stringify(req).replace(/\\n|\\t/g, '')
}


soap.createClient(url, wsdlOptions, function (err, client) {
  client.addSoapHeader(headers);
  // console.log(client)
  client.GetNextDeparturesAsync(args2).then((result) => {
    console.log(result);
  }).catch(error =>
    console.log(error)
  )
});

/* 
crs (string, 3 characters, alphabetic): The CRS code of a requested station origin.
filterList (string[], 3 characters, alphabetic): A collection of CRS codes that are the destinations from the above CRS.
time (DateTime): Time of departure board.
timeWindow (integer between 0 and 1440): How far into the future in minutes, relative to the time, to return services for. Optional.
filterTOC (string): The TOC code to apply to the filter. Filters services to include only those belonging to the specified TOC. Optional.
services (string) : P for train Services, B for bus services, S for ship services. Defaults to "P". Optional.
*/