document.getElementById("submit").addEventListener("click", set_config);
document.getElementById("stop").addEventListener("click", stop_surv);

chrome.runtime.onMessage.addListener(get_response);

window.onload = function(){
    let params = {active: true, currentWindow: true};
    chrome.tabs.query(params, ask_tab);
};

function set_config(){
    let params = {active: true, currentWindow: true};
    document.getElementById("eye").src = "img/eye.png";
    document.getElementById("submit").disabled = true;
    document.getElementById("stop").disabled = false;
    chrome.tabs.query(params, send_config);
}

function send_config(tabs){
    let msg = {
        timeout: document.getElementById("timeout").value
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
}

function stop_surv(){
    let params = {active: true, currentWindow: true};
    document.getElementById("eye").src = "img/eye-slash.png";
    document.getElementById("submit").disabled = false;
    document.getElementById("stop").disabled = true;
    chrome.tabs.query(params, send_stop);
}

function send_stop(tabs){
    let msg = {
        stop: true
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
}

function ask_tab(tabs){
    let msg = {
        ask_surveillance: true
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
}

function get_response(msg, sender, response){
    if(msg.is_surveilling){
        document.getElementById("eye").src = "img/eye.png";
        document.getElementById("submit").disabled = true;
        document.getElementById("stop").disabled = false;
    }
}