// Packages
const fs = require('fs');
const axios = require("axios");
const rateLimit = require('axios-rate-limit');
// Variables
const auth = { username: 'fakeuser', password: 'fakepass' };
const throttledaxios = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 });
const remotebase = 'https://edit.pointoforegon.com';
const localbase = 'http://localhost/gutenberg-test/';
const activebase = localbase;
const activeroute = activebase + 'app/index.json';
const path = require('path');

getChanges();

async function getChanges(){
    console.log(activeroute);

    // Remove /public/ cache
    fs.rm('public', { recursive: true }, (err) => {
        // Return, if error
        if (err) {  return console.error(err); }
        // Create /public/ fresh
        fs.mkdir(path.join(__dirname, 'public/'),{ recursive: true }, (err) => { if (err) {throw err;} });
        
       
        /*
         // Create Changelog file
         fs.writeFile("app/changelog.json", "data",
         {
             encoding: "utf8",
             flag: "w",
             mode: 0o666
         },
         (err) => {
             if (err)
             console.log(err);
             else {
             console.log("File written successfully\n");
             console.log("The written has the following contents:");
             console.log(fs.readFileSync("app/changelog.json", "utf8"));
             }
         });
         */
    });
   
    // Retrieve Changelog
    const data = await axios.get(activeroute, {auth}).then(function (response) { 
        console.log(response.data);  
        // Write Changelog
       // fs.writeFile("public/changelog.json", JSON.stringify(response.data), (err) => {if (err) { throw err;} });  
        // Write Resources // .permalinks.slice(0, 3)

        response.data.urls.forEach( function(str) {
            var filename =  str.split('/').pop();
            console.log('Downloading ' + response.data.base + str);
            getResource(response.data.base + str); // , filename, function(){console.log('Finished Downloading' + filename)
        });

       // getResource(str);
    }).catch((error) => {
        console.log(error);
    });
};

// Get a Resource
async function getResource(src){

    const data = await throttledaxios.get(src, {auth}).then(function (response) {
        var lastChar = src.charAt(src.length - 1);
        var hasTrailingSlash = lastChar == '/';
        var split = cleanpath(src).split('/');
        var minibase = '';
        var filename = ''

       // console.log("split:" + split + " and length is:" + split.length);
        // console.log(src + ' Traling slash is ' + lastChar + hasTrailingSlash);
        
        // Clean Directories
       if(hasTrailingSlash){
            // Make Directory
            fs.mkdirSync(cleanpath(src), { recursive: true });
            // Make File
            fs.writeFile(cleanpath(src)+'index.html', JSON.parse(JSON.stringify(response.data)), (err) => {if (err) {throw err;} else{ 
                console.log("✨ created a new html view at " + cleanpath(src));} });
       }

       
        // Single Files
        if(!hasTrailingSlash){

            // Creat a new base, minus the file!
            for (let i = 0; i < split.length - 1; i++) { minibase += split[i] + '/'; }

            // Check if the Support Directory exists
            if(!fs.existsSync(cleanpath(minibase))){
                fs.mkdirSync(cleanpath(minibase), { recursive: true });
                console.log('📁 created a new directory at ' + minibase);
            }
           
            // Encode, if JSON
            if(typeof response.data  === 'object'){ response.data = JSON.stringify(response.data);  }

            // Write the file, now that the folder exists
            fs.writeFile(cleanpath(src), response.data, (err) => {
                if (err) console.log(err); else { console.log("✅ created a new file at " + cleanpath(src));}
            });

        } 
      
       
   
        
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