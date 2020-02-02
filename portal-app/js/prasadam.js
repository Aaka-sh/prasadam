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

    $("#breakfast").click(function(e) {
        alert(1);
    });

    $("#lunch").click(function(e) {
        alert(2);
    });

    $("#dinner").click(function(e) {
        alert(3);
    });

    if ($("#calendar").length > 0) {
        let Year = new Date().getFullYear(); 
        let month = new Date().getMonth();
        month = month+1;

        $("#calendar").fullCalendar({
            defaultView: 'month',
            headers: {
                left: 'title',
                center: '',
                right: 'today'
            },
            viewRender: (currentView) => {
                // Disabling Prev Button
                var minDate = moment();
                if (minDate >= currentView.start && minDate <= currentView.end) {
                    $(".fc-prev-button").prop('disabled', true); 
                    $(".fc-prev-button").addClass('fc-state-disabled'); 
                }
                else {
                    $(".fc-prev-button").removeClass('fc-state-disabled'); 
                    $(".fc-prev-button").prop('disabled', false); 
                }
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
