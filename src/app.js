let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const prioritySelect = document.getElementById("prioritySelect");

  const task = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  const priority = parseInt(prioritySelect.value);

  if (task !== "") {
    tasks.push({
      task: task,
      date: date,
      time: time,
      priority: priority,
      isEditing: false,
      isCompleted: false,
    });
    renderTasks();
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    prioritySelect.value = "0";
  }
}

function calculateRemainingTime(date, time) {
  const now = new Date();
  const targetDate = new Date(`${date}T${time}`);

  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) {
    return "หมดเวลาแล้ว";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let remainingTime = "";
  if (days > 0) {
    remainingTime += `${days} วัน `;
  }
  if (hours > 0) {
    remainingTime += `${hours} ชั่วโมง `;
  }
  if (minutes > 0) {
    remainingTime += `${minutes} นาที`;
  }

  return remainingTime;
}

function renderTasks() {
  const taskList = document.querySelector("#taskList tbody");
  taskList.innerHTML = "";

  tasks.sort((a, b) => {
    return a.priority - b.priority;
  });

  tasks.forEach((task, index) => {
    const tr = document.createElement("tr");
    tr.id = `task-${index}`;

    const taskTd = document.createElement("td");
    taskTd.className = "task-cell";
    taskTd.textContent = task.task;

    const dateTd = document.createElement("td");
    dateTd.className = "date-cell";
    dateTd.textContent = task.date;

    const timeTd = document.createElement("td");
    timeTd.className = "time-cell";
    timeTd.textContent = task.time;

    const priorityTd = document.createElement("td");
    priorityTd.className = "priority-cell";
    priorityTd.textContent = getPriorityLabel(task.priority);

    const countdownTd = document.createElement("td");
    countdownTd.className = "countdown-cell";
    countdownTd.textContent = calculateRemainingTime(task.date, task.time);

    if (task.priority === 0) {
      priorityTd.classList.add("priority-low");
    } else if (task.priority === 1) {
      priorityTd.classList.add("priority-medium");
    } else if (task.priority === 2) {
      priorityTd.classList.add("priority-high");
    }

    const actionsTd = document.createElement("td");
    actionsTd.className = "actions-cell";
    actionsTd.innerHTML = `<button class="btn btn-primary btn-sm" onclick="editTask(${index})">แก้ไข</button>
                           <button class="btn btn-danger btn-sm ms-1" onclick="deleteTask(${index})">ลบ</button>
                           <button class="btn btn-success btn-sm ms-2" onclick="completeTask(${index})">เสร็จสิ้น</button>`;

    tr.appendChild(taskTd);
    tr.appendChild(dateTd);
    tr.appendChild(timeTd);
    tr.appendChild(priorityTd);
    tr.appendChild(countdownTd);
    tr.appendChild(actionsTd);

    taskList.appendChild(tr);
  });
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 0:
      return "ไม่ค่อยสำคัญ";
    case 1:
      return "สำคัญ";
    case 2:
      return "สำคัญมาก";
    default:
      return "";
  }
}

function completeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.className = "form-control form-control-sm";
  taskInput.value = task.task;
  taskInput.addEventListener("change", (event) => {
    task.task = event.target.value;
  });

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "form-control form-control-sm";
  dateInput.value = task.date;
  dateInput.addEventListener("change", (event) => {
    task.date = event.target.value;
  });

  const timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.className = "form-control form-control-sm";
  timeInput.value = task.time;
  timeInput.addEventListener("change", (event) => {
    task.time = event.target.value;
  });

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "form-select form-select-sm";
  prioritySelect.addEventListener("change", (event) => {
    task.priority = parseInt(event.target.value);
  });

  const priorities = [
    { value: 0, label: "ไม่ค่อยสำคัญ" },
    { value: 1, label: "สำคัญ" },
    { value: 2, label: "สำคัญมาก" },
  ];

  priorities.forEach((priorityOption) => {
    const option = document.createElement("option");
    option.value = priorityOption.value;
    option.textContent = priorityOption.label;

    if (task.priority === priorityOption.value) {
      option.selected = true;
    }

    prioritySelect.appendChild(option);
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn btn-primary btn-sm";
  confirmBtn.textContent = "ยืนยัน";
  confirmBtn.addEventListener("click", () => {
    toggleEdit(index);
    renderTasks();
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-secondary btn-sm ms-1";
  cancelBtn.textContent = "ยกเลิก";
  cancelBtn.addEventListener("click", () => {
    toggleEdit(index);
    renderTasks();
  });

  const actionsTd = document.createElement("td");
  actionsTd.appendChild(confirmBtn);
  actionsTd.appendChild(cancelBtn);

  const tr = document.getElementById(`task-${index}`);
  const taskTd = tr.querySelector(".task-cell");
  const dateTd = tr.querySelector(".date-cell");
  const timeTd = tr.querySelector(".time-cell");
  const priorityTd = tr.querySelector(".priority-cell");
  const countdownTd = tr.querySelector(".countdown-cell");
  const actionsCell = tr.querySelector(".actions-cell");

  taskTd.innerHTML = "";
  taskTd.appendChild(taskInput);

  dateTd.innerHTML = "";
  dateTd.appendChild(dateInput);

  timeTd.innerHTML = "";
  timeTd.appendChild(timeInput);

  priorityTd.innerHTML = "";
  priorityTd.appendChild(prioritySelect);

  countdownTd.innerHTML = calculateRemainingTime(task.date, task.time);

  actionsCell.innerHTML = "";
  actionsCell.appendChild(actionsTd);
}

function isTaskExpired(date, time) {
  const currentDate = new Date();
  const currentDateTime = new Date(
    currentDate.toDateString() + " " + currentDate.toTimeString().slice(0, 8)
  );

  const taskDateTime = new Date(date + " " + time);

  return taskDateTime < currentDateTime;
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 0:
      return "ไม่ค่อยสำคัญ";
    case 1:
      return "สำคัญ";
    case 2:
      return "สำคัญมาก";
    default:
      return "";
  }
}

function completeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function updateTask(index, newTask) {
  tasks[index].task = newTask;
}

function updateDate(index, newDate) {
  tasks[index].date = newDate;
}

function updateTime(index, newTime) {
  tasks[index].time = newTime;
}

function updatePriority(index, priority) {
  tasks[index].priority = priority;
}

function toggleEdit(index) {
  tasks[index].isEditing = !tasks[index].isEditing;
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].isCompleted = !tasks[index].isCompleted;
  renderTasks();
}

function deleteTask(index) {
  const confirmation = confirm("ยืนยันที่จะลบกิจกรรมนี้หรือไม่");

  if (confirmation) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

const addTaskBtn = document.getElementById("addTaskBtn");
addTaskBtn.addEventListener("click", addTask);

renderTasks();
