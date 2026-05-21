// Главные переменные таймера
var workMinutes = 25;
var breakMinutes = 5;

var currentMode = "work";
var totalSeconds = 25 * 60;
var remainingSeconds = totalSeconds;

var timer = null;


// Когда страница загрузилась, запускаем нужные функции
window.onload = function () {
    loadSettings();

    initTimerPage();
    initStatsPage();
    initSettingsPage();

    updateMiniStats();
};


// Загрузка настроек из браузера
function loadSettings() {
    var savedWork = localStorage.getItem("workMinutes");
    var savedBreak = localStorage.getItem("breakMinutes");

    if (savedWork !== null) {
        workMinutes = Number(savedWork);
    }

    if (savedBreak !== null) {
        breakMinutes = Number(savedBreak);
    }

    totalSeconds = workMinutes * 60;
    remainingSeconds = totalSeconds;
}


// Получение количества завершённых Pomodoro
function getPomodoroCount() {
    var value = localStorage.getItem("pomodoroCount");

    if (value === null) {
        return 0;
    }

    return Number(value);
}


// Получение количества минут фокуса
function getFocusMinutes() {
    var value = localStorage.getItem("focusMinutes");

    if (value === null) {
        return 0;
    }

    return Number(value);
}


// Сохранение статистики
function saveStats(pomodoroCount, focusMinutes) {
    localStorage.setItem("pomodoroCount", pomodoroCount);
    localStorage.setItem("focusMinutes", focusMinutes);
}


// Инициализация страницы таймера
function initTimerPage() {
    var timeText = document.getElementById("time");

    // Если элемента time нет, значит это не страница таймера
    if (timeText === null) {
        return;
    }

    var startBtn = document.getElementById("startBtn");
    var pauseBtn = document.getElementById("pauseBtn");
    var resetBtn = document.getElementById("resetBtn");

    var workBtn = document.getElementById("workBtn");
    var breakBtn = document.getElementById("breakBtn");

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;

    workBtn.onclick = setWorkMode;
    breakBtn.onclick = setBreakMode;

    setWorkMode();
}


// Обновление времени на экране
function updateTime() {
    var timeText = document.getElementById("time");

    if (timeText === null) {
        return;
    }

    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timeText.textContent = minutes + ":" + seconds;
}


// Обновление визуального круга
function updateCircle() {
    var circle = document.getElementById("circle");

    if (circle === null) {
        return;
    }

    var passedSeconds = totalSeconds - remainingSeconds;
    var percent = passedSeconds / totalSeconds;
    var degrees = percent * 360;

    var color = "#ff5c5c";

    if (currentMode === "break") {
        color = "#4dd599";
    }

    circle.style.background =
        "conic-gradient(" + color + " " + degrees + "deg, rgba(255,255,255,0.18) 0deg)";
}


// Запуск таймера
function startTimer() {
    var timerStatus = document.getElementById("timerStatus");

    if (timer !== null) {
        return;
    }

    if (timerStatus !== null) {
        timerStatus.textContent = "Таймер работает";
    }

    timer = setInterval(function () {
        if (remainingSeconds > 0) {
            remainingSeconds = remainingSeconds - 1;

            updateTime();
            updateCircle();
        } else {
            finishTimer();
        }
    }, 1000);
}


// Пауза таймера
function pauseTimer() {
    var timerStatus = document.getElementById("timerStatus");

    clearInterval(timer);
    timer = null;

    if (timerStatus !== null) {
        timerStatus.textContent = "Пауза";
    }
}


// Сброс таймера
function resetTimer() {
    var timerStatus = document.getElementById("timerStatus");

    clearInterval(timer);
    timer = null;

    if (currentMode === "work") {
        totalSeconds = workMinutes * 60;
    } else {
        totalSeconds = breakMinutes * 60;
    }

    remainingSeconds = totalSeconds;

    if (timerStatus !== null) {
        timerStatus.textContent = "Сброшено";
    }

    updateTime();
    updateCircle();
}


// Завершение таймера
function finishTimer() {
    clearInterval(timer);
    timer = null;

    if (currentMode === "work") {
        var pomodoroCount = getPomodoroCount();
        var focusMinutes = getFocusMinutes();

        pomodoroCount = pomodoroCount + 1;
        focusMinutes = focusMinutes + workMinutes;

        saveStats(pomodoroCount, focusMinutes);
        updateMiniStats();

        alert("Рабочий интервал завершён! Пора сделать перерыв.");

        setBreakMode();
    } else {
        alert("Перерыв завершён! Можно снова работать.");

        setWorkMode();
    }
}


// Режим работы
function setWorkMode() {
    var modeTitle = document.getElementById("modeTitle");
    var timerStatus = document.getElementById("timerStatus");
    var workBtn = document.getElementById("workBtn");
    var breakBtn = document.getElementById("breakBtn");

    clearInterval(timer);
    timer = null;

    currentMode = "work";
    totalSeconds = workMinutes * 60;
    remainingSeconds = totalSeconds;

    if (modeTitle !== null) {
        modeTitle.textContent = "Работа";
    }

    if (timerStatus !== null) {
        timerStatus.textContent = "Готов к старту";
    }

    if (workBtn !== null && breakBtn !== null) {
        workBtn.classList.add("active");
        breakBtn.classList.remove("active");
    }

    updateTime();
    updateCircle();
}


// Режим перерыва
function setBreakMode() {
    var modeTitle = document.getElementById("modeTitle");
    var timerStatus = document.getElementById("timerStatus");
    var workBtn = document.getElementById("workBtn");
    var breakBtn = document.getElementById("breakBtn");

    clearInterval(timer);
    timer = null;

    currentMode = "break";
    totalSeconds = breakMinutes * 60;
    remainingSeconds = totalSeconds;

    if (modeTitle !== null) {
        modeTitle.textContent = "Перерыв";
    }

    if (timerStatus !== null) {
        timerStatus.textContent = "Время отдохнуть";
    }

    if (workBtn !== null && breakBtn !== null) {
        breakBtn.classList.add("active");
        workBtn.classList.remove("active");
    }

    updateTime();
    updateCircle();
}


// Инициализация страницы статистики
function initStatsPage() {
    var pomodoroCountText = document.getElementById("pomodoroCount");

    // Если такого элемента нет, значит это не страница статистики
    if (pomodoroCountText === null) {
        return;
    }

    var resetStatsBtn = document.getElementById("resetStatsBtn");

    updateStatsPage();

    resetStatsBtn.onclick = function () {
        saveStats(0, 0);
        updateStatsPage();
    };
}


// Обновление страницы статистики
function updateStatsPage() {
    var pomodoroCountText = document.getElementById("pomodoroCount");
    var focusMinutesText = document.getElementById("focusMinutes");
    var levelText = document.getElementById("levelText");

    if (pomodoroCountText === null) {
        return;
    }

    var pomodoroCount = getPomodoroCount();
    var focusMinutes = getFocusMinutes();

    pomodoroCountText.textContent = pomodoroCount;
    focusMinutesText.textContent = focusMinutes;

    if (pomodoroCount < 3) {
        levelText.textContent = "Новичок";
    } else if (pomodoroCount < 7) {
        levelText.textContent = "Активный";
    } else {
        levelText.textContent = "Профи";
    }
}


// Мини-статистика на главной странице
function updateMiniStats() {
    var smallPomodoroCount = document.getElementById("smallPomodoroCount");
    var smallFocusMinutes = document.getElementById("smallFocusMinutes");

    if (smallPomodoroCount === null) {
        return;
    }

    smallPomodoroCount.textContent = getPomodoroCount();
    smallFocusMinutes.textContent = getFocusMinutes();
}


// Инициализация страницы настроек
function initSettingsPage() {
    var workInput = document.getElementById("workInput");

    // Если такого элемента нет, значит это не страница настроек
    if (workInput === null) {
        return;
    }

    var breakInput = document.getElementById("breakInput");
    var saveSettingsBtn = document.getElementById("saveSettingsBtn");
    var saveMessage = document.getElementById("saveMessage");

    workInput.value = workMinutes;
    breakInput.value = breakMinutes;

    saveSettingsBtn.onclick = function () {
        var newWorkMinutes = Number(workInput.value);
        var newBreakMinutes = Number(breakInput.value);

        if (newWorkMinutes > 0 && newBreakMinutes > 0) {
            localStorage.setItem("workMinutes", newWorkMinutes);
            localStorage.setItem("breakMinutes", newBreakMinutes);

            workMinutes = newWorkMinutes;
            breakMinutes = newBreakMinutes;

            saveMessage.textContent = "Настройки успешно сохранены!";
        } else {
            saveMessage.textContent = "Введите числа больше 0.";
        }
    };
}