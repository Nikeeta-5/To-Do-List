/*  
    Created by Nikeeta Malik  
    GitHub: https://github.com/Nikeeta-5  
    © 2025 Nikeeta Malik. All rights reserved.  
*/
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadTasks(); 
    initializeStarAnimation();
}

function setupEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', () => addTask()); 
    document.getElementById('inputTask').addEventListener('keydown', (event) => {
        if (event.key === "Enter") addTask();
    });

    setupDragAndDrop();
}

function addTask(taskText = "", completed = false) {
    const taskInput = document.getElementById('inputTask');
    if (!taskText) taskText = taskInput.value.trim();

    if (taskText === "") {
        return showToast("Please enter a task!");
    }

    const existingTasks = Array.from(document.querySelectorAll('.task-text'))
        .map(span => span.textContent.toLowerCase());
    if (existingTasks.includes(taskText.toLowerCase())) {
        return alert("Task already exists!");
    }

    const newTask = document.createElement('li');
    newTask.draggable = true;
    newTask.classList.add("task-item");
    if (completed) newTask.classList.add('completed');

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = taskText;
    newTask.appendChild(taskSpan);


   newTask.addEventListener('click', () => {
        newTask.classList.toggle('completed');
       saveTasks();
   });
   

    newTask.appendChild(createButton("Edit", "editBtn", (event) => editTask(newTask, taskSpan, event)));
    newTask.appendChild(createButton("Delete", "deleteBtn", () => {
        newTask.remove();
        saveTasks();
    }));

    document.getElementById('TaskList').appendChild(newTask);
    taskInput.value = "";
    taskInput.focus();
    saveTasks();
}

function editTask(task, taskSpan, event) {
    event.stopPropagation(); 

    let updatedText = prompt("Edit your task:", taskSpan.textContent);
    if (updatedText === null || updatedText.trim() === "") return; 

    taskSpan.textContent = updatedText.trim();
    saveTasks();
}

function createButton(text, className, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add(className);
    btn.onclick = onClick;
    return btn;
}

function saveTasks() {
    const tasks = Array.from(document.querySelectorAll('#TaskList li')).map(task => ({
        text: task.querySelector('.task-text').textContent,
        completed: task.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
    storedTasks.forEach(taskData => {
        if (taskData.text) addTask(taskData.text, taskData.completed);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show-toast');
    setTimeout(() => toast.classList.remove('show-toast'), 2000);
}

function initializeStarAnimation() {
    const starContainer = document.createElement("div");
    starContainer.id = "stars";
    document.body.appendChild(starContainer);

    const shootingContainer = document.createElement("div");
    shootingContainer.id = "shootingStars";
    document.body.appendChild(shootingContainer);

    function createStar() {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.animationDuration = Math.random() * 3 + 2 + "s"; 
        starContainer.appendChild(star);
    }

    function createShootingStar() {
        const shootingStar = document.createElement("div");
        shootingStar.classList.add("shooting-star");
        shootingStar.style.left = Math.random() * window.innerWidth + "px";
        shootingStar.style.top = Math.random() * window.innerHeight / 2 + "px";
        shootingContainer.appendChild(shootingStar);
        setTimeout(() => shootingStar.remove(), 2000);
    }

    for (let i = 0; i < 100; i++) createStar(); 
    setInterval(createShootingStar, 4000);
}

function setupDragAndDrop() {
    const taskList = document.getElementById("TaskList");

    taskList.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("task-item")) {
            e.target.classList.add("dragging");
        }
    });

    taskList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(dragging);
        } else {
            taskList.insertBefore(dragging, afterElement);
        }
    });

    taskList.addEventListener("dragend", () => {
        document.querySelector(".dragging")?.classList.remove("dragging");
        saveTasks(); 
    });
}

function getDragAfterElement(container, y) {
    const tasks = [...container.querySelectorAll(".task-item:not(.dragging)")];
    return tasks.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
