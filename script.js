const subjects = [
  "Operating System",
  "Web Development",
  "Verbal Ability",
  "Minor Project",
  "Data Structure"
];

const subjectGuides = {
  "Operating System":{
    guide:"Study CPU scheduling, deadlocks, paging, segmentation.",
    video:"https://www.youtube.com/watch?v=26QPDBe-NB8",
    teacher:"9876543210"
  },
  "Web Development":{
    guide:"Practice HTML, CSS, JavaScript projects daily.",
    video:"https://www.youtube.com/watch?v=UB1O30fR-EE",
    teacher:"9876543211"
  },
  "Verbal Ability":{
    guide:"Improve vocabulary and grammar practice.",
    video:"https://www.youtube.com/watch?v=5MgBikgcWnY",
    teacher:"9876543212"
  },
  "Minor Project":{
    guide:"Improve documentation and add advanced features.",
    video:"https://www.youtube.com/watch?v=1Rs2ND1ryYc",
    teacher:"9876543213"
  },
  "Data Structure":{
    guide:"Practice sorting, stack, queue, linked list.",
    video:"https://www.youtube.com/watch?v=8hly31xKli0",
    teacher:"9876543214"
  }
};

let students = [
  {
    name:"Rishi Raj",
    roll:"DS101",
    batch:"2025",
    marks:[80,35,65,50,30],
    attendance:[78,60,85,90,70]
  }
];

let currentStudent = students[0];
let marksChart, attendanceChart;

/* LOGIN */
function login(){
  loginPage.classList.add("hidden");

  if(role.value==="Student"){
    studentDashboard.classList.remove("hidden");
    loadStudent(currentStudent);
  }
  else if(role.value==="Parent"){
    parentDashboard.classList.remove("hidden");
    loadParent(currentStudent);
  }
  else{
    teacherDashboard.classList.remove("hidden");
    loadTeacher();
  }
}

function logout(){ location.reload(); }

/* LOAD STUDENT */
function loadStudent(s){

  marksSection.innerHTML = subjects.map((sub,i)=>{
    let red = s.marks[i]<40 ? "danger":"";
    return `<div class="subject-box">
      ${sub}<br>
      <span class="${red}">${s.marks[i]}</span>
    </div>`;
  }).join("");

  attendanceSection.innerHTML = subjects.map((sub,i)=>{
    let red = s.attendance[i]<75 ? "danger":"";
    return `<div class="subject-box">
      ${sub}<br>
      <span class="${red}">${s.attendance[i]}%</span>
    </div>`;
  }).join("");

  guideBox.innerHTML = generateGuide();

  if(marksChart) marksChart.destroy();
  marksChart = new Chart(document.getElementById("marksChart"),{
    type:"bar",
    data:{labels:subjects,
      datasets:[{label:"Marks",data:s.marks,backgroundColor:"#6c5ce7"}]}
  });

  if(attendanceChart) attendanceChart.destroy();
  attendanceChart = new Chart(document.getElementById("attendanceChart"),{
    type:"bar",
    data:{labels:subjects,
      datasets:[{label:"Attendance",data:s.attendance,backgroundColor:"#00cec9"}]}
  });

  showSection("marks",document.querySelector(".tabBtn"));
}

/* PARENT */
function loadParent(s){
  parentContent.innerHTML = `
    <h3>${s.name}</h3>
    <p>Roll: ${s.roll}</p>
    <div class="card">
      ${subjects.map((sub,i)=>
        `<p>${sub} : ${s.marks[i]} | Attendance: ${s.attendance[i]}%</p>`
      ).join("")}
    </div>`;
}

/* GUIDE */
function generateGuide(){
  return `<h3>Subject Improvement Guide</h3>
  <div class="grid-box">
    ${subjects.map(sub=>
      `<div class="subject-box" onclick="showGuide('${sub}')">
        ${sub}<br>Click for guide
      </div>`
    ).join("")}
  </div>`;
}

function showGuide(sub){
  let g = subjectGuides[sub];
  guideBox.innerHTML = `
    <h3>${sub}</h3>
    <p>${g.guide}</p>
    <p><a href="${g.video}" target="_blank">Watch YouTube Video</a></p>
    <p>Teacher Contact: ${g.teacher}</p>
    <button onclick="loadStudent(currentStudent)">Back</button>
  `;
}

/* TEACHER */
function loadTeacher(){
  let tb = studentsTable.querySelector("tbody");
  tb.innerHTML="";

  let total = students.length;
  let totalMarks = 0;
  let totalAttendance = 0;
  let riskCount = 0;

  students.forEach((s,index)=>{
    let avgM = Math.round(s.marks.reduce((a,b)=>a+b)/s.marks.length);
    let avgA = Math.round(s.attendance.reduce((a,b)=>a+b)/s.attendance.length);

    totalMarks += avgM;
    totalAttendance += avgA;

    let isRisk = (avgM<40 || avgA<70);
    if(isRisk) riskCount++;

    tb.innerHTML+=`
      <tr>
        <td>${s.name}</td>
        <td>${s.roll}</td>
        <td>${s.batch}</td>
        <td>${avgM}%</td>
        <td>${avgA}%</td>
        <td>
          <span class="${isRisk ? "status-danger" : "status-safe"}">
            ${isRisk ? "At Risk" : "Safe"}
          </span>
        </td>
        <td>
          <button onclick="viewStudent(${index})" class="view-btn">View</button>
          <button onclick="editStudent(${index})" class="edit-btn">Edit</button>
          <button onclick="deleteStudent(${index})" class="delete-btn">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("totalStudents").innerText = total;
  document.getElementById("overallMarks").innerText =
    total ? Math.round(totalMarks/total) + "%" : "0%";
  document.getElementById("overallAttendance").innerText =
    total ? Math.round(totalAttendance/total) + "%" : "0%";
  document.getElementById("atRisk").innerText = riskCount;
}
function viewStudent(index){
  let s = students[index];

  alert(
    "Name: " + s.name +
    "\nRoll: " + s.roll +
    "\nBatch: " + s.batch +
    "\nMarks: " + s.marks.join(", ") +
    "\nAttendance: " + s.attendance.join(", ")
  );
}
function editStudent(index){
  let s = students[index];

  let newName = prompt("Edit Name:", s.name);
  if(newName===null) return;

  let newBatch = prompt("Edit Batch:", s.batch);
  if(newBatch===null) return;

  s.name = newName;
  s.batch = newBatch;

  loadTeacher();
}
function deleteStudent(index){
  if(confirm("Are you sure you want to delete this student?")){
    students.splice(index,1);
    loadTeacher();
  }
}
document.querySelector(".add-btn").addEventListener("click",function(){

  let name = prompt("Enter Student Name:");
  if(!name) return;

  let roll = prompt("Enter Roll Number:");
  if(!roll) return;

  let batch = prompt("Enter Batch:");
  if(!batch) return;

  let newStudent = {
    name:name,
    roll:roll,
    batch:batch,
    marks:[50,50,50,50,50],
    attendance:[75,75,75,75,75]
  };

  students.push(newStudent);
  loadTeacher();
});
document.querySelector(".export-btn").addEventListener("click",function(){

  let dataStr = JSON.stringify(students, null, 2);

  let blob = new Blob([dataStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "students_data.json";
  a.click();

  URL.revokeObjectURL(url);
});
document.querySelector(".search-add input")
.addEventListener("input", function(){

  let value = this.value.toLowerCase();
  let rows = studentsTable.querySelectorAll("tbody tr");

  rows.forEach(row=>{
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(value) ? "" : "none";
  });
});



/* TABS */
function showSection(sec,btn){
  document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  marksArea.classList.add("hidden");
  attendanceArea.classList.add("hidden");
  if(sec==="marks") marksArea.classList.remove("hidden");
  if(sec==="attendance") attendanceArea.classList.remove("hidden");
}
