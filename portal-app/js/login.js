// File concerned with the logging in of Administrators into the dashboards.

function processForm(e) {
  var dataJSON = {
    userName: $("#email").val(),
    password: $("#pwd").val()
  };
  $.ajax({
    url: BACKEND + VERIFYADMIN,
    dataType: "text",
    type: "post",
    contentType: "application/json",
    data: $(this).serialize(),
    success: function(data, textStatus, jQxhr) {},
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });

  e.preventDefault();
}

$("#my-form").on("submit", processForm);