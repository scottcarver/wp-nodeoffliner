// Packages
const fs = require('fs');
const axios = require("axios");
const rateLimit = require('axios-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
// Variables
const throttledaxios = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 });
// const remotebase = 'https://edit.pointoforegon.com';
// const localbase = 'http://localhost/gutenberg-test/';
const activebase = process.env.WP_INSTALL_BASE;
const activeroute = process.env.WP_INSTALL_BASE + 'app/index.json';
const auth = { username: process.env.WP_AUTH_USER, password: process.env.WP_AUTH_PASS };
const publicdirectory = process.env.WP_OUTPUT_DIR;


getChanges();


async function getChanges(){
    

    // activeroute

    // If File exists
    if (fs.existsSync(publicdirectory)) {
        console.log("Deleting existing build: ",  publicdirectory);
   
        // Remove /public/ cache
        fs.rm(publicdirectory, { recursive: true }, (err) => {
            // Return, if error, otherwise
            if (err) {  return console.error(err); }
            // Create /public/ fresh
            fs.mkdir(path.join(__dirname, publicdirectory),{ recursive: true }, (err) => { if (err) {throw err;} });
        });
    }

    console.log("Found source feed: ",  activeroute);
   
    // Retrieve Changelog
    const data = await axios.get(activeroute, {auth}).then(function (response) { 
        console.log("The source seed contents include:");  
        console.log(response.data);  

         // Write Last Meal Log
        var parsedmeal = JSON.stringify(response.data);
         fs.writeFile(publicdirectory+'/lastmeal.json', parsedmeal, (err) => {
            if (err) console.log(err); else { 
                console.log("🎫 created log ⭢  " + publicdirectory + "lastmeal.json");
                
            }
        });
     
        response.data.urls.forEach( function(str) {
            var filename =  str.split('/').pop();
            // console.log('Downloading ' + response.data.base + str);
            getResource(response.data.base + str);
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
        var parsedpage = JSON.parse(JSON.stringify(response.data));
        // swappath(
        
        // Clean Directories
       if(hasTrailingSlash){
            // Make Directory
            fs.mkdirSync(cleanpath(src), { recursive: true });
            // Make File
            fs.writeFile(cleanpath(src)+'index.html', swappath(parsedpage), (err) => {if (err) {throw err;} else{ 
                console.log("🏷️  created html⭢  " + cleanpath(src));} });
       }
       
        // Single Files
        if(!hasTrailingSlash){

            // Creat a new base, minus the file!
            for (let i = 0; i < split.length - 1; i++) { minibase += split[i] + '/'; }

            // Check if the Support Directory exists
            if(!fs.existsSync(cleanpath(minibase))){
                fs.mkdirSync(cleanpath(minibase), { recursive: true });
                console.log('📂 created dir ⭢  ' + minibase);
            }
           
            // Encode, if JSON
            if(typeof response.data  === 'object'){ response.data = JSON.stringify(response.data);  }

            // Write the file, now that the folder exists
            fs.writeFile(cleanpath(src), response.data, (err) => {
                if (err) console.log(err); else { console.log("🎫 created file⭢  " + cleanpath(src));}
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
    const itcleaned = path.replace(activebase, publicdirectory+'/');
    // Return the url minus the base
    return itcleaned;
}

// Swap out URL paths in the HTML RESPONSE
function swappath(html){
    // Remove the base
    // console.log("html is " + html);
    const htmlcleaned = html.replace(activebase, publicdirectory+'/');
    // Return the url minus the base
    // return htmlcleaned;
    return 'boop'
}
