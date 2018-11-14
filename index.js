var soap = require("soap");
var url = "https://lite.realtime.nationalrail.co.uk/OpenLDBSVWS/wsdl.aspx";
var args = { crs: "EUS", filterList: [{ crs: "BHI" }], time: "2018-11-11T22:00:00" , timeWindow: 120 , filterTOC:"", services:"P"};
var headers = {
  AccessToken: {
    TokenValue: "e225d22d-7be9-45cc-b9f8-0398271f5fe3"
  }
};
soap.createClient(url, function(err, client) {
  client.addSoapHeader(headers);
  client.GetNextDepartures(args, function(err, result) {
    console.log(result);
  });
});

/* 
crs (string, 3 characters, alphabetic): The CRS code of a requested station origin.
filterList (string[], 3 characters, alphabetic): A collection of CRS codes that are the destinations from the above CRS.
time (DateTime): Time of departure board.
timeWindow (integer between 0 and 1440): How far into the future in minutes, relative to the time, to return services for. Optional.
filterTOC (string): The TOC code to apply to the filter. Filters services to include only those belonging to the specified TOC. Optional.
services (string) : P for train Services, B for bus services, S for ship services. Defaults to "P". Optional.
*/
