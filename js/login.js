document.getElementById("login-btn").onclick = function() {
  event.preventDefault();
  var pid = document.getElementById("pid");
  var pwd = document.getElementById("password");

  var url = "https://us-east1-onyx-logic-308404.cloudfunctions.net/participantInfo";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
        if(xhr.status === 200){
          rsp = parseInt(xhr.responseText);
          if((rsp > 0) && (rsp < 4))
          {
            //Store values
            chrome.storage.local.set({'pid': parseInt(pid.value)}, function() {
              console.log("Set pid to " + pid.value);
              });
            chrome.storage.local.set({'group': rsp}, function() {
              console.log("Set group to " + rsp);
            });
            //Enable stretch queue sync
            chrome.storage.local.set({'enabled': true}, function() {
              console.log("Set enabled to true");
            });
            //And close
            open(location, '_self').close();
          }
        } else {
          pid.value = "";
          pwd.value = "";
          alert("Login error");
        };
        }};

      var data = {
        pid: pid.value,
        pwd: pwd.value 
      };
      xhr.send(JSON.stringify(data));
};
