// Переменные таймера
let workMinutes = 25;
let breakMinutes = 5;

let currentMode = "work";
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;

let timer = null;


// Запуск после загрузки страницы
window.onload = function () {
    loadSettings();

    initTimerPage();
    initStatsPage();
    initSettingsPage();

    updateMiniStats();
};


// Настройки
function loadSettings() {
    const savedWork = localStorage.getItem("workMinutes");
    const savedBreak = localStorage.getItem("breakMinutes");

    if (savedWork !== null) {
        workMinutes = Number(savedWork);
    }

    if (savedBreak !== null) {
        breakMinutes = Number(savedBreak);
    }

    totalSeconds = workMinutes * 60;
    remainingSeconds = totalSeconds;
}


// Статистика
function getPomodoroCount() {
    const value = localStorage.getItem("pomodoroCount");

    if (value === null) {
        return 0;
    }

    return Number(value);
}


function getFocusMinutes() {
    const value = localStorage.getItem("focusMinutes");

    if (value === null) {
        return 0;
    }

    return Number(value);
}


function saveStats(pomodoroCount, focusMinutes) {
    localStorage.setItem("pomodoroCount", pomodoroCount);
    localStorage.setItem("focusMinutes", focusMinutes);
}


// Страница таймера
function initTimerPage() {
    const timeText = document.getElementById("time");

    if (timeText === null) {
        return;
    }

    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    const workBtn = document.getElementById("workBtn");
    const breakBtn = document.getElementById("breakBtn");

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;

    workBtn.onclick = setWorkMode;
    breakBtn.onclick = setBreakMode;

    setWorkMode();
}


// Обновление интерфейса
function updateTime() {
    const timeText = document.getElementById("time");

    if (timeText === null) {
        return;
    }

    const minutes = Math.floor(remainingSeconds / 60);
    let seconds = remainingSeconds % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timeText.textContent = minutes + ":" + seconds;
}


function updateCircle() {
    const circle = document.getElementById("circle");

    if (circle === null) {
        return;
    }

    const passedSeconds = totalSeconds - remainingSeconds;
    const percent = passedSeconds / totalSeconds;
    const degrees = percent * 360;

    let color = "#ff5c5c";

    if (currentMode === "break") {
        color = "#4dd599";
    }

    circle.style.background =
        "conic-gradient(" + color + " " + degrees + "deg, rgba(255,255,255,0.18) 0deg)";
}


// Подсветка кнопок управления
function setActiveControlButton(activeButtonId) {
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (startBtn === null || pauseBtn === null || resetBtn === null) {
        return;
    }

    startBtn.classList.remove("control-active");
    pauseBtn.classList.remove("control-active");
    resetBtn.classList.remove("control-active");

    const activeButton = document.getElementById(activeButtonId);

    if (activeButton !== null) {
        activeButton.classList.add("control-active");
    }
}


// Управление таймером
function startTimer() {
    const timerStatus = document.getElementById("timerStatus");

    if (timer !== null) {
        return;
    }

    setActiveControlButton("startBtn");

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


function pauseTimer() {
    const timerStatus = document.getElementById("timerStatus");

    clearInterval(timer);
    timer = null;

    setActiveControlButton("pauseBtn");

    if (timerStatus !== null) {
        timerStatus.textContent = "Пауза";
    }
}


function resetTimer() {
    const timerStatus = document.getElementById("timerStatus");

    clearInterval(timer);
    timer = null;

    if (currentMode === "work") {
        totalSeconds = workMinutes * 60;
    } else {
        totalSeconds = breakMinutes * 60;
    }

    remainingSeconds = totalSeconds;

    setActiveControlButton("resetBtn");

    if (timerStatus !== null) {
        timerStatus.textContent = "Сброшено";
    }

    updateTime();
    updateCircle();
}


function finishTimer() {
    clearInterval(timer);
    timer = null;

    if (currentMode === "work") {
        let pomodoroCount = getPomodoroCount();
        let focusMinutes = getFocusMinutes();

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


// Режимы
function setWorkMode() {
    const modeTitle = document.getElementById("modeTitle");
    const timerStatus = document.getElementById("timerStatus");
    const workBtn = document.getElementById("workBtn");
    const breakBtn = document.getElementById("breakBtn");

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

    setActiveControlButton("resetBtn");

    updateTime();
    updateCircle();
}


function setBreakMode() {
    const modeTitle = document.getElementById("modeTitle");
    const timerStatus = document.getElementById("timerStatus");
    const workBtn = document.getElementById("workBtn");
    const breakBtn = document.getElementById("breakBtn");

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

    setActiveControlButton("resetBtn");

    updateTime();
    updateCircle();
}


// Страница статистики
function initStatsPage() {
    const pomodoroCountText = document.getElementById("pomodoroCount");

    if (pomodoroCountText === null) {
        return;
    }

    const resetStatsBtn = document.getElementById("resetStatsBtn");

    updateStatsPage();

    resetStatsBtn.onclick = function () {
        saveStats(0, 0);
        updateStatsPage();
    };
}


function updateStatsPage() {
    const pomodoroCountText = document.getElementById("pomodoroCount");
    const focusMinutesText = document.getElementById("focusMinutes");
    const levelText = document.getElementById("levelText");

    if (pomodoroCountText === null) {
        return;
    }

    const pomodoroCount = getPomodoroCount();
    const focusMinutes = getFocusMinutes();

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


function updateMiniStats() {
    const smallPomodoroCount = document.getElementById("smallPomodoroCount");
    const smallFocusMinutes = document.getElementById("smallFocusMinutes");

    if (smallPomodoroCount === null) {
        return;
    }

    smallPomodoroCount.textContent = getPomodoroCount();
    smallFocusMinutes.textContent = getFocusMinutes();
}


// Страница настроек
function initSettingsPage() {
    const workInput = document.getElementById("workInput");

    if (workInput === null) {
        return;
    }

    const breakInput = document.getElementById("breakInput");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const saveMessage = document.getElementById("saveMessage");

    workInput.value = workMinutes;
    breakInput.value = breakMinutes;

    saveSettingsBtn.onclick = function () {
        const newWorkMinutes = Number(workInput.value);
        const newBreakMinutes = Number(breakInput.value);

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
