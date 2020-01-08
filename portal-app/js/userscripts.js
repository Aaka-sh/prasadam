// User Scripts for user dashboard.

function checkLoggedIn() {
    // This function should be bound to userlogin.html.
    // Check if the user is already logged in.
    const url = BACKEND + ISUSERLOGGEDIN;

    $.ajax({
        url,
        success: (data, textStatus, jQxhr) => {
            let resData = JSON.parse(data);
            if (jQxhr.status !== 200 || !resData.isLoggedIn) {
                window.location = "userlogin.html";
            }
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.error(errorThrown);
        }
    });
}

$(document).ready(checkLoggedIn);

function logout(event) {
    event.preventDefault();

    const url = BACKEND + LOGOUTUSER;

    $.ajax({
        url,
        success: function(data, textStatus, jQxhr) {
            let resData = JSON.parse(data);
            if (jQxhr.status === 200 && resData.message === LOGOUTMESSAGE) {
                // Successfully logged out.
                window.location = "userlogin.html";
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });
}

$("#logoutbutton").click(logout);
