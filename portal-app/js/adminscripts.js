(function getTodaysPrasadam() {
    const endpoint = BACKEND + GETNPRASADAM;

    let timings = TIMINGS;
    let nPrasads = [];

    timings.forEach(cancellationTime => {
        let postData = `cancellationTime=${cancellationTime.toLowerCase()}`;

        let xhr = new XMLHttpRequest();

        xhr.open("POST", endpoint);

        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        xhr.onload = function() {
            try {
                let response = JSON.parse(xhr.responseText);
                nPrasads.push(response);

                let tableHTML = $("#prasadcount").html();

                tableHTML += `
                    <tr>
                        <th class='prasadtimecell'>${
                            response.prasadamTime === "lunch"
                                ? "Dinner"
                                : "Brunch"
                        }</th>
                        <td>${response.nPrasadam}</td>
                    </tr>
                `;

                $("#prasadcount").html(tableHTML);
            } catch (err) {
                console.error(err);
            }
        };

        xhr.send(postData);
    });
})();

function getPrasadamForDate(event) {
    event.preventDefault();

    const endpoint = BACKEND + GETNPRASADAM;
    let timings = TIMINGS;

    let date = $("#selectedDate").val();

    timings.forEach((cancellationTime, index) => {
        let postData = `cancellationTime=${cancellationTime.toLowerCase()}&cancellationDate=${date}`;

        let xhr = new XMLHttpRequest();
        $("#prasadcount").html("");

        xhr.open("POST", endpoint);

        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        xhr.onload = function() {
            try {
                let response = JSON.parse(xhr.responseText);
                let tableHTML = $("#prasadcount").html();

                tableHTML += `
                    <tr>
                        <th class='prasadtimecell'>${
                            response.prasadamTime === "lunch"
                                ? "Dinner"
                                : "Brunch"
                        }</th>
                        <td>${response.nPrasadam}</td>
                    </tr>
                `;

                $("#prasadcount").html(tableHTML);
            } catch (err) {
                console.error(err);
            }
        };

        xhr.send(postData);
    });
}

function deleteuser(userid = null) {
    if (userid) {
        const endpoint = BACKEND + DELETEUSER + "?userid=" + userid;

        let xhr = new XMLHttpRequest();

        xhr.open("DELETE", endpoint);

        xhr.send();

        xhr.onload = () => {
            window.location.reload();
        };
    }
}

function getDevotees() {
    const endpoint = BACKEND + GETDEVOTEES;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", endpoint);

    xhr.onload = () => {
        let users = [], html = "";

        try {
            users = JSON.parse(xhr.responseText);
        } catch (err) {
            console.error(err);
        }

        if (users.length > 0) {
            html = users.map(
                user =>
                    `<div class="row userrow">
                <div class="col-4">${user.name}</div>
                <div class="col-4">${user.username}</div>
                <div class="col-4"><button class='btn btn-danger' onclick="deleteuser(${user.id})">Delete User</button></div>
            </div>`
            );

            html = html
                .toString()
                .split(",")
                .join("");

            html =
                `<div class='row userrow'>
            <div class='col-4'><strong>Name</strong></div>
            <div class='col-4'><strong>Email</strong></div>
            <div class='col-4'><strong>Action</strong></div>
        </div>` + html;
        }
        else{
            html = "No Devotees Found.";
        }

        $("#devoteestable").html(html);
    };

    xhr.send();
}

$(document).ready(getDevotees);
