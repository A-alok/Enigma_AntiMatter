// Main application JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Initialize application
  console.log("VitalCircle application loaded")

  // Add smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe feature cards for animation
  const featureCards = document.querySelectorAll(".feature-card")
  featureCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
})

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `

  // Add type-specific styling
  if (type === "success") {
    notification.style.borderColor = "var(--success)"
    notification.style.color = "var(--success)"
  } else if (type === "error") {
    notification.style.borderColor = "var(--danger)"
    notification.style.color = "var(--danger)"
  } else if (type === "warning") {
    notification.style.borderColor = "var(--warning)"
    notification.style.color = "var(--warning)"
  }

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// Form validation utilities
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  return password.length >= 8
}

// Local storage utilities
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error saving to storage:", error)
    return false
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error loading from storage:", error)
    return null
  }
}

// Mock API functions (in a real app, these would make actual HTTP requests)
const API = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    if (email && password) {
      return {
        success: true,
        user: { email, id: "user_" + Math.random().toString(36).substr(2, 9) },
      }
    }
    return { success: false, error: "Invalid credentials" }
  },

  register: async (userData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock registration
    const patientId = "VC-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    return {
      success: true,
      user: { ...userData, patientId },
    }
  },

  getVitals: async (userId) => {
    // Mock vitals data
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        weight: 150,
        bloodSugar: 95,
        timestamp: new Date().toISOString(),
      },
    }
  },

  getRiskScore: async (userId) => {
    // Mock risk calculation
    await new Promise((resolve) => setTimeout(resolve, 800))

    const score = Math.random() * 10
    return {
      success: true,
      data: {
        score: score.toFixed(1),
        level: score < 3 ? "low" : score < 7 ? "medium" : "high",
        prediction: "Based on your recent vitals, your condition appears stable.",
        recommendations: [
          "Continue current medication schedule",
          "Maintain regular exercise routine",
          "Monitor sodium intake",
        ],
      },
    }
  },
}
