document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const courseInput = document.getElementById('course-input');
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
  
    // Load saved tasks from storage
    chrome.storage.sync.get(['tasks'], (result) => {
      const tasks = result.tasks || {};
      renderTasks(tasks);
    });
  
    // Add task button click event
    addTaskButton.addEventListener('click', () => {
      const course = courseInput.value.trim();
      const task = taskInput.value.trim();
  
      if (course && task) {
        chrome.storage.sync.get(['tasks'], (result) => {
          const tasks = result.tasks || {};
          if (!tasks[course]) {
            tasks[course] = [];
          }
          tasks[course].push({ text: task, completed: false });
          chrome.storage.sync.set({ tasks }, () => {
            renderTasks(tasks);
            courseInput.value = '';
            taskInput.value = '';
          });
        });
      }
    });
  
    // Render tasks
    function renderTasks(tasks) {
      courseList.innerHTML = '';
      for (const course in tasks) {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course';
        courseDiv.innerHTML = `<div class="course-title">${course}</div>`;
        tasks[course].forEach((task, index) => {
          const taskDiv = document.createElement('div');
          taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
          taskDiv.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-course="${course}" data-index="${index}">
            ${task.text}
          `;
          courseDiv.appendChild(taskDiv);
        });
        courseList.appendChild(courseDiv);
      }
  
      // Add event listeners to checkboxes
      const checkboxes = document.querySelectorAll('.task input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
          const course = event.target.dataset.course;
          const index = event.target.dataset.index;
          chrome.storage.sync.get(['tasks'], (result) => {
            const tasks = result.tasks;
            tasks[course][index].completed = event.target.checked;
            chrome.storage.sync.set({ tasks }, () => {
              renderTasks(tasks);
            });
          });
        });
      });
    }
  });