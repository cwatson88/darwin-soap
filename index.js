

/*
### GetNextDepartures:

see https: //lite.realtime.nationalrail.co.uk/OpenLDBsvWS/
for full SOAP info

*/

var soap = require("soap");
var url = "https://lite.realtime.nationalrail.co.uk/OpenLDBSVWS/wsdl.aspx";


// Headers needed the colon to remove the :sv due to the wsdlOptions implimentation
const headers = {
  ":AccessToken": {
    ":TokenValue": "e225d22d-7be9-45cc-b9f8-0398271f5fe3"
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


soap.createClient(url, function (err, client) {
  client.addSoapHeader(headers);
  // console.log(client)
  client.GetNextDeparturesAsync(args2).then((result) => {
    console.log(result);
  }).catch(error =>
    console.log(error)
  )
});

