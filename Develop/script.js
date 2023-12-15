dayjs.extend(window.dayjs_plugin_advancedFormat);




// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function () {

  let containerEl = $('#container');
  let currentHour = dayjs().hour();
  $('#currentDay').text(dayjs().format('dddd, MMMM Do'));
  // let now = dayjs().startOf('h');
  

  for (let i = 9; i < 18; i++) {

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
    timeBlockEl.attr('data-hour', hour);


    hourEl.addClass('col-2 col-md-1 hour text-center py-3');
    hourEl.text(hour);


    scheduleEl.addClass('col-8 col-md-10 description');
    scheduleEl.attr('rows', '3');


    saveEl.addClass('btn saveBtn col-2 col-md-1');
    saveEl.attr('aria-label', 'save');


    saveIcon.addClass('fas fa-save');
    saveIcon.attr('aria-hidden', 'true');

    saveEl.append(saveIcon);
    timeBlockEl.append(hourEl, scheduleEl, saveEl);
    containerEl.append(timeBlockEl);

    containerEl.on('click', '.saveBtn', handleSave);

  }
  init();







});//end of document.ready

// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  let storedSchedules = readSchedulesFromStorage();

  // This is a helper function that will render todos to the DOM
  renderSchedules(storedSchedules);
}

function renderSchedules(schedules) {


  // Render a new li for each todo
  for (let i = 0; i < schedules.length; i++) {
    let sechedule = schedules[i];
    let time = sechedule.time;
    let task = sechedule.task;
   
    let taskEl = $('.row[data-hour =' + time + ']');
    let scheduleEl = taskEl.children("textarea");
    scheduleEl.val(task);
    
  }
}
// Reads projects from local storage and returns array of project objects.
// Returns an empty array ([]) if there aren't any projects.
function readSchedulesFromStorage() {
  let schedules = localStorage.getItem('schedules');
  if (schedules) {
    schedules = JSON.parse(localStorage.getItem("schedules"));
  } else {
    schedules = [];
  }
  return schedules;
}

function handleSave(theEvent) {
  let schedules = readSchedulesFromStorage();
  let buttonPressedEl = $(theEvent.target.closest('button'));
  let scheduleEl = buttonPressedEl.prev();
  let taskBarEl = buttonPressedEl.parent();
  let taskTimeEl = taskBarEl.children().first();
  let task = scheduleEl.val().trim();
  let scheduleExistAlready = false;
  if (task) {
    let scheduledTask = {
      'time': taskTimeEl.text(),
      'task': task,
    };
    schedules.forEach(function(schedule){
      
      if(schedule.time==scheduledTask.time){
        schedule.task = scheduledTask.task;
        scheduleExistAlready = true;
      }
    });
    if(!scheduleExistAlready){
      schedules.push(scheduledTask);
    }
    saveSchedulesToStorage(schedules);
    let storedSchedules = readSchedulesFromStorage();
    renderSchedules(storeSchedules);
    scheduleEl.val("");
    
  } else {
    scheduleEl.val('');
    $(scheduleEl).attr('placeholder', '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Your task is empty. The Schedule could not be saved. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    setTimeout(() => scheduleEl.attr('placeholder', ''), 3000);
  }


};

// Takes an array of projects and saves them in localStorage.
function saveSchedulesToStorage(schedules) {
    localStorage.setItem('schedules', JSON.stringify(schedules));
    let saveMessageEl = $('#save-result');
    saveMessageEl.append('Appontment Added to ', '<span>localstorage </span><i class="fa-solid fa-check fa-beat fa-xl"></i>');
    setTimeout(() => saveMessageEl.html(''),3000);
  }

  



  
