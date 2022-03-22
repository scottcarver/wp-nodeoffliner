# wp-nodeoffliner ⬇️
This Node script is used to offload a list of urls. For practical purposes they will likely be WordPress URIs using [wp-routemanifest](https://github.com/scottcarver/wp-nodeoffliner), but the solution is unopinionated in so much that it simply scrapes arbitrary urls.

## Feed Examples from WP-routemanifest
The formatting of the feed must follow a specific format, and the companion plugin will render that, at these urls:
- `/app/index.js` - a full list of all site URI's
- `/app/changes-since-unixtime.js` - a list of site changes  since a specific unixtime

## Example JSON Data:
<pre>
{
    "base" : "https://yourwebsite.com",
    "urls" :[
        url1,
        url2,
        url3,
        folder1/url4,
    ]
}``
<pre>

## To run the script:
1) npm install
2) npm start

## Static Files
**This will create 4 files:**

1) `url1/index.html`
2) `url2/index.html`
3) `url3/index.html`
4) `folder1/url4/index.html`

Notice how folders are created automatically, and index.html files are created to create the illusion of clean folder structure.

