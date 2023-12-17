dayjs.extend(window.dayjs_plugin_advancedFormat);




// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function () {
 
  
  // let now = dayjs().startOf('h');
  init();
});//end of document.ready


function loadUI() {
  $('#currentDay').text(dayjs().format('dddd, MMMM Do'));
  const currentHour = dayjs().hour();
  
  const containerEl = $('#container');
  
  for (let i = 4; i < 9; i++) {

    const timeBlockEl = $('<div>');
    const hourEl = $('<div>');
    const scheduleEl = $('<textarea>');
    const saveEl = $('<button>');
    const saveIcon = $('<i>');
    let hourText = dayjs().hour(i).format('hA');
    let hour = dayjs().hour(i).format('H');

    if (hour < currentHour) {
      timeBlockEl.addClass('row time-block past');
      scheduleEl.attr('readonly', true);
      saveEl.attr('disabled', true);
    } else if (hour == currentHour) {
      timeBlockEl.addClass('row time-block present');
    } else {
      timeBlockEl.addClass('row time-block future');
    }

    timeBlockEl.attr('id', hour);
    


    hourEl.addClass('col-2 col-md-1 hour text-center py-3');
    hourEl.text(hourText);


    scheduleEl.addClass('col-8 col-md-10 description');
    scheduleEl.attr('rows', '3');
    scheduleEl.attr('data-hour', hourText);
    scheduleEl.on('keydown', handleEnter);

    saveEl.addClass('btn saveBtn col-2 col-md-1');
    saveEl.attr('aria-label', 'save');


    saveIcon.addClass('fas fa-save');
    saveIcon.attr('aria-hidden', 'true');

    saveEl.append(saveIcon);
    timeBlockEl.append(hourEl, scheduleEl, saveEl);
    containerEl.append(timeBlockEl);

    containerEl.on('click', '.saveBtn', handleSave);
  }
}
// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  let storedSchedules = readSchedulesFromStorage();

    loadUI();
  // This is a helper function that will render todos to the DOM
  renderSchedules(storedSchedules);
}

function renderSchedules(schedules) {
  schedules.forEach((schedule)=>{
    //selects elements with row class that have attribute data-hour = given time
    let scheduleEl = $(`textarea[data-hour = ${schedule.time}]`);
    scheduleEl.val(schedule.task);
  });

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
function handleEnter(theEvent){
  if(theEvent.keyCode === 13 ){
    theEvent.preventDefault();
    return false;
  }
};

function handleSave(theEvent) {
  let schedules = readSchedulesFromStorage();
  // closet('button') helps fire event when the inside icon is pressed
  let buttonPressedEl = $(theEvent.target.closest('button'));
  let scheduleEl = buttonPressedEl.prev();
  // let taskBarEl = buttonPressedEl.parent();
  // let taskTimeEl = taskBarEl.children().first();
  let task = scheduleEl.val().trim();
  let time = scheduleEl.attr('data-hour');
  let scheduleExistAlready = false;
  if (task) {
    let scheduledTask = {
      'time': time,
      'task': task
    };
    schedules.forEach((schedule)=>{
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
    scheduleEl.val("");
    renderSchedules(storedSchedules);
    
    
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
    // saveMessageEl.append('saved');
    saveMessageEl.html('Appontment Added to <span>localstorage </span><i class="fa-solid fa-check fa-beat fa-xl"></i>');
    // setTimeout(() => saveMessageEl.html(''),3000);
    setTimeout(() => saveMessageEl.empty(),3000);
  }

  



  
