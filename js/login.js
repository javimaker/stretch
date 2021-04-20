// Wait for the DOM to be ready
$(function() {
    // Initialize form validation on the login form.
    // It has the name attribute "login"
    $("form[name='login']").validate({
      // Specify validation rules
      rules: {
        // The key name on the left side is the name attribute
        // of an input field. Validation rules are defined
        // on the right side
        pid: {
          required: true,
          minlength: 5
        },
        password: {
          required: true,
          minlength: 5
        }
      },
      // Specify validation error messages
      messages: {
        pid: {
            required: "Please provide your participant ID",
            minlength: "Your ID must be at least 6 characters long"
          },
        password: {
          required: "Please provide your password",
          minlength: "Your password must be at least 6 characters long"
        }
      },
      // Make sure the form is submitted to the destination defined
      // in the "action" attribute of the form when valid
      submitHandler: function(form) {
        form.submit();
      }
    });
    $("form[name='login']").submit(function (event) {
        var formData = {
          pid: $("#pid").val(),
          pwd: $("#password").val(),         
        };
        
        /*$.ajax({
          type: "POST",
          url: "https://us-east1-onyx-logic-308404.cloudfunctions.net/participantInfo",
          data: formData,
          dataType: "json",
          encode: true,
          error: function(error){
            alert("Error: cannot connect to the server");
            alert(error)
            //var errorspan = document.getElementById('error');
            //errorspan.innerHTML = "Error";
          },
          success: function(data) {
            alert("Successfully logged in!");
          }
        }).done(function (data) {
          alert("Done executing");
        });

        //alert(JSON.stringify(formData));
        var url = "https://us-east1-onyx-logic-308404.cloudfunctions.net/flashPoll";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onreadystatechange = function () {
           if (xhr.readyState === 4) {
              console.log(xhr.status);
              console.log(xhr.responseText);
           }};
      
        var data = `{    "pid": "12345",
            "date_time": "2020-12-28T20:11:04Z",
            "poll_answer": 13
        }`;
        
        xhr.send(data);
        */
              
        event.preventDefault();
        open(location, '_self').close();
      });
})
