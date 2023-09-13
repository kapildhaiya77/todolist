
   
    let taskList = [];

    function loadTasksFromLocalStorage() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        taskList = JSON.parse(storedTasks);
        displayTasks();
      }
    }
    
    function saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(taskList));
    }
    
    function addTask() {
      const taskInput = document.getElementById("task");
      const categoryInput = document.getElementById("category");
      const dateInput = document.getElementById("date");
      
      const task = {
        description: taskInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        completed: false
      };

      const currentDate = new Date();
  const selectedDate = new Date(task.date);
  if (selectedDate < currentDate) {
    alert("Please select a future date for the task.");
    return; 
  }

      
      taskList.push(task);
      taskInput.value = "";
      dateInput.value = "";
    
      displayTasks();
      saveTasksToLocalStorage();
    }
    
    function editTask(index, newDescription, newDate, newCompleted) {
      taskList[index].description = newDescription;
      taskList[index].date = newDate;
      taskList[index].completed = newCompleted;
      displayTasks();
      saveTasksToLocalStorage();
    }
    
    function deleteTask(index) {
      taskList.splice(index, 1);
      displayTasks();
      saveTasksToLocalStorage();
    }
    
    function displayTasks(tasksToShow = taskList) {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
    
      tasksToShow.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="editTask(${index}, '${task.description}', '${task.date}', this.checked)">
          <strong>${task.category}</strong> - <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.description}</span> (Due: ${task.date})
          <button onclick="editTask(${index}, prompt('Edit description:', '${task.description}'), prompt('Edit date:', '${task.date}'), ${task.completed})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        `;
        list.appendChild(li);
      });
    }
    
    function sortByDate() {
      taskList.sort((a, b) => new Date(a.date) - new Date(b.date));
      displayTasks();
      saveTasksToLocalStorage();
    }
    
    function sortByCategory() {
      taskList.sort((a, b) => a.category.localeCompare(b.category));
      displayTasks();
      saveTasksToLocalStorage();
    }
    
    function searchTasks() {
      const searchInput = document.getElementById("search").value.toLowerCase();
      const matchingTasks = taskList.filter(task =>
        task.description.toLowerCase().includes(searchInput) ||
        task.category.toLowerCase().includes(searchInput)
      );
      displayTasks(matchingTasks);
    }
    function filterTasks() {
      const filterCategory = document.getElementById("filterCategory").value;
      const filterFromDate = document.getElementById("filterFromDate").value;
      const filterToDate = document.getElementById("filterToDate").value;
      const filterSearch = document.getElementById("filterSearch").value.toLowerCase();
    
      const filteredTasks = taskList.filter(task => {
        const matchesCategory = filterCategory === "All" || task.category === filterCategory;
        const matchesDateRange =
          (!filterFromDate || task.date >= filterFromDate) &&
          (!filterToDate || task.date <= filterToDate);
        const matchesSearch = task.description.toLowerCase().includes(filterSearch);
    
        return matchesCategory && matchesDateRange && matchesSearch;
      });
    
      displayTasks(filteredTasks);
    }
    

function updateClock() {
  const clockElement = document.getElementById("clock");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  clockElement.textContent = timeString;
}


setInterval(updateClock, 1000);


const filterSearchInput = document.getElementById("filterSearch");    
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.trim();
    filterSearchInput.value = spokenText;
    filterTasks();
  };

  const voiceSearchButton = document.getElementById("voiceSearchButton");

  if (voiceSearchButton) {
    voiceSearchButton.addEventListener("click", () => {
      recognition.start();
    });
  }
}

   loadTasksFromLocalStorage();
    