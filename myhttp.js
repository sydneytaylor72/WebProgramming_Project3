// Names: Kenton Carrier, Sydney Taylor

// https://nodejs.org/api/http.html
// This example uses a named function incoming() for the callback function
// sent to the createServer() method.

var http = require("http");
var fs = require("fs");

// Define constant variables
const MINPORT = 5000;
const MAXPORT = 35000;
const REPART1 = /^\/UNLINK\//;
const REPART2 = /^\/SIZE\//;
const REPART3 = /^\/FETCH\//;
const WORKDIRECTORY = "WEBSERVER/";
const VALIDEXT = [
  ["txt", "text/plain"],
  ["html", "text/html"],
  ["mp3", "audio/mp3"],
  ["jpg", "image/jpeg"]
];
var port = 0;

// Dynamically generates a regex group for file extensions from the VALIDEXT
// Array
var extensionsRegEx = "(";
VALIDEXT.forEach((ext, index) => {
  extensionsRegEx += ext[0];
  if (index != VALIDEXT.length - 1) extensionsRegEx += "|";
  else extensionsRegEx += "){1}";
});

const FILEPATH = /([A-Z]*\/)*/;
const FILENAME = /\w+/;
const EXTENSION = new RegExp("\\." + extensionsRegEx);
const FILE = new RegExp(FILEPATH.source + FILENAME.source + EXTENSION.source);

// Handles incoming requests by calling the appropriate function for the URL
function incoming(request, response) {
  var theurl = request.url;
  const urlTest = new RegExp(
    "(" +
      REPART1.source +
      "|" +
      REPART2.source +
      "|" +
      REPART3.source +
      ")" +
      FILE.source
  );
  // If the URL is valid (i.e. matches the regex)
  if (urlTest.test(theurl)) {
  console.log("Incoming (valid) request with the URL: (" + theurl +")");
    // If the URL is UNLINK, call doRemove function
    if (REPART1.test(theurl)) {
      doRemove(theurl, response)
        .then(message => {
          response.end();
        })
        .catch(err => console.log(err));
    }
    // If the URL is SIZE, call doSize function
    if (REPART2.test(theurl)) {
      doSize(theurl, response)
        .then(message => {
          response.end();
        })
        .catch(err => console.log(err));
    }
    // If the URL is FETCH, call doFetch function
    if (REPART3.test(theurl)) {
      doFetch(theurl, response)
        .then(message => {
          response.end();
        })
        .catch(err => console.log(err));
    }
  // Else, return an error message
  } else {
    console.log("Incoming (invalid) request with the URL: (" + theurl +")");
    response.write("INVALID URL: " + theurl + "\n");
    response.end();
  }
}

// Takes a range of numbers and generates a random number between them inclusive
function randomPort(min, max) {
  port = Math.floor(Math.random() * (max - min + 1) + min);
}

// Removes the file specified in the URL or returns an error if the file cannot be removed
function doRemove(theurl, response) {
  response.setHeader("Content-Type", "text/plain");
  theurl = theurl.substr(7);
  return new Promise((resolve, reject) => {
    fs.unlink(WORKDIRECTORY + theurl.match(FILE)[0], err => {
      // If there is an error, write an error message to the response
      if (err) {
        var errorMessage =
          "ERROR: could not unlink file " + theurl.match(FILE)[0];
	console.log(errorMessage);
        response.statusMessage = errorMessage;
        response.write(errorMessage + '\n');
        response.statusCode = 403;
        resolve(errorMessage);
      // Else, write a message to the response that the file was removed
      } else {
        var unlinkedMessage =
          "UNLINK: the URL " + theurl.match(FILE)[0] + " was removed.";
        response.statusCode = 200;
        response.write(unlinkedMessage + '\n');
        resolve(unlinkedMessage);
      }
    });
  });
}

// Determines the size of the file specified in the URL or returns an error if it cannot determine the stats
function doSize(theurl, response) {
  response.setHeader("Content-Type", "text/plain");
  theurl = theurl.substr(5);
  return new Promise((resolve, reject) => {
    fs.stat(WORKDIRECTORY + theurl.match(FILE)[0], (err, stat) => {
      // If there is an error, write an error message to the response
      if (err) {
        var errorMessage =
          "ERROR: could not stat file " + theurl.match(FILE)[0];
	console.log(errorMessage);
        response.statusMessage = errorMessage;
        response.write(errorMessage + '\n');
        response.statusCode = 403;
        resolve(errorMessage);
      // Else, write a message to the response with the size of the file
      } else {
        var statMessage =
          "STAT: the URL " + theurl.match(FILE)[0] + " size is " + stat.size;
        response.statusCode = 200;
        response.write(statMessage + '\n');
        resolve(statMessage);
      }
    });
  });
}

// Reads the contents of the file specified in the URL or returns an error message if it cannot read the file
function doFetch(theurl, response) {
  var foundHeader = "";
  console.log("DEBUG: full path = " + WORKDIRECTORY + theurl.substr(7));
  theurl = theurl.substr(6);
  var extension = theurl.indexOf('.') + 1;
  var extensionValue = theurl.substr(extension);
  // Loop through the VALIDEXT array to find the matching header for the extension
  for (i=0; i<VALIDEXT.length; i++) {
      if (extensionValue == VALIDEXT[i][0]) {
	      foundHeader = VALIDEXT[i][1];
      }
  }
  response.setHeader("Content-Type", foundHeader);
  return new Promise((resolve, reject) => {
    fs.readFile(WORKDIRECTORY + theurl.match(FILE)[0], (err, data) => {
      // If there is an error, write an error message to the response
      if (err) {
        var errorMessage =
          "ERROR: unable to fetch URL " + theurl.match(FILE)[0];
        console.log(errorMessage);
	response.statusCode = 403;
        response.write(errorMessage + '\n');
        response.statusMessage = errorMessage;
        resolve(errorMessage);
      // Else, write a message to the response that the file was fetched
      } else {
        var fetchedMessage =
          "FETCH: the URL " + theurl.match(FILE)[0] + " was fetched.";
        response.statusCode = 200;
        response.statusMessage = fetchedMessage;
        response.write(data);
        resolve(fetchedMessage);
      }
    });
  });
}

// create a server, passing it the event function

var server = http.createServer(incoming);

// try to listen to incoming requests.
// each incoming request should invoke incoming()

try {
  server.on("error", function(e) {
    console.log("Error! " + e.code);
  }); // server.on()

  randomPort(MINPORT, MAXPORT);
  server.listen(port);
  console.log("Server started. Listening on http://localhost:" + port);
} catch (error) {}
