const fs = require('fs');
const axios = require("axios");
const rateLimit = require('axios-rate-limit');
const auth = { username: 'fakeuser', password: 'fakepass' };
const throttledaxios = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 });
const remotebase = 'https://edit.pointoforegon.com';
const localbase = 'http://localhost/gutenberg-test/';
const activebase = localbase;
const activeroute = activebase + 'route/manifest.json';
const path = require('path');

getChanges();

async function getChanges(){
    console.log(activeroute);
    // Remove /public/ cache
    fs.rmdir('public', { recursive: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        // console.log('Directory created successfully!');
         // Create /public/ fresh
        fs.mkdir(path.join(__dirname, 'public'),{ recursive: true }, (err) => {if (err) {throw err;} });
    });
   
    // Changelog URL
    // Retrieve Changelog
    const data = await axios.get(activeroute, {auth}).then(function (response) { 
        console.log(response.data);  
        // Write Changelog
        fs.writeFile("public/changelog.json", JSON.stringify(response.data), (err) => {if (err) { throw err;} });  
        // Write Resources // .permalinks.slice(0, 3)

        response.data.forEach( function(str) {
            var filename =  str.split('/').pop();
            console.log('Downloading ' + str);
            getResource(str); // , filename, function(){console.log('Finished Downloading' + filename)
        });

       // getResource(str);
    }).catch((error) => {
        console.log(error);
    });
};

// Get a Resource
async function getResource(src){

    const data = await throttledaxios.get(src, {auth}).then(function (response) { 
        // Make Directory
        fs.mkdirSync(cleanpath(src), { recursive: true });
        // Make File
        fs.writeFile(cleanpath(src)+'index.html', JSON.parse(JSON.stringify(response.data)), (err) => {if (err) {throw err;} });
        console.log('created ' + cleanpath(src));
        
    }).catch((error) => {
        console.log(error);
    });
  
    return false;
};



// Clean the path by removing the URL base
function cleanpath(path){
    // Remove the base
    const itcleaned = path.replace(activebase, 'public/');
    // Return the url minus the base
    return itcleaned;
}


/*


var fs = require('fs');
var request = require('request');

var urlindex = "https://edit.pointoforegon.com/changelog/in-out.json";

var download = function(url, dest, callback){

    request.get(url)
    .on('error', function(err) {console.log(err)} )
    .pipe(fs.createWriteStream(dest))
    .on('close', callback);

};

download(urlindex, 'index.json', function(){console.log('Finished Downloading')});
*/
/*
urlList.forEach( function(str) {
	var filename =  str.split('/').pop();
	console.log('Downloading ' + filename);
	download(str, filename, function(){console.log('Finished Downloading' + filename)});
});*/