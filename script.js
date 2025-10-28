let students = [];
let dayCounter = 0;
let allDays = {};

//Add a new student from Home tab
function addStudent() {
  const input = document.getElementById("studentName");
  const name = input.value.trim();

  if (name === "") {
    alert("Please enter a student name.");
    return;
  }

  students.push({ name, presents: 0, absents: 0 });
  input.value = "";
  renderHomeList();

  //also add them to all existing days
  Object.keys(allDays).forEach(day => {
    const tbody = document.getElementById(`${day}-tbody`);
    const studentList = document.getElementById(`${day}-studentList`);
    if (tbody && studentList) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td><input type="checkbox" onchange="markAttendance('${day}', '${name}', this.checked)"></td>
      `;
      tbody.appendChild(row);

      const li = document.createElement("li");
      li.id = `${name}-totals`;
      li.textContent = `${name} - P: 0, A: 0`;
      studentList.appendChild(li);
    
    }
  
  });
}

function renderHomeList() {
  const ul = document.getElementById("studentListHome");
  ul.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span data-name="${student.name}">${student.name}</span> 
      (<span class="presents">${student.presents}</span> P, 
      <span class="absents">${student.absents}</span> A)
    `;
    ul.appendChild(li);
  });
}


//adds a new day tab
function addDay() {
  if (students.length === 0) {
    alert("Please add atleast one student first.");
    return;
  }

  dayCounter++;
  const dayName = `Day ${dayCounter}`;
  allDays[dayName] = {};

  const dayTabsContainer = document.getElementById("dayTabs");
  const btn = document.createElement("button");
  btn.className = "tab-btn";
  btn.textContent = dayName;
  btn.onclick = () => showDay(dayName);
  dayTabsContainer.appendChild(btn);

  const dayContents = document.getElementById("dayContents");
  const div = document.createElement("div");
  div.id = `${dayName}-content`;
  div.classList.add("day-content");
  div.style.display = "none";
  div.innerHTML = `
    <div class="day-layout">
      <div class="attendance-table">
        <h3>${dayName} Attendance</h3>
        <table>
          <thead>
            <tr><th>Student</th><th>Present?</th></tr>
          </thead>
          <tbody id="${dayName}-tbody"></tbody>
        </table>
      </div>
      <div class="student-list">
        <h3>Totals</h3>
        <ul id="${dayName}-studentList"></ul>
      </div>
    </div>
  `;
  dayContents.appendChild(div);

  populateDayTable(dayName);
}

//Fill each day's table with students
function populateDayTable(dayName) {
  const tbody = document.getElementById(`${dayName}-tbody`);
  const studentList = document.getElementById(`${dayName}-studentList`);
  tbody.innerHTML = "";
  studentList.innerHTML = "";

  students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td><input type="checkbox" onchange="markAttendance('${dayName}', '${student.name}', this.checked)"></td>
    `;
    tbody.appendChild(row);

    const li = document.createElement("li");
    li.id = `${student.name}-totals`;
    li.textContent = `${student.name} - P: ${student.presents}, A: ${student.absents}`;
    studentList.appendChild(li);
  });

}

//Mark attendance
function markAttendance(dayName, studentName, isPresent) {
  // Initialize the day record if not existing
  if (!allDays[dayName]) allDays[dayName] = {};

  const student = students.find(s => s.name === studentName);
  const previousStatus = allDays[dayName][studentName]; //present or pbsent

  //nly update if the status changed
  if (previousStatus !== (isPresent ? "Present" : "Absent")) {
    //Adjust totals if previously marked
    if (previousStatus === "Present") student.presents--;
    else if (previousStatus === "Absent") student.absents--;

    //Apply new mark
    if (isPresent) student.presents++;
    else student.absents++;

    //saves the new state
    allDays[dayName][studentName] = isPresent ? "Present" : "Absent";

    //Updates the day’s right-side list
    const li = document.getElementById(`${student.name}-totals`);
    if (li) li.textContent = `${student.name} - P: ${student.presents}, A: ${student.absents}`;

    //Updates the Home tab list
    function markAttendance(dayName, studentName, isPresent) {
      if (!allDays[dayName]) allDays[dayName] = {};
    
      const student = students.find(s => s.name === studentName);
      const previousStatus = allDays[dayName][studentName];
    
      if (previousStatus !== (isPresent ? "Present" : "Absent")) {
        if (previousStatus === "Present") student.presents--;
        else if (previousStatus === "Absent") student.absents--;
    
        if (isPresent) student.presents++;
        else student.absents++;
    
        allDays[dayName][studentName] = isPresent ? "Present" : "Absent";
    
        //update the day's right-side list - Bug Fixed
        const li = document.getElementById(`${student.name}-totals`);
        if (li) li.textContent = `${student.name} - P: ${student.presents}, A: ${student.absents}`;
    
        //update the Home tab list - di pa ma ayos walang oras inaantok dubas
        const homeListItems = document.querySelectorAll("#studentListHome li");
        homeListItems.forEach(li => {
          if (li.textContent.includes(student.name)) {
            li.querySelector(".presents").textContent = student.presents;
            li.querySelector(".absents").textContent = student.absents;
          }
        });
      }
    }
    
    if (homeLi) {
      homeLi.querySelector(".presents").textContent = student.presents;
      homeLi.querySelector(".absents").textContent = student.absents;
    } else {
      //fallback if structure changed
      renderHomeList();   
    }
  
  }
}



//Switch tabs
function showHome() {
  document.getElementById("homeContent").style.display = "block";
  document.querySelectorAll(".day-content").forEach(div => div.style.display = "none");
  setActiveTab("homeTab");
}

function showDay(dayName) {
  document.getElementById("homeContent").style.display = "none";
  document.querySelectorAll(".day-content").forEach(div => div.style.display = "none");
  document.getElementById(`${dayName}-content`).style.display = "block";
  setActiveTabByName(dayName);
}

//Handle active tab state
function setActiveTab(id) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setActiveTabByName(dayName) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === dayName) btn.classList.add("active");
  });
}

//Reset
function resetAll() {
  const confirmReset = confirm("⚠️ Are you sure you want to reset everything?");
  if (!confirmReset) return;
  document.getElementById("dayTabs").innerHTML = "";
  document.getElementById("dayContents").innerHTML = "";
  document.getElementById("studentListHome").innerHTML = "";
  students = [];
  allDays = {};
  dayCounter = 0;
  showHome();
  alert("All data has been reset.");
}
