// File concerned with the logging in of Administrators into the dashboards.

function processForm(e) {
  var dataJSON = {
    email: $("#email").val(),
    password: $("#password").val()
  };
  $.ajax({
    url: BACKEND + VERIFYADMIN,
    dataType: "text",
    type: "post",
    contentType: "application/x-www-form-urlencoded",
    data: $(this).serialize(),
    success: function(data, textStatus, jQxhr) {
      if(jQxhr.status === 200){
        // Admin is valid.
        // Redirect to home.html.

        window.location = "home.html";
      }
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });

  e.preventDefault();
}

$("#my-form").on("submit", processForm);