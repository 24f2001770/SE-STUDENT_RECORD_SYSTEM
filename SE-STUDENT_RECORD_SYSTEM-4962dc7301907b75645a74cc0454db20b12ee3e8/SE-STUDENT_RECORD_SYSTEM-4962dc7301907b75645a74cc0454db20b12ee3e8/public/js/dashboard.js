
const dashboards = {
  ADMIN: {
    name: "Demo Administrator",
    roleLabel: "Administrator",
    eyebrow: "ADMINISTRATOR WORKSPACE",
    title: "Your institution at a glance",
    description: "Review institution-wide summaries and administrative updates.",
    icon: "▦",
    summaries: [
      { label: "Registered students", value: "248", note: "Sample total", icon: "♙" },
      { label: "Faculty members", value: "18", note: "Sample total", icon: "♧" },
      { label: "Active courses", value: "32", note: "Sample total", icon: "▤" },
      { label: "Pending reviews", value: "06", note: "Sample count", icon: "◷" }
    ],
    alerts: [
      {
        type: "warning",
        title: "Pending administrative reviews",
        message: "Review pending items in the administrative workflow."
      },
      {
        type: "",
        title: "Student records overview",
        message: "The dashboard provides a central view of student and faculty summaries."
      },
      {
        type: "success",
        title: "System overview",
        message: "Use the available management sections to review institutional information."
      }
    ]
  },

  FACULTY: {
    name: "Demo Faculty Member",
    roleLabel: "Faculty",
    eyebrow: "FACULTY WORKSPACE",
    title: "Your teaching overview",
    description: "Keep track of course-related information and academic follow-ups.",
    icon: "▤",
    summaries: [
      { label: "Assigned courses", value: "04", note: "Sample count", icon: "▤" },
      { label: "Enrolled students", value: "126", note: "Sample total", icon: "♙" },
      { label: "Attendance reviews", value: "03", note: "Sample count", icon: "◷" },
      { label: "Pending assessments", value: "02", note: "Sample count", icon: "✓" }
    ],
    alerts: [
      {
        type: "warning",
        title: "Attendance follow-up",
        message: "Review attendance for your assigned courses when attendance data is available."
      },
      {
        type: "",
        title: "Assessment follow-up",
        message: "Check pending assessment work for your assigned courses."
      },
      {
        type: "success",
        title: "Course overview",
        message: "Your dashboard is focused on teaching and course-related activities."
      }
    ]
  },

  STUDENT: {
    name: "Demo Student",
    roleLabel: "Student",
    eyebrow: "STUDENT WORKSPACE",
    title: "Your academic overview",
    description: "See your academic summaries and the updates relevant to you.",
    icon: "♙",
    summaries: [
      { label: "Enrolled courses", value: "06", note: "Sample count", icon: "▤" },
      { label: "Attendance", value: "86%", note: "Sample percentage", icon: "◷" },
      { label: "Published results", value: "04", note: "Sample count", icon: "✓" },
      { label: "Academic notices", value: "02", note: "Sample count", icon: "♧" }
    ],
    alerts: [
      {
        type: "warning",
        title: "Attendance reminder",
        message: "Check your attendance regularly and follow up on any missed classes."
      },
      {
        type: "",
        title: "Published results",
        message: "Review results when they are officially published and available to you."
      },
      {
        type: "success",
        title: "Academic updates",
        message: "Use your academic overview to keep track of relevant updates."
      }
    ]
  }
};

const roleSelect = document.getElementById("role-select");
const welcomeTitle = document.getElementById("welcome-title");
const sidebarName = document.getElementById("sidebar-name");
const sidebarRole = document.getElementById("sidebar-role");
const roleEyebrow = document.getElementById("role-eyebrow");
const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const summaryGrid = document.getElementById("summary-grid");
const alertList = document.getElementById("alert-list");
const welcomeSymbol = document.querySelector(".welcome-symbol");

function renderDashboard(role) {
  const data = dashboards[role];

  if (!data) {
    return;
  }

  welcomeTitle.textContent = `Welcome back, ${data.roleLabel}`;
  sidebarName.textContent = data.name;
  sidebarRole.textContent = data.roleLabel;
  roleEyebrow.textContent = data.eyebrow;
  panelTitle.textContent = data.title;
  panelDescription.textContent = data.description;
  welcomeSymbol.textContent = data.icon;

  summaryGrid.replaceChildren();

  data.summaries.forEach((summary) => {
    const card = document.createElement("article");
    card.className = "summary-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const label = document.createElement("span");
    label.className = "card-label";
    label.textContent = summary.label;

    const icon = document.createElement("span");
    icon.className = "card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = summary.icon;

    const value = document.createElement("strong");
    value.className = "card-value";
    value.textContent = summary.value;

    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = summary.note;

    top.append(label, icon);
    card.append(top, value, note);
    summaryGrid.append(card);
  });

  alertList.replaceChildren();

  data.alerts.forEach((alert) => {
    const item = document.createElement("article");
    item.className = "alert-item";

    const indicator = document.createElement("span");
    indicator.className = `alert-indicator ${alert.type}`;
    indicator.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = alert.title;

    const message = document.createElement("p");
    message.textContent = alert.message;

    content.append(title, message);
    item.append(indicator, content);
    alertList.append(item);
  });
}

roleSelect.addEventListener("change", (event) => {
  renderDashboard(event.target.value);
});

renderDashboard(roleSelect.value);
