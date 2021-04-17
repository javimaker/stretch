// Queries for the noficiation html page.

// check how long ago the exercises were saved, if they were saved more than
// 1 month ago then re-get them and store them locally.
chrome.storage.local.get('exercisesLastSaved', function(date) {
    if (date.exercisesLastSaved == null) { 
        queryAllAPIs(grabAndDisplayExercise); 
    }
    else {
        var currentDate = new Date();
        var currentDate_ms = currentDate.getTime();
        if ((currentDate_ms - date.exercisesLastSaved) > (30 * 1000 * 60 * 60 * 24)) { 
            queryAllAPIs(grabAndDisplayExercise); 
        } else {
            grabAndDisplayExercise();

            //get time for logging
            var dateTime = new Date().toLocaleString();

            //load new exercise
            document.getElementById("new-exercise").onclick = function() {
            	document.location.reload(true);
            };

            //poll buttons
            document.getElementById("poll-btn-1").onclick = function(){
	  					var pollData = {
				          poll1: "1",
				          time: dateTime,      
				        };
				        console.log(JSON.stringify(pollData));
				        $.ajax({
				          type: "POST",
				          url: "process.php",
				          data: pollData,
				          dataType: "json",
				          encode: true,
				          error: function(){
				            alert("Error: cannot connect to the server");
				          },
				          success: function(data) {
				            alert(data);
				          }
				        }).done(function (data) {
				          console.log(data);
				          alert("Done executing");
				        });
				    
				        event.preventDefault();
        		};

        		document.getElementById("poll-btn-2").onclick = function(){
						var pollData = {
				          poll2: "1",
				          time: dateTime,      
				        };
				        console.log(JSON.stringify(pollData));
				        $.ajax({
				          type: "POST",
				          url: "process.php",
				          data: pollData,
				          dataType: "json",
				          encode: true,
				          error: function(){
				            alert("Error: cannot connect to the server");
				          },
				          success: function(data) {
				            alert(data);
				          }
				        }).done(function (data) {
				          console.log(data);
				          alert("Done executing");
				        });
				    
				        event.preventDefault();
        		};

        		document.getElementById("poll-btn-3").onclick = function(){
						var pollData = {
				          poll3: "1",
				          time: dateTime,      
				        };
				        console.log(JSON.stringify(pollData));
				        $.ajax({
				          type: "POST",
				          url: "process.php",
				          data: pollData,
				          dataType: "json",
				          encode: true,
				          error: function(){
				            alert("Error: cannot connect to the server");
				          },
				          success: function(data) {
				            alert(data);
				          }
				        }).done(function (data) {
				          console.log(data);
				          alert("Done executing");
				        });
				    
				        event.preventDefault();	
        		};
        }
    }
});

function queryAllAPIs(callback) {
    queryAPI(2074597, "upperbody", callback);
    queryAPI(2074598, "lowerbody", callback);
}

// if the exercise is too old, re-get from website and save to storage.
function queryAPI(workoutID, workoutType, callback){ 
    var exercises;
    var xhr = new XMLHttpRequest();
    var URL = "https://physera.com/api/workout/" + workoutID;
    xhr.open("GET", URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            exercises = JSON.parse(xhr.responseText); // get the exercises
            
            var d = new Date(); // save the date we got this exercise
            chrome.storage.local.set({'exercisesLastSaved': d.getTime()}, function() {
                console.log("Current date " + d.getTime() + " saved as exercisesLastSaved.");
            });

            // save the results
            // we can't do this modularly since set({key: result}) results in an error
            if (workoutType == "upperbody") {
                chrome.storage.local.set({"upperbodyresults": exercises}, function() {
                  console.log("Saved " + workoutType + " results.");
                });
            } else if (workoutType == "lowerbody") {
                chrome.storage.local.set({"lowerbodyresults": exercises}, function() {
                  console.log("Saved " + workoutType + " results.");
                  callback();
                });
            }
        } // end if readystate = 4 statement
    } // end xhr on ready state change function
    xhr.send();  
} 

function grabAndDisplayExercise() {
    var results;
    chrome.storage.local.get('type', function(data) {
        var type;
        if (data.type == null) { type = "upperbody"; }
        else { type = data.type; }
        if (type == "upperbody") {
            chrome.storage.local.get("upperbodyresults", function(data) {
                pickRandomExercise(data.upperbodyresults.exercises);
            });
        } else if (type == "lowerbody") {
            chrome.storage.local.get("lowerbodyresults", function(data) {
                pickRandomExercise(data.lowerbodyresults.exercises);
            });
        } else if (type == "fullbody") {
            var upperOrLower = Math.round(Math.random());
            if (upperOrLower == 0) {
                chrome.storage.local.get("upperbodyresults", function(data) {
                    pickRandomExercise(data.upperbodyresults.exercises);
                });
            } else {
                chrome.storage.local.get("lowerbodyresults", function(data) {
                    pickRandomExercise(data.lowerbodyresults.exercises);
                });
            }
        }
    });
}

// picks a random exercise, displays if it's valid
function pickRandomExercise(exercises){
    var exerciseKeys = Object.keys(exercises);
    var randomKey = exerciseKeys[Math.floor(Math.random() * exerciseKeys.length)];
    var selectedExercise = exercises[randomKey].exercise;
    var valid = ! selectedExercise.display_name.includes("DELETE");
    if (valid) { displayExercise(selectedExercise); }
    else { pickRandomExercise(exercises); }
}

// javascript to append to the html page to display an exercise, precondition it is valid
function displayExercise(selectedExercise) {
    chrome.storage.local.get(['group'], function(result) {
        //Displays an exercise ONLY if group 2 or 3
        if(result.group >=2){
            var displayName = document.createElement('h2');
            displayName.innerHTML = selectedExercise.display_name;
            document.getElementById('content').append(displayName);

            //The following code displays a generic message in lieu of rep times
            var repetitions = document.createElement('p');
            var repString = "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> ";
            repString += "Remember to stretch for at least 30 sec per exercise and 90 sec in total.";
            repetitions.innerHTML = repString;
            document.getElementById('content').append(repetitions);   

            // The following code displays recommended repetitions
            /*var rc = selectedExercise.reps;
            var rt = selectedExercise.rep_time;
            if (rc != null & rt != null) {
                var repetitions = document.createElement('p');
                var repString = "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> ";
                repString += rc;
                if (rc > 1) { repString += " repetitions, one every " + rt + " seconds."; }
                else if (rc = 1) { repString += " repetition for " + rt + " seconds."; }
                repetitions.innerHTML = repString;
                document.getElementById('content').append(repetitions);
            }*/

            var br = document.createElement('br');
            document.getElementById('content').appendChild(br);
            
            var inst = selectedExercise.instructions;
            var instructions = document.createElement('h4');
            instructions.className = "limitWidth";
            instructions.innerHTML = "Instructions: \n";
            document.getElementById('content').append(instructions);
            for (i in inst) {
                var instruction = document.createElement('p');
                var index = Number(i) + 1;
                instruction.innerHTML = index + '. ' + inst[i].text;
                document.getElementById('content').append(instruction);
            }

            // Display video if group 3, image if group 2
            if (result.group == 3){
                var exercise_id = selectedExercise.id;
                var video = document.createElement('video');
                video.src = "/videos/" + exercise_id + ".mp4";
                video.setAttribute("controls", "true");
                video.setAttribute("loop", "True");
                video.setAttribute("muted", "True");
                video.setAttribute("autoplay", "True");
                video.setAttribute("width", "100%");
                document.getElementById('image').append(video);       
            } else {
                var imageURL = selectedExercise.images[0].urls.original;
                var image = document.createElement('img');
                image.src = imageURL;
                image.setAttribute("class", "img-responsive");
                image.setAttribute("max-width", "100%");
                image.setAttribute("height", "auto");
                document.getElementById('image').append(image);
          }
        } else { //If I am group 1 (or null), I don't get any exercise and the refresh button is hidden
            document.getElementById("new-exercise").style.display = "none";
        }
    });
}
