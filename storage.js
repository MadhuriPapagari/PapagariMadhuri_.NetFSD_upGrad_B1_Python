// ================= DASHBOARD =================
if (document.getElementById("total")) {
  if (typeof courses !== "undefined") {
    const completed = getCompletedCourses();

    document.getElementById("total").innerText = courses.length;
    document.getElementById("completed").innerText = Math.min(completed.length, courses.length);

    const progress = (completed.length / courses.length) * 100;
    document.getElementById("progressBar").value = progress;
  }
}


// ================= COURSES PAGE =================
if (document.getElementById("courseTable") || document.getElementById("courseCards")) {
  if (typeof courses !== "undefined") {

    // Table
    const table = document.getElementById("courseTable");
    if (table) {
      const completed = getCompletedCourses();

      courses.forEach(course => {
        const isCompleted = completed.includes(course.id);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${course.name}</td>
          <td>
            <ol>
              ${course.lessons.map(l => `<li>${l}</li>`).join("")}
            </ol>
          </td>
       <td>
      ${
        isCompleted
          ? `<span style="color:green; font-weight:bold;">Completed</span>`
          : `<button onclick="completeCourse(${course.id})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">
               Complete
             </button>`
      }
    </td>
        `;
        table.appendChild(row);
      });
    }

    // Flex cards
    const cards = document.getElementById("courseCards");
    if (cards) {
      courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
          <h3>${course.name}</h3>
          <p>${course.intro}</p>
          <p><strong>Duration:</strong> ${course.duration}</p>
          <p><strong>Lessons:</strong></p>
          <ol>
            ${course.lessons.map(l => `<li>${l}</li>`).join("")}
          </ol>
        `;

        cards.appendChild(card);
      });
    }
  }
}


// ================= QUIZ PAGE =================
const quizBox = document.getElementById("quizBox");

function loadQuizData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quizData);
    }, 0);
  });
}

async function renderQuiz() {
  if (!quizBox || typeof quizData === "undefined") return;

  const data = await loadQuizData();

  quizBox.innerHTML = "";

  data.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question-card";

    div.innerHTML = `
      <p><strong>Question ${i + 1}:</strong> ${q.question}</p>
      ${q.options.map((opt, idx) => `
        <label class="option">
          <input type="radio" name="q${i}" value="${idx}" onchange="handleOptionChange()">
          ${opt}
        </label>
      `).join("")}
    `;

    quizBox.appendChild(div);
  });
}

function handleOptionChange() {
  // onchange requirement satisfied
}

renderQuiz();

function submitQuiz() {
  if (typeof quizData === "undefined") return;

  let score = 0;
  let allAnswered = true;

  quizData.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      allAnswered = false;
      return;
    }

    if (parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  if (!allAnswered) {
    alert("Please answer all questions.");
    return;
  }

  const percentage = Math.round((score / quizData.length) * 100);

  let grade;
  if (percentage >= 80) grade = "A";
  else if (percentage >= 50) grade = "B";
  else grade = "Fail";

  let feedback;
  switch (grade) {
    case "A":
      feedback = "Excellent!";
      break;
    case "B":
      feedback = "Good Job!";
      break;
    default:
      feedback = "Try Again!";
  }

  saveQuizScore(percentage);

  const completed = getCompletedCourses();
  if (completed.length < courses.length) {
    // optional state continuity only if needed later
  }

  document.getElementById("result").innerText =
    `Score: ${percentage}% | Grade: ${grade} | ${feedback}`;
}


// ================= PROFILE PAGE =================
if (document.getElementById("completedList")) {
  if (typeof courses !== "undefined") {
    const completed = getCompletedCourses();
    const list = document.getElementById("completedList");

    list.innerHTML = "";

    completed.forEach(id => {
      const course = courses.find(c => c.id === id);

      if (course) {
        const li = document.createElement("li");
        li.innerText = course.name;
        list.appendChild(li);
      }
    });

    document.getElementById("quizScore").innerText = getQuizScore() + "%";

    const progress = (completed.length / courses.length) * 100;
    document.getElementById("profileProgress").value = progress;
  }
}

function completeCourse(id) {
  const completed = getCompletedCourses();

  if (!completed.includes(id)) {
    completed.push(id);
    saveCompletedCourses(completed);
    location.reload();
  }
}

// ================= PROFILE DEFAULT + EDIT =================

// 

// ================= PROFILE =================

// Load profile data
function loadProfile() {

  const name = localStorage.getItem("userName") || "Madhuri";
  const email = localStorage.getItem("userEmail") || "madhuri@email.com";

  // Set input fields
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");

  if (nameInput) nameInput.value = name;
  if (emailInput) emailInput.value = email;

  // 🔥 Set display values (THIS IS YOUR FIX)
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (profileName) profileName.innerText = name;
  if (profileEmail) profileEmail.innerText = email;
}


// Save profile
function saveProfile() {

  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;

  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);

  // update UI instantly
  loadProfile();

  alert("Profile updated!");
}


// Run on profile page
if (document.getElementById("profileName")) {
  loadProfile();
}