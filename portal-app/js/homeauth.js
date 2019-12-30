// JS for all the home.html authentication stuff.

function checkLogin() {
  $.ajax({
    url: BACKEND + ISLOGGEDIN,
    success: function(data, textStatus, jQxhr) {
      let resData = JSON.parse(data);
      if (jQxhr.status === 200 && !resData.isLoggedIn) {
        window.location = "login.html";
      }
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.error(errorThrown);
    }
  });
}

$(document).ready(checkLogin);

function logout(event) {
  event.preventDefault();

  $.ajax({
    url: BACKEND + LOGOUT,
    success: function(data, textStatus, jQxhr) {
      let resData = JSON.parse(data);
      if (jQxhr.status === 200 && resData.message === LOGOUTMESSAGE) {
        // Successfully logged out.
        window.location = "login.html";
      }
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.error(errorThrown);
    }
  });
}

$("#logoutlink").on("click", logout);