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
            minlength: "Your ID must be at least 5 characters long"
          },
        password: {
          required: "Please provide your password",
          minlength: "Your password must be at least 5 characters long"
        }
      },
      // Make sure the form is submitted to the destination defined
      // in the "action" attribute of the form when valid
      submitHandler: function(form) {
        form.submit();
      }
    });
    $("form[name='login']").submit(function (event) {
      var url = "https://us-east1-onyx-logic-308404.cloudfunctions.net/participantInfo";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            alert(xhr.status);
        }};

      var data = `{
        "pid": "12345",
        "pwd": "participantpassword123"         
      }`;

      xhr.send(data);
      event.preventDefault();

      /*event.preventDefault();
      // Prepare payload
      var formData = {
        pid: $("#pid").val(),
        pwd: $("#password").val(),         
      };
      console.log(JSON.stringify(formData));
      //POST request
      var url = "https://us-east1-onyx-logic-308404.cloudfunctions.net/participantInfo";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
          
      xhr.setRequestHeader("Content-Type", "application/json");
      console.log("ready to send");

      xhr.onreadystatechange = function () {
        alert(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
          if(parseInt(this.responseText)>0)
          {
            alert("USER FOUND!!");
          } else {
            alert("Unexpected error");
          }
        } else if (this.readyState == 4 && this.status == 403) {
          alert("Authorization error");
        };
        };           
        xhr.send(JSON.stringify(formData));
        //open(location, '_self').close();
        */
      });
})
