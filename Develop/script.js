
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

  let schedules = [];
  let containerEl = $('#container');
  let now = dayjs();
  let currentHour = dayjs().hour();
  $('#currentDay').text(dayjs(now).format('dddd, MMMM Do'));



  for (let i = 1; i < 12; i++) {

    let timeBlockEl = $('<div>');
    let hourEl = $('<div>');
    let scheduleEl = $('<textarea>');
    let saveEl = $('<button>');
    let saveIcon = $('<i>');

    let hour = 0;
    if (i < 12) {
      hour = i + "AM";
    } else if (i === 12) {
      hour = i + "PM";
    } else {
      hour = (i - 12) + "PM";
    }



    if (i < currentHour) {
      timeBlockEl.addClass('row time-block past');
      scheduleEl.attr('readonly', true);
      saveEl.attr('disabled', true);
    } else if (i === currentHour) {
      timeBlockEl.addClass('row time-block present');
    } else {
      timeBlockEl.addClass('row time-block future');
    }

    timeBlockEl.attr('id', i);


    hourEl.addClass('col-2 col-md-1 hour text-center py-3');
    hourEl.text(hour);


    scheduleEl.addClass('col-8 col-md-10 description');
    scheduleEl.attr('rows', '3');


    saveEl.addClass('btn saveBtn col-2 col-md-1');
    saveEl.attr('aria-label', 'save');


    saveIcon.addClass('fas fa-save');
    saveIcon.attr('aria-hidden', 'true');

    saveEl.append(saveIcon);
    timeBlockEl.append(hourEl);
    timeBlockEl.append(scheduleEl);
    timeBlockEl.append(saveEl);

    containerEl.append(timeBlockEl);

  }

  containerEl.on('click', '.saveBtn', function (theEvent) {
    let buttonPressedEl = $(theEvent.target.closest('button'));
    let scheduleEl = buttonPressedEl.prev();
    let taskBarEl= buttonPressedEl.parent();
    let taskTimeEl = taskBarEl.children().first();
    let task = scheduleEl.val();
      

    // if($.trim(scheduleEl.val()) != ""){
      if(task){
      let taskScheduled = {
        'time': taskTimeEl.text(),
        'task': scheduleEl.val(),
      };
      schedules.push(taskScheduled);
      scheduleEl.val("") ;
      saveSchedule();

    }
    // else if($.trim(scheduleEl.val()) === )
    
    else{
      $(scheduleEl).attr('placeholder', '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Your task is empty. The Schedule could not be saved. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      setTimeout(() => scheduleEl.attr('placeholder', ''), 3000);
    }
    
  });
  

  function saveSchedule(){
      localStorage.setItem('schedule', JSON.stringify(schedules));
  }



});//end of document.ready
