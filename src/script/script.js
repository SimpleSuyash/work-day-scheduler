
/*global $, window, document*/

//for date ordinal, advancedFormat plugin is required
dayjs.extend(window.dayjs_plugin_advancedFormat);
//getting header date
const todayEl= $('#currentDay');
//getting save successful message element
const saveMessageEl = $('#save-result');
//getting container
const containerEl = $('#container');

function loadUI() {
  const currentHour = dayjs().hour();
  //displays today's formatted date
  todayEl.text(dayjs().format('dddd, MMMM Do'));
  
  for (let i = 9; i < 24; i++) {
    const timeBlockEl = $('<div>');
    const hourEl = $('<div>');
    const scheduleEl = $('<textarea>');
    const saveEl = $('<button>');
    const saveIcon = $('<i>');
    const hourText = dayjs().hour(i).format('hA');//hours like: 9AM, 5PM
    const hour = dayjs().hour(i).format('H');// hours like: 9, 17

    if (hour < currentHour) {
      //when the given time is before the current hour
      // adding past class
      timeBlockEl.addClass('row time-block past');
      //schedule in textarea making read only
      scheduleEl.attr('readonly', true);
      //save button also disabling
      saveEl.attr('disabled', true);
      saveEl.addClass('unHover');
    } else if (hour == currentHour) {
      //when the given hour is same as the current hour
      timeBlockEl.addClass('row time-block present');
    } else {
      //when the given hour is after the current hour
      timeBlockEl.addClass('row time-block future');
    }
    //time block/row
    timeBlockEl.attr('id', hour);

    //hour column
    hourEl.addClass('col-2 col-md-1 hour text-center py-3');
    hourEl.text(hourText);
    // schedule/task column
    scheduleEl.addClass('col-8 col-md-10 description');
    scheduleEl.attr('rows', '3');
    scheduleEl.attr('data-hour', hourText);
    //attaching the enter event
    scheduleEl.on('keydown', handleEnter);
    //save button column
    saveEl.addClass('saveBtn col-2 col-md-1');
    saveEl.attr('aria-label', 'save');
  
    //save icon inside the save button
    saveIcon.addClass('fas fa-save');
    saveIcon.attr('aria-hidden', 'true');
    

    //appedning the elements to their respective parents
    saveEl.append(saveIcon);
    timeBlockEl.append(hourEl, scheduleEl, saveEl);
    containerEl.append(timeBlockEl);
    // attaching onclick event in the container element
    //delegating the click event on save button to the container
    containerEl.on('click', '.saveBtn', handleSave);
  }
}

// Reads projects from local storage and returns array of schedule objects.
// Returns an empty array ([]) if there aren't any schedules.
function readSchedulesFromStorage() {
  let schedules = localStorage.getItem('schedules');
  if (schedules) {
    //if schedules array is not null
    schedules = JSON.parse(localStorage.getItem("schedules"));
  } else {
    schedules = [];
  }
  return schedules;
} 
function renderSchedules(schedules) {
  //going thru each items in the given schedules array
  schedules.forEach((schedule) => {
    //selects textarea element that have attribute data-hour = given time
    const scheduleEl = $(`textarea[data-hour = ${schedule.time}]`);
    //setting schedule element value to matched item(schedule) in the array's task value
    scheduleEl.val(schedule.task);
  });
}

// Takes an array of schedules and saves them in localStorage.
function saveSchedulesToStorage(schedules, toSaveOrDelete='save') {
 
  localStorage.setItem('schedules', JSON.stringify(schedules));
  //scrolls to the top of the page, so that save successful message is visible
  $(window).scrollTop(0);
  if(toSaveOrDelete == 'save'){
    // displaying the save successful message on top of the time blocks
    saveMessageEl.html('The schedule is added to the <span>localstorage </span><i class="fa-solid fa-check fa-beat fa-xl"></i>');
  }else{
    // displaying the save successful message on top of the time blocks
    saveMessageEl.html('The schedule is removed from the <span>localstorage </span><i class="fa-solid fa-check fa-beat fa-xl"></i>');
  }
 
  setTimeout(() => saveMessageEl.empty(), 3000);
}

//disabling the enter in the schedule textarea
//since only one event can be saved for any given hour
//keycode 13 is enter key
function handleEnter(theEvent) {
  if (theEvent.keyCode === 13) {
    theEvent.preventDefault();
    return false;
  }
};

//defining the click event on save button
function handleSave(theEvent) {
  let schedules = readSchedulesFromStorage();
  // closet('button') helps fire event when the inside icon is pressed
  const buttonPressedEl = $(theEvent.target.closest('button'));
  //getting previous sibling of the clicked button
  const scheduleEl = buttonPressedEl.prev();
  //trimming any white space before and after
  const task = scheduleEl.val().trim();
  const time = scheduleEl.attr('data-hour');
  //to track if for any given hour, the schedule already exist in the storage
  let scheduleExistAlready = false;
 
  if (task) {//when user typed sth as a schedule
    //for all the schedules in the storage
    //if time in the storage matches to the schedule element time
    //change the schedule in the storage with that of the schedule element
    schedules.forEach((schedule ) => {
      if (schedule.time == time) {
        //when a schedule already exist for the hour
        // just update the new schedule
        schedule.task = task;
        scheduleExistAlready = true;
      }
    });
    if (!scheduleExistAlready) {
      //if no schedules found in the storage for the given hours
      //add the schedule
      schedules.push({time, task});
    }
    //save all the schedules to storage
    saveSchedulesToStorage(schedules);
    //reseting the schedule element
    scheduleEl.val("");
    
  //when the schedule element's value is empty 
  //or when there is no schedule but user pressed save button
  }else {  //user typed empty string
    //this serves as the delete function
    //if there was a task scheduled before 
    //and now user is replacing with empty string
    let theExistingSchedule;
    schedules.forEach((schedule) => {
      if (schedule.time == time) {
        //finding the existing schedule
        theExistingSchedule = schedule;
        scheduleExistAlready=true;
      }
    });
    if(scheduleExistAlready){//when user typed empty string, but previous schedule exists
      //creating a new schedules without the previously stored schedule
      schedules = schedules.filter(schedule => schedule != theExistingSchedule);
      // save all the schedules to storage
      saveSchedulesToStorage(schedules, 'R');
      scheduleEl.val("");

    }else {//when user typed empty string, and no previous schedule exists
      //schedule element textarea may have whitespaces, 
      //so making it empty, so placehoder can be displayed as an error message
      scheduleEl.val('');
      scheduleEl.attr('placeholder', '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Your task is empty. The Schedule could not be saved. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      setTimeout(() => scheduleEl.attr('placeholder', ''), 3000);
    }
  }
  const storedSchedules = readSchedulesFromStorage();
  //filling the schedule in schedule elements form the storage
  renderSchedules(storedSchedules);
}//end of handlesave



// This function is being called below and will run when the page loads.
function init() {
  //renders all the html elements
  loadUI();
  // gets stored schedules from localStorage
  const storedSchedules = readSchedulesFromStorage();

  // renders saved schedules to the DOM
  renderSchedules(storedSchedules);
}

// prevents the code from running until the browser has finished rendering all the elements in the html
$(document).ready(function () {
  init();
});