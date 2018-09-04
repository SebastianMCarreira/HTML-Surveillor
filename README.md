# HTML Surveillor

This project consists of a Chrome extension that, when configured to do so, will check the page in wich it is configured for changes in the HTML. If it detects a change, the browser will automatically download a json containing the timestamp at wich it was created, the URL of the page and the HTML. The second part consists of a Powershell script that, based on preconfigured regular expressions, will check on the browser's default download folder for new json files belonging to the extensions and move them to dedicated folders, avoinding the default folder to be crowded with json files from webpages with constantly changing HTML. 

## Prerequisites

For the Chrome extension, I tested everything in a Chrome v68.0.3440.106, however checking on the chrome API's changelog, it appears that a Chrome v20.0.1132.47 or higher will do the trick.

For the Powershell script, I used Powershell v5.1.17134.228.

## Purpose

I decided to make this project while trying to make another project that involved webscrapping the Whatsapp browser page and to do that, I needed the HTML that I could see in the browser that was the result of several cookies and session id's I couldn't recreate in code. Then, while doing this project, I decided to make it a little more general purpose, making it useful for other things like big data collecting or to analyze a web page behaviour as well as using it as a one way interface between a browser's content and any program.

## Installing and configuration

### Download the files

After having installed the lastest versions of Chrome and Powershell (Powershell Core if in Linux), download the contents of the repository.

### Load the extension

In Chrome, insert 'chrome://extensions' in the URL bar, once loaded, activate the option of developer mode, this will allow you to load an uncompressed extension. Select this option and choose the 'Extension' folder inside the repository contents. Now you have the extension loaded in your browser.

### Setting the configurations

Now you should set the right configuration in config.json, this includes changing the "downloads_path" to the path to the Chrome's default download path, the url_expression to an expression matching the possible urls of the page you want to save and finally the path to the one of the dedicated directory you don't mind filling with json files. If you have the extension monitoring several urls, you can add more objects to the matches array, they must contain the same properties but will probably have at least a different url_expression.

### Running the Powershell script

Then, you should run the Powershell script, to do so simply open the Powershell prompt in the same directory as the script, and enter '.\json-saver.ps1, this should put the script to run and move any json the extension creates and matches the expressions.

### Start surveilling!!

Finally, open the page you want to monitor, in Chrome, and click on the CCTV icon on the top-right corner, this will open a small window that will let you set the timer of the surveillance (how often will the extension check out the HTML and see if it has changed, watch out for if you set it too low, it will cause performance issues and possibly crash Chrome) and start the surveillance. You will know it has started when the eye icon is no longer slashed and the page downloads the first json. You can check the Powershell promt, within 5 seconds, it should move the file to the desired folder (the frequency can be lowered or risen in the config.json file, but the same warning as before, low frequency can cause performance issues).

Surveillances go by tab, not by URL, window or whatever, so you can have several tabs at the same time being monitored, even with different frequencies, but once closed the tab, you will have to set the surveillance again.

To stop surveilling, open again the popup with the CCTV icon and click to stop surveillance. It will check one last time HTML for changes and stop.

## How it works

![process flowchart](https://github.com/SebastianMCarreira/HTML-Surveillor/blob/master/HTML%20Surveillor.png?raw=true)

The process starts in the popup, that's divided in three files, popup.html, popup.css and popup.js. The .html is loaded when the icon is pressed and with it, the .css is applied and the .js executed. Upon pressing the "Set Surveillance" button, a function will trigger in the .js that will change the .html to make it show the surveillance is set and trigger a query function to get the active tab. This will trigger a callback that will receive the active tab and send a message to that tab's content.js with the timer value set in the .html.

Then, in the content.js (note that the content script is for the tab, not the extension, so there will be an instance of the content.js script running in each tab) the message will be received and the timer will start with the time given by the message. Each time the timer fires, the script will check if the current HTML is different to the one saved before (it begins checking agains an empty HTML so unless the page is empty, it will always start downloading a json). If the HTML changed, it will create a json with the current timestamp, URL of the tab and the HTML and download it.

Once the json is downloaded, json-saver.ps1 will check the default download directory and find this json, then move it to the dedicated directory where it can be read by any other local running program.

## Authors

* **Sebastián Matías Carreira**

## Acknowledgments

* **Daniel Shiffman** - @shiffman : For his YouTube tutorial on Chrome extensions I watched before making mine.