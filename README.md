# wp-nodeoffliner
Node script to offload a list of urls. For practical purposes they will likely be WordPress URIs, but the solution is unopinionated on the backend since it scrapes the rendered code. The file is a flat array of urls for which to offload. The technique is 1) useful to offload a website, and also 2) to offline pages inside a PWA. 

## Feed Examples
- `/app/data-alltime.js` - a full list of all site URI's
- `/app/data-since233113.js` - a list of site changes  since a specific isotime. This is used in the `WP_Query` to be economical about only getting URIs that changed since the last sync. 

## Example JSON Data:
``{
    [
        url1,
        url2,
        url3,
        folder1/url4,
    ]
}``

## Static Files
**This will create 4 files:**

1) `url1/index.html`
2) `url2/index.html`
3) `url3/index.html`
4) `folder1/url4/index.html`

Notice how folders are created automatically, and index.html files are created to create the illusion of clean folder structure.

To run the script:
1) npm install
2) npm start