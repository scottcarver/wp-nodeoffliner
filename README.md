# wp-nodeoffliner ⬇️
This Node script is used to download a list of urls. It is a companion to another plugin which lists the urls in the format required [wp-routemanifest](https://github.com/scottcarver/wp-routemanifest), but the solution could be used in other scenarios because the base/urls scheme is not WP specific.


## Usage:
1) run `npm install`
2) create .env file (based on .env-example)
2) run `npm start`

This will run a script which saves all the urls as static files in a directory.

**ENV Variables that are used:**
```
WP_INSTALL_BASE=http://example.com
WP_AUTH_USER=fakeuser
WP_AUTH_PASS=fakepass
WP_OUTPUT_DIR=dist
```

## Lifecycle:
1) WP is setup with [plugin](https://github.com/scottcarver/wp-routemanifest) to expose route json
2) Node scraper (this!) is run elsewhere and reads files from the WP install
3) Scraper pulls down all the listed files and saves themas files on the filesystem
4) These files are added to a server, along with suppport files in the /app/ directory
5) Additional pulls can read that value and access the feed `changes-since-{unixtimestamp}.js` to get a list of modified/created pages since the last sync

---

## Feed Examples from WP-routemanifest
The formatting of the feed must follow a specific format, and the companion plugin will render that, at these urls:
- `/app/index.js` - a full list of all site URI's
- `/app/changes-since-{unixtime}.js` - a list of site changes since a specific unix timestamp which looks like this: 1648139000

## Example JSON Data:
```
{
    "base" : "https://yourwebsite.com",
    "urls" :[
        url1,
        url2,
        url3,
        folder1/url4,
    ]
}
```

## Static Files
**This will create 4 files:**

1) `url1/index.html`
2) `url2/index.html`
3) `url3/index.html`
4) `folder1/url4/index.html`

Notice how folders and index.html files are created automatically to recreate the same clean url structure you see in WP!

