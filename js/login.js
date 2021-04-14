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
          minlength: 6
        },
        password: {
          required: true,
          minlength: 6
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
        $.ajax({
          type: "POST",
          url: "https://us-east1-onyx-logic-308404.cloudfunctions.net/participantInfo",
          data: formData,
          dataType: "json",
          encode: true,
          error: function(){
            alert("Error: cannot connect to the server");
            //var errorspan = document.getElementById('error');
            //errorspan.innerHTML = "Error";
          },
          success: function(data) {
            alert(data);
          }
        }).done(function (data) {
          console.log(data);
          alert("Done executing");
        });
    
        event.preventDefault();
      });
  });
