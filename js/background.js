// upon launching, create the alarm
recreateAlarm();

// opens the notifications tab every 30m/1h/2h at xx:30 and xx:00. xx is odd for every 2h.
// clears the past alarmStart and creates a new one.
// in MIT-STRETCH, frequency should be every minute
function createAlarm(freq) {
    var now = new Date();
    var day = now.getDate();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 0, 0, 0);

    chrome.alarms.clearAll();
    chrome.alarms.create('alarmStart', {
        when: timestamp, periodInMinutes: freq
    });
}


// opens the notification in a new browser tab.
function openNotification() {
    var popupUrl = chrome.runtime.getURL('/notification.html');
    chrome.tabs.query({url:popupUrl}, function(tabs){
        if(tabs.length > 0){ chrome.tabs.remove(tabs[0].id); }
        chrome.windows.create({ url: 'notification.html', type: "popup",
                             width: 1150, height: 820, top: 20, left: 20 });
    });
}

// opens the login page in a new browser tab.
function openlogin() {
    var popupUrl = chrome.runtime.getURL('/login.html');
    chrome.tabs.query({url:popupUrl}, function(tabs){
        if(tabs.length > 0){ chrome.tabs.remove(tabs[0].id); }
        chrome.windows.create({ url: 'login.html', type: "popup",
                             width: 700, height: 500, top: 20, left: 20 });
    });
}

// recreates the alarm either by default or by storage, if they exist
// DEPRECATED IN MIT-STRETCH. Re-implemented below.
/*function recreateAlarm() {
    // account for null
    chrome.storage.local.get('freq', function(options) {
        if(options.freq != null) { createAlarm(parseInt(options.freq)); } 
        else {
            createAlarm(30);
        }
    });
}*/
function recreateAlarm() {
    // If the group is set, generate the alarm
    chrome.storage.local.get('group', function(options) {
        if(options.group >= 1) { createAlarm(1); } 
    });
}
function checkStrech(){
    chrome.storage.local.get(['pid'], function(result) {
        var id = result.pid;
        //If PID is null, go to login
        if (result.pid != null) {

            //Prepare payload
            console.log("Checking for stretches with ID:", id);
            var stretchData = {
                pid: id,
            };
            console.log(JSON.stringify(stretchData));
            //POST request
            var url = "https://us-east1-onyx-logic-308404.cloudfunctions.net/stretchStatus";

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            
            xhr.setRequestHeader("Content-Type", "application/json");
            
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if(xhr.responseText=="true"){
                        console.log("Stretch ready to display");
                        openNotification();
                    }
                    else {
                        console.log("No stretch on queue");
                    };
                };
            };           
            xhr.send(JSON.stringify(stretchData));
        }
    });  
}

var callRecreate = function(){
    recreateAlarm();
    console.log("Alarm recreated from internal msg")
};

// listen for time and open the notification if it meets correct conditions
chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.get('enabled', function(option) {
        if (option.enabled != null) {
            if (alarm.name === 'alarmStart' // make sure we're turning on the right alarm
                && ((option.enabled != null && option.enabled) // if enabled, make sure it's enabled
                    || option.enabled == null))  { // or if we are initializing for the first time
                checkStrech();
            }
        } else { // option.enabled == null
            checkStretch();
            chrome.storage.local.set({'enabled': true}, function() {
              console.log("Enabled set to true.");
            });
        }
    });   
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "startFunc") callRecreate();
    }
);