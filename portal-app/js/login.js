// File concerned with the logging in of Administrators into the dashboards.

function processForm(e) {
    $.ajax({
        url: BACKEND + VERIFYADMIN,
        dataType: "text",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        data: $(this).serialize(),
        success: function(data, textStatus, jQxhr) {
            if (jQxhr.status === 200) {
                // Admin is valid.
                // Redirect to home.html.

                window.location = "home.html";
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });

    e.preventDefault();
}

$("#my-form").on("submit", processForm);

// For login.html, first check if the admin is already logged in.

function checkLogin() {
    $.ajax({
        url: BACKEND + ISLOGGEDIN,
        success: function(data, textStatus, jQxhr) {
            let resData = JSON.parse(data);
            if (jQxhr.status === 200 && resData.isLoggedIn) {
                window.location = "home.html";
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });
}

$(document).ready(checkLogin);
