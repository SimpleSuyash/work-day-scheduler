
// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function () {
  
  dayjs.extend(window.dayjs_plugin_advancedFormat);


  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.



  let now = dayjs()
  $('#currentDay').text(dayjs(now).format('dddd, MMMM Do'));
  let currentHour = dayjs().hour();
 

  for (let i = 9; i < 18; i++) {

    let hour = 0;
    if (i < 12) {
      hour = i + "AM";
    } else if (i === 12) {
      hour = i + "PM";
    } else {
      hour = (i - 12) + "PM";
    }

    let timeBlockEl = $('<div>');
   
    if(i < currentHour){
      timeBlockEl.addClass('row time-block past');
    }else if(i === currentHour){
      timeBlockEl.addClass('row time-block present');
    }else {
      timeBlockEl.addClass('row time-block future');
    }

    timeBlockEl.attr('id',  i);

    let hourEl = $('<div>');
    hourEl.addClass('col-2 col-md-1 hour text-center py-3');
    hourEl.text(hour);

    let scheduleEl = $('<textarea>');
    scheduleEl.addClass('col-8 col-md-10 description');
    scheduleEl.attr('rows', '3');

    let saveEl = $('<button>');
    saveEl.addClass('btn saveBtn col-2 col-md-1');
    saveEl.attr('aria-label', 'save');

    let saveIcon = $('<i>');
    saveIcon.addClass('fas fa-save');
    saveIcon.attr('aria-hidden', 'true');

    saveEl.append(saveIcon);
    timeBlockEl.append(hourEl);
    timeBlockEl.append(scheduleEl);
    timeBlockEl.append(saveEl);

    $('#container').append(timeBlockEl);
    
    
  }



});
