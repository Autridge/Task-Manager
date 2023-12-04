document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById("taskList");
  const addTaskBtn = document.querySelector(".container--btn");
  const modal = document.querySelector(".task_list-modal");
  const closeModalBtn = document.querySelector(".task_list-modal .close");
  const submitBtn = document.getElementById("submitBtn");
  const taskInput = document.getElementById("taskInput");
  const tagInput = document.getElementById("tagInput");

  // Function to create a new task item
  function createTaskItem(taskName, tagName) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const taskText = document.createTextNode(` ${taskName}`);

    const tagSpan = document.createElement("span");
    tagSpan.classList.add("tag-type", tagName.toLowerCase(), "u-margin-sm");
    tagSpan.innerHTML = `<i class="bi bi-circle-fill"></i>${tagName}`;

    const iconContainer = document.createElement("span");
    iconContainer.classList.add("u-margin-sm");
    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square");
    const starIcon = document.createElement("i");
    starIcon.classList.add("bi", "bi-star-fill");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash3-fill");

    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(starIcon);
    iconContainer.appendChild(deleteIcon);

    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(tagSpan);
    listItem.appendChild(iconContainer);

    return listItem;
  }

  // Function to add a task
  function addTask() {
    const taskName = taskInput.value.trim();
    const tagName = tagInput.value;

    if (taskName !== "") {
      const newTaskItem = createTaskItem(taskName, tagName);
      taskList.prepend(newTaskItem);
      taskInput.value = "";
      tagInput.value = "Normal"; // Reset tag input to default value
      saveTasks(); // Save tasks to localStorage after adding a task
      closeModal(); // Close the modal after adding the task
    } else {
      alert("Please enter a task!");
    }
  }

  // Function to delete a task
  function deleteTask(taskItem) {
    taskList.removeChild(taskItem);
    saveTasks(); // Save tasks to localStorage after deleting a task
  }

  // Function to mark task as important
  function markAsImportant(taskItem) {
    taskItem.classList.toggle("important");
    rearrangeTasks();
    saveTasks(); // Save tasks to localStorage after marking as important
  }

  // Function to edit a task
  function editTask(taskItem) {
    const taskText = taskItem.childNodes[1];
    const newText = prompt("Edit the task:", taskText.textContent.trim());
    if (newText !== null) {
      taskText.textContent = ` ${newText}`;
      saveTasks(); // Save tasks to localStorage after editing a task
    }
  }

  // Function to rearrange tasks
  function rearrangeTasks() {
    const importantTasks = Array.from(taskList.querySelectorAll(".important"));
    importantTasks.forEach((task) => taskList.prepend(task));
  }

  // Function to open modal
  function openModal() {
    modal.classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
  }

  // Function to close modal
  function closeModal() {
    modal.classList.add("hidden");
    document.querySelector(".overlay").classList.add("hidden");
  }

  // Event listener for opening modal
  addTaskBtn.addEventListener("click", openModal);

  // Event listener for closing modal with close button
  closeModalBtn.addEventListener("click", closeModal);

  // Event listener for adding task
  submitBtn.addEventListener("click", addTask);

  // Event delegation for deleting task
  taskList.addEventListener("click", function (event) {
    if (event.target.classList.contains("bi-trash3-fill")) {
      const taskItem = event.target.closest("li");
      deleteTask(taskItem);
    }
  });

  // Event delegation for marking task as important
  taskList.addEventListener("click", function (event) {
    if (event.target.classList.contains("bi-star-fill")) {
      const taskItem = event.target.closest("li");
      markAsImportant(taskItem);
    }
  });

  // Event delegation for editing task
  taskList.addEventListener("click", function (event) {
    if (event.target.classList.contains("bi-pencil-square")) {
      const taskItem = event.target.closest("li");
      editTask(taskItem);
    }
  });

  // Function to save tasks to localStorage
  function saveTasks() {
    const tasks = Array.from(taskList.children).map((task) => task.innerHTML);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to load tasks from localStorage when the page loads
  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      taskList.innerHTML = ""; // Clear the task list before appending tasks
      storedTasks.forEach((taskHTML) => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = taskHTML;
        if (taskItem.textContent.trim().length > 0) {
          taskList.appendChild(taskItem);
        }
      });
    }
  }

  // Load tasks from localStorage when the page loads
  loadTasks();
});
