import { Chart } from "@/components/ui/chart"
// Dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (!localStorage.getItem("userLoggedIn")) {
    window.location.href = "login.html"
    return
  }

  // Load user data
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const userEmail = localStorage.getItem("userEmail")

  // Update welcome message
  const welcomeElement = document.getElementById("userWelcome")
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome, ${userData.firstName || userEmail}`
  }

  // Initialize vitals chart
  initVitalsChart()

  // Update risk score based on mock data
  updateRiskScore()
})

function initVitalsChart() {
  const ctx = document.getElementById("vitalsChart")
  if (!ctx) return

  // Mock data for vitals
  const vitalsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Blood Pressure (Systolic)",
        data: [120, 118, 122, 119, 121, 117, 120],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
      },
      {
        label: "Heart Rate",
        data: [72, 75, 70, 73, 71, 74, 72],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  }

  new Chart(ctx, {
    type: "line",
    data: vitalsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  })
}

function updateRiskScore() {
  // Mock risk calculation based on user data
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  let riskScore = 7.2 // Base score

  // Adjust based on condition (mock logic)
  if (userData.conditions === "diabetes") {
    riskScore += 0.5
  } else if (userData.conditions === "hypertension") {
    riskScore += 0.3
  }

  // Update display
  const riskElement = document.getElementById("riskScore")
  if (riskElement) {
    riskElement.textContent = riskScore.toFixed(1)

    // Update risk level styling
    riskElement.className = "risk-score-value"
    if (riskScore < 5) {
      riskElement.classList.add("risk-low")
    } else if (riskScore < 8) {
      riskElement.classList.add("risk-medium")
    } else {
      riskElement.classList.add("risk-high")
    }
  }
}

// Quick action functions
function logVitals() {
  const vitals = prompt("Enter your vitals (format: BP/HR, e.g., 120/80)")
  if (vitals) {
    alert("Vitals logged successfully! Your data has been recorded.")
    // In a real app, this would send data to the backend
  }
}

function viewHistory() {
  alert("Viewing your health history...")
  // In a real app, this would navigate to a history page
}

function contactDoctor() {
  alert("Connecting you with your healthcare provider...")
  // In a real app, this would open a communication interface
}

function joinCommunity() {
  window.location.href = "community.html"
}

function logout() {
  localStorage.removeItem("userLoggedIn")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userData")
  window.location.href = "index.html"
}

// Simulate real-time updates
setInterval(() => {
  // Update timestamp or other dynamic content
  const now = new Date()
  console.log("Dashboard updated at:", now.toLocaleTimeString())
}, 30000) // Update every 30 seconds
