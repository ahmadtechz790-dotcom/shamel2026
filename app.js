const students = [
  { number: "22410215", name: "امير ابراهيم محمد ابو زاكيه", major: "الادارة واتمتة المكاتب", grades: [18, 16, 24, 10, 4], total: 72 },
  { number: "22410279", name: "الاء صابر أحمد مصطفى", major: "الادارة واتمتة المكاتب", grades: [20, 17, 23, 11, 5], total: 76 },
  { number: "22319353", name: "بيسان امين خليل نباهين", major: "الادارة واتمتة المكاتب", grades: [17, 10, 18, 9, 4], total: 58 },
  { number: "22410649", name: "حمزه شاكر صالح ابو حمديه", major: "الادارة واتمتة المكاتب", grades: [19, 14, 23, 12, 4], total: 72 },
  { number: "22410087", name: "مالك محمد سعدي الصفدي", major: "الادارة واتمتة المكاتب", grades: [5, 10, 21, 10, 4], total: 50 },
  { number: "22410724", name: "ابراهيم علي محمود شعفوط", major: "الادارة واتمتة المكاتب", grades: null, total: null },
  { number: "22410020", name: "تمارا صابر موسى الحانوتي", major: "الادارة واتمتة المكاتب", grades: null, total: null },
  { number: "22410500", name: "شهد محمد أحمد الحجاجره", major: "الادارة واتمتة المكاتب", grades: null, total: null }
];

const form = document.querySelector("#search-form");
const input = document.querySelector("#student-number");
const resultRegion = document.querySelector("#result-region");
const clearButton = document.querySelector("#clear-button");
const formatter = new Intl.NumberFormat("en-US");

function renderResult(student) {
  if (!student) {
    resultRegion.innerHTML = `<div class="not-found"><strong>لم نعثر على نتيجة بهذا الرقم</strong><span>تأكد من الرقم الجامعي وحاول البحث مرة أخرى.</span></div>`;
    return;
  }

  const grades = student.grades
    ? student.grades.map((grade, index) => `<div class="grade"><span>س${index + 1}</span><strong>${formatter.format(grade)}</strong></div>`).join("")
    : Array.from({ length: 5 }, (_, index) => `<div class="grade"><span>س${index + 1}</span><strong class="missing">—</strong></div>`).join("");
  const score = student.total === null ? `<strong class="missing">غير متوفر</strong><span>النتيجة النهائية</span>` : `<strong>${formatter.format(student.total)}</strong>`;

  resultRegion.innerHTML = `<article class="result-card">
    <div class="score">${score}</div>
    <div class="student-block"><h2 class="details-title">تفاصيل الطالب</h2><h3 class="student-name">${student.name}</h3><div class="student-meta"><div class="meta-item"><span>الرقم الجامعي</span><strong>${student.number}</strong></div><div class="meta-item"><span>التخصص</span><strong>${student.major}</strong></div></div></div>
    <div class="grades">${grades}</div>
    <div class="marks-note"><strong>ملاحظة توزيع العلامات</strong><span>س1:</span> برنامج وورد ودمج المراسلات (25) &nbsp; <span>س2:</span> برنامج الإكسل (25) &nbsp; <span>س3:</span> برنامج بوربوينت (25) &nbsp; <span>س4:</span> مراسلات تجارية (15) &nbsp; <span>س5:</span> الطباعة باللغة العربية واللغة الإنجليزية (10)</div>
  </article>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const number = input.value.replace(/\D/g, "");
  input.value = number;
  renderResult(students.find((student) => student.number === number));
});

input.addEventListener("input", () => { clearButton.hidden = input.value.length === 0; });
clearButton.addEventListener("click", () => { input.value = ""; clearButton.hidden = true; input.focus(); });
