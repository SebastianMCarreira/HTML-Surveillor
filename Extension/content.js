var HTML = "<html></html>";
var timeout = 1000;
var continue_monitor = false;

chrome.runtime.onMessage.addListener(getMessage);

function download(content, fileName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content,null,"\t"));
    var dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName);
    dlAnchorElem.click();
}

function getMessage(msg, sender, sendResponse){
    if(typeof msg.timeout == 'undefined' && msg.stop){
        console.log("Stop!!");
        continue_monitor = false;
    }else if(typeof msg.timeout == 'undefined' && msg.ask_surveillance){
        console.log("Respond!!");
        chrome.runtime.sendMessage({is_surveilling: continue_monitor});
    }else if(typeof msg.timeout !== 'undefined'){ 
        console.log("Start interval at " + msg.timeout + "!!");
        continue_monitor = true; 
        timeout = msg.timeout*1000;
        if(continue_monitor){
            setTimeout(timer, timeout);
        } 
    }
}

var timer = function(){
    if(HTML != document.documentElement.outerHTML){
        HTML = document.documentElement.outerHTML;
        let now = new Date();
        saving = {
            "datetime": {
                "year": now.getFullYear(),
                "month": now.getMonth(),
                "date": now.getDate(),
                "hours": now.getHours(),
                "minutes": now.getMinutes(),
                "seconds": now.getSeconds(),
                "miliseconds": now.getMilliseconds()
            },

            "URL": window.location.href,

            "HTML": HTML
        };
        datetime_str = now.getFullYear() + "-" + now.getUTCMonth() + "-" + now.getDate() + " " + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds();
        console.log("Downloading new HTML!");
        download(saving, datetime_str + " " + document.title + ".json");
    }
    if(continue_monitor){
        setTimeout(timer, timeout);
    }
}