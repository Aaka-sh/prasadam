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

  $("#reg_btn").click(function(e) {
    e.preventDefault();
    var dataJSON = {
      userName: $("#username").val()
    };
    $.ajax({
      url: BACKEND + "adduser/",
      dataType: "text",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(dataJSON),
      success: function(data, textStatus, jQxhr) {
        alert("Devotie added hari bol ...");
        window.location.href = "home.html";
      },
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
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
  //var checkBox = $("#fc-event-container").find(".fc-title").getElementById("breakfast");

  if ($("#responseData").html() !== undefined) {
    var jsonData = JSON.parse(
      $("#responseData")
        .html()
        .replace(/&quot;/g, '"') != ""
        ? $("#responseData")
            .html()
            .replace(/&quot;/g, '"')
        : "[]"
    );
  } else {
    var jsonData = null;
  }
  var counters = "[";
  //if(jsonData !=null && jsonData.length>0 ){
  var currentDate = new Date();
  //var dayInMonth = daysInMonth(currentDate.getMonth(),currentDate.getFullYear());
  //var dayInNextMonth = daysInMonth(currentDate.getMonth()+1,currentDate.getFullYear());
  var nextMonth = new Date(currentDate);
  var nextMonthDate = new Date(
    new Date(nextMonth).setMonth(nextMonth.getMonth() + "2")
  );
  var dayInCurrentMonth = daysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );
  var dayInNextMonth = daysInMonth(
    nextMonthDate.getMonth(),
    nextMonthDate.getFullYear()
  );
  for (var i = currentDate.getMonth() + 1; i < nextMonthDate.getMonth(); i++) {
    dayInNextMonth =
      dayInNextMonth +
      daysInMonth(currentDate.getMonth() + i, nextMonthDate.getFullYear());
  }

  var flagFormatchday = false;
  var count = dayInNextMonth;

  for (var j = 0; j < count; j++) {
    var newdate;
    if (newdate == null) {
      newdate = new Date(currentDate);
    } else {
      newdate = new Date(newdate);
    }
    newdate.setDate(newdate.getDate() + 1);

    flagFormatchday = false;
    var year1 = newdate.getFullYear();
    var day1 =
      newdate.getDate() < 10 ? "0" + newdate.getDate() : newdate.getDate();
    var month1 =
      parseInt(newdate.getMonth()) + 1 < 10
        ? "0" + (parseInt(newdate.getMonth()) + 1)
        : parseInt(newdate.getMonth()) + 1;
    var minutes1 =
      newdate.getMinutes() < 10
        ? "0" + newdate.getMinutes()
        : newdate.getMinutes();
    var hours1 =
      newdate.getHours() < 10 ? "0" + newdate.getHours() : newdate.getHours();
    var isoDate1 =
      year1 +
      "-" +
      month1 +
      "-" +
      day1 +
      "T" +
      hours1 +
      ":" +
      minutes1 +
      ":00+00:00";
    if (jsonData == "undefined") {
      alert("Sorry Appointment Data Is Not Available");
      var zipCode = $("#searchquery").val();
      var radius = $("#radius").val();
      var url = Urls.getStore + "?searchquery=" + zipCode + "&radius=" + radius;
      window.location.href = url;
      return;
    }
    if (jsonData !== null) {
      for (var k = 0; k < jsonData.Days.length; k++) {
        var availbaleSlots = jsonData.Days[k].availableTimeSlots;
        var dateString1 = jsonData.Days[k].Date; //+''+availbaleSlots[i].startTime;
        var dateString2 = jsonData.Days[k].Date;
        var CDate1 = new Date(Date.parse(dateString1));
        var CDate2 = new Date(Date.parse(dateString2));
        var year = CDate1.getFullYear();
        var day =
          CDate1.getDate() < 10 ? "0" + CDate1.getDate() : CDate1.getDate();
        var month =
          parseInt(CDate1.getMonth()) + 1 < 10
            ? "0" + (parseInt(CDate1.getMonth()) + 1)
            : parseInt(CDate1.getMonth()) + 1;
        var minutes =
          CDate1.getMinutes() < 10
            ? "0" + CDate1.getMinutes()
            : CDate1.getMinutes();
        var hours =
          CDate1.getHours() < 10 ? "0" + CDate1.getHours() : CDate1.getHours();
        var isoDate =
          year +
          "-" +
          month +
          "-" +
          day +
          "T" +
          hours +
          ":" +
          minutes +
          ":00+00:00";
        if (
          day1 == day &&
          month == month1 &&
          typeof availbaleSlots != "undefined"
        ) {
          counters +=
            '{"title":"' +
            availbaleSlots.length +
            ' Available","start":"' +
            isoDate +
            '"},';
          flagFormatchday = true;
        }
      }
    }
    if (flagFormatchday == false) {
      counters += '{"title":"None Available","start":"' + isoDate1 + '"},';
    }
  }

  counters = counters.substring(0, counters.length - 1);
  //}
  counters += "]";

  var eventArray = JSON.parse(counters);

  if ($("#calendar").length > 0) {
    $("#calendar").fullCalendar({
      header: {
        left: "prev,next",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      events: eventArray,
      eventClick: function(calEvent, jsEvent, view) {
        if (view) {
          var tdActive = $("td.fc-day-number[data-date='" + date + "']");
          var tdEvent = tdActive
            .closest("table")
            .find("tbody td")
            .eq(tdActive.index());
          alert(tdEvent);
          //document.getElementById("slotId").value = calEvent.id;
          //document.getElementById("timeSlot").value = calEvent.start;
          //var favorite = [];
          /*$.each($("input[name='prasad']:checked"), function(){            
                //favorite.push($(this).val());
                alert($(this).val());
            });*/
          //alert("My favourite sports are: " + favorite.join(", "));
          alert($("input[name='breakfast']:checked").val());
          //alert($("input[name='lunch']:checked").val());
          //alert($("input[name='dinner']:checked").val());
        }
      },
      eventAfterAllRender: function(view) {}
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
