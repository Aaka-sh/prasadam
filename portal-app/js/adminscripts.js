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
                        <th class='prasadtimecell'>${response.prasadamTime}</th>
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

    timings.forEach(cancellationTime => {
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
                        <th class='prasadtimecell'>${response.prasadamTime}</th>
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

