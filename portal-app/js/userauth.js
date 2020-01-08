// Scripts for User Authentication

function checkLoggedIn() {
    // This function should be bound to userlogin.html.
    // Check if the user is already logged in.
    const url = BACKEND + ISUSERLOGGEDIN;

    $.ajax({
        url,
        success: (data, textStatus, jQxhr) => {
            let resData = JSON.parse(data);
            if (jQxhr.status === 200 && resData.isLoggedIn) {
                window.location = "index.html";
            }
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.error(errorThrown);
        }
    });
}

$(document).ready(checkLoggedIn);

function login(event) {
    event.preventDefault();
    const url = BACKEND + USERLOGIN;

    $.ajax({
        url,
        dataType: "text",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        data: $("#userloginform").serialize(),
        success: (data, textStatus, jQxhr) => {
            if (jQxhr.status === 200) {
                // Admin is valid.
                // Redirect to home.html.

                window.location = "index.html";
            }
        },
        error: (jqXhr, textStatus, errorThrown) => {
            let errorMessage = JSON.parse(jqXhr.responseText).error;

			$("#errormessage").text(errorMessage);
			$("#errormessage").addClass("alert alert-danger");

            setTimeout(() => {
				$("#errormessage").text("");
				$("#errormessage").removeClass("alert alert-danger");
            }, 2000); // Remove error message after 2 seconds.
        }
    });
}

$("#userloginform").on("submit", login);
