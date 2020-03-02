var tempCountArray = [];

$(document).ready(function() {
    if ($(document).find("#selectedDate") > 0) {
        loadFunction();
        getPrasdamCount();
    }
    $("#div1").click(function(e) {
        e.preventDefault();
        var prasadam = $("input:checkbox:checked")
            .map(function() {
                return this.value + ",";
            })
            .toArray();
        var sendInfo = {
            username: "RamKrishna",
            chooseprasad: prasadam,
            prasaddate: $("#selectedDate").val()
        };
        $.ajax({
            url: BACKEND + "add/",
            dataType: "JSON",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(sendInfo),
            success: function(data, textStatus, jQxhr) {
                $("#response pre").html(data);
            },
            error: function(jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });

    $("#adderform").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: BACKEND + "adduser/",
            dataType: "JSON",
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: $("#adderform").serialize(),
            success: function(data) {
                $("#alerter").text(data.message);
                $("#alerter").removeClass("alert alert-danger");
                $("#alerter").addClass("alert alert-success");
                
                // Emptying inputs
                $("#adderform .form-control").val("");
                getDevotees();

                setInterval(() => {
                    $("#alerter").text("");
                    $("#alerter").removeClass("alert alert-success");
                }, 2000);
            },
            error: function(jqXhr) {
                let error = jqXhr.responseJSON.error;
                $("#alerter").text(error);
                $("#alerter").removeClass("alert alert-success");
                $("#alerter").addClass("alert alert-danger");

                setInterval(() => {
                    $("#alerter").text("");
                    $("#alerter").removeClass("alert alert-danger");
                }, 2000);
            }
        });
    });
});

/*
    The Following is the heart of the app. Do not alter in any way.
*/

$(document).ready(() => {
    // 1. Get all the dates for the month with cancelled subscription.
    // 2. Once we get it, render the calendar.
    let cancellationDet = [];

    function isCancellationDate(dateStr, cancellationDet, cancellationTime) {
        for (let c in cancellationDet) {
            if (
                cancellationDet[c].cancellationDates.indexOf(dateStr) >= 0 &&
                cancellationDet[c].prasadamTime === cancellationTime
            )
                return cancellationDet[c].prasadamTime;
        }
        return false;
    }

    function sendCancellations() {
        // Finding each cancellation
        TIMINGS.forEach(timing => {
            let $timingCancellations = [];

            $checkBoxCollection = $(`.${timing.toLowerCase()}-check`);

            for (let $cell of $checkBoxCollection) {
                if (!$cell.checked && !$cell.classList.includes("cancelled")) {
                    $timingCancellations.push($cell.getAttribute("data-date"));
                }
            }

            // We have the cancellations.

            if ($timingCancellations.length > 0) {
                // Send cancellation request and refresh the system.
                const url = BACKEND + CANCELUSERPRASADAM;
                const objToSend = JSON.stringify({
                    cancellationTime: timing.toLowerCase(),
                    cancellationDates: $timingCancellations
                });

                $.ajax({
                    url,
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: "data=" + objToSend,
                    success: function(data) {
                        $("#alerter").html(
                            "<br/><div class='alert alert-success'>" +
                                data.message +
                                "</div>"
                        );

                        setInterval(() => {
                            $("#alerter").html("");
                        }, 2000);
                    },
                    error: function(jqXhr, textStatus, errorThrown) {
                        $("#alerter").html(
                            "<br/><div class='alert alert-danger'>" +
                                errorThrown +
                                "</div>"
                        );

                        setInterval(() => {
                            $("#alerter").html("");
                        }, 2000);
                    }
                });

                getActiveCancellations();
            }
        });
    }

    function renderCells(cell, cancellationDet) {
        let cellinnerHTML = "<div class='checkwrapper'>";

        if (
            !cell.classList.contains("fc-past") &&
            !cell.classList.contains("fc-today") &&
            !cell.classList.contains("fc-other-month")
        ) {
            let date = cell.getAttribute("data-date");

            TIMINGS.forEach((timing, index) => {
                let isCancelled = isCancellationDate(
                    date,
                    cancellationDet,
                    timing.toLowerCase()
                );

                if (isCancelled)
                    cellinnerHTML += `<div class='checkcontainer'>
                    <input type='checkbox' class='${timing.toLowerCase()}-check cancelled' data-date='${date}'></input>
                    &nbsp;<label>${RENDERTIMINGS[index]}</label>
                </div>`;
                else
                    cellinnerHTML += `<div class='checkcontainer'>
                        <input type='checkbox' class='${timing.toLowerCase()}-check' checked="true" data-date='${date}'></input>
                        &nbsp;<label>${RENDERTIMINGS[index]}</label>
                    </div>`;

                // Removing the hindering skeleton.
                for (let tbody of $(".fc-content-skeleton tbody")) {
                    tbody.outerHTML = "";
                }
            });
        }

        cellinnerHTML += "</div>";
        cell.innerHTML = cellinnerHTML;
    }

    function getActiveCancellations() {
        // Getting the cancellations for the current active month.
        TIMINGS.forEach(timing => {
            getMonthCancellations(
                timing,
                $("#calendar")
                    .fullCalendar("getDate")
                    ._d.getMonth() + 1,
                function(data) {
                    if (data) {
                        cancellationDet.push(data);
                        $("td.fc-day.fc-widget-content").each(function() {
                            renderCells(this, cancellationDet);
                        });
                    }
                }
            );
        });
    }

    if ($("#calendar").length > 0) {
        let Year = new Date().getFullYear();
        let month = new Date().getMonth();
        month = month + 1;

        $("#calendar").fullCalendar({
            defaultView: "month",
            headers: {
                left: "title",
                center: "",
                right: "today"
            },
            // validRange: (function(currentDate) {

            //     return {
            //         start: currentDate,
            //         end: `${new Date().getFullYear()}-${
            //             new Date().getMonth() + 1 < 10
            //                 ? "0" + (new Date().getMonth() + 1)
            //                 : new Date().getMonth() + 1
            //         }-31`
            //     };
            // })(),
            dayRender: function(date, cell) {
                cell[0].innerHTML = "";
            },
            viewRender: function(currentView) {
                // Disabling Prev Button
                var minDate = moment();
                if (
                    minDate >= currentView.start &&
                    minDate <= currentView.end
                ) {
                    $(".fc-prev-button").prop("disabled", true);
                    $(".fc-prev-button").addClass("fc-state-disabled");
                } else {
                    $(".fc-prev-button").removeClass("fc-state-disabled");
                    $(".fc-prev-button").prop("disabled", false);
                }

                getActiveCancellations();

                // Adding a submit button for cancelling prasadam.
                let buttonHTML = `<div class='buttoncontainer'><button class='btn btn-primary' id='senderButton'>
                    Submit
                </button></div>`;
                $(".fc-center").html(buttonHTML);
                $("#senderButton").click(sendCancellations);
            }
        });
    }
});

function getPrasdamCount() {
    var typeArray = ["Breakfast", "Lunch", "Dinner"];
    for (var i = 0; i < 3; i++) {
        var dataJSON = {
            prasaddate: $("#selectedDate").val(),
            chooseprasad: typeArray[i]
        };
        $.ajax({
            url: BACKEND + "count/",
            dataType: "text",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(dataJSON),
            success: function(data, textStatus, jQxhr) {
                tempCountArray.push(JSON.parse(data)["output"][0]["COUNT(*)"]);
                if (tempCountArray.length == 3) {
                    $("#prasadcount")
                        .find("#breakfast")
                        .empty();
                    $("#prasadcount")
                        .find("#lunch")
                        .empty();
                    $("#prasadcount")
                        .find("#dinner")
                        .empty();
                    $("#prasadcount")
                        .find("#total")
                        .empty();
                    $("#prasadcount")
                        .find("#breakfast")
                        .append(tempCountArray[0]);
                    $("#prasadcount")
                        .find("#lunch")
                        .append(tempCountArray[1]);
                    $("#prasadcount")
                        .find("#dinner")
                        .append(tempCountArray[2]);
                    $("#prasadcount")
                        .find("#total")
                        .append(
                            parseInt(tempCountArray[0]) +
                                parseInt(tempCountArray[1]) +
                                parseInt(tempCountArray[2])
                        );
                    //location.reload();
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
}

function loadFunction() {
    // body...
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("selectedDate").defaultValue = today + "";
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
