// User Scripts for user dashboard.

function checkLoggedIn() {
    // This function should be bound to userlogin.html.
    // Check if the user is already logged in.
    const url = BACKEND + ISUSERLOGGEDIN;

    $.ajax({
        url,
        success: (data, textStatus, jQxhr) => {
            let resData = JSON.parse(data);
            if (jQxhr.status !== 200 || !resData.isLoggedIn || !resData.name) {
                window.location = "userlogin.html";
            }
            else{
                $("#nameplaceholder").html("<strong>Hare Krishna " + resData.name + "! 🙋‍♂️</strong>");
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

function getMonthCancellations(
    cancellationTime = TIMINGS[0],
    monthNum = new Date().getMonth() + 1,
    callback = function(){}
) {
    const url =
        BACKEND +
        GERUSERCANCELLATIONS +
        "?cancellationTime=" +
        cancellationTime.toLowerCase() +
        "&month=" +
        monthNum;

    $.ajax({
        url,
        success: function(data, textStatus, jQxhr) {
            return callback(data);
        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });
}
