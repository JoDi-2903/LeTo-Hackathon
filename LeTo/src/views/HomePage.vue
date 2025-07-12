<template>
  <div class="home-page">
    <!-- Header -->
<header class="app-header">
  <div class="logo-container">
    <img src="/images/app_logo_no_text.png" alt="LeTo Logo" class="app-logo">
    <div class="text-container">
      <h1 class="app-title">LeTo</h1>
      <p class="app-subtitle">Learn Together</p>
    </div>
  </div>
  <div class="header-actions">
    <button class="filter-toggle" @click="showFilters = !showFilters">
      <i class="fas fa-filter"></i>
    </button>
    <button class="competition-toggle" @click="$router.push('/competition')">
      <i class="fas fa-trophy"></i>
    </button>
    <button class="profile-toggle" @click="$router.push('/profile')">
      <i class="fas fa-user-edit"></i>
    </button>
  </div>
</header>

    <!-- Filters Panel -->
    <transition name="slide-down">
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <!-- Study Subject Filter -->
          <div class="filter-group">
            <label><i class="fas fa-graduation-cap"></i> Study Subject</label>
            <select v-model="filters.studySubject">
              <option value="">All Subjects</option>
              <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>

          <!-- Learning Topics Filter -->
          <div class="filter-group">
            <label><i class="fas fa-book"></i> Learning Topics</label>
            <select v-model="filters.learningTopic">
              <option value="">All Topics</option>
              <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
                {{ topic }}
              </option>
            </select>
          </div>

          <!-- Age Range Filter -->
          <div class="filter-group">
            <label><i class="fas fa-calendar"></i> Age Range</label>
            <div class="range-container">
              <div class="dual-slider-container">
                <div class="slider-track"></div>
                <input 
                  type="range" 
                  v-model="filters.minAge" 
                  min="18" 
                  max="30" 
                  class="range-slider min-slider" 
                  @input="validateAgeRange('min')"
                >
                <input 
                  type="range" 
                  v-model="filters.maxAge" 
                  min="18" 
                  max="30" 
                  class="range-slider max-slider"
                  @input="validateAgeRange('max')"
                >
              </div>
              <div class="range-values">{{ filters.minAge }} - {{ filters.maxAge }}</div>
            </div>
          </div>

          <!-- Gender Filter -->
          <div class="filter-group">
            <label><i class="fas fa-users"></i> Gender</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.gender" value="m"> Male
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.gender" value="w"> Female
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.gender" value="d"> Diverse
              </label>
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="filter-group">
            <label><i class="fas fa-star"></i> Min Rating</label>
            <select v-model="filters.minRating">
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <!-- Region Filter -->
          <div class="filter-group">
            <label><i class="fas fa-map-marker-alt"></i> Region</label>
            <select v-model="filters.region">
              <option value="">All Regions</option>
              <option v-for="region in uniqueRegions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="filter-actions">
          <button @click="resetFilters" class="btn-secondary">Reset</button>
          <button @click="applyFilters" class="btn-primary">Apply Filters</button>
        </div>
      </div>
    </transition>

    <!-- Card Stack -->
    <div class="card-stack-container">
      <div class="match-info">
        <span>{{ filteredStudents.length }} students found</span>
      </div>

      <div class="card-stack-wrapper">
        <div class="card-stack" ref="cardStack">
          <transition-group name="card" tag="div" class="card-group">
            <div
              v-for="(student, index) in visibleStudents"
              :key="student.id"
              :class="['student-card', { 'top-card': index === 0 }]"
              :style="{ zIndex: visibleStudents.length - index }"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @mousedown="handleMouseDown"
              ref="cards"
            >
              <!-- Card Content -->
              <div class="card-header">
                <div class="student-photo-container">
                  <img 
                    v-if="getImageUrl(student.photo)" 
                    :src="getImageUrl(student.photo)" 
                    :alt="student.name" 
                    class="student-photo"
                    @error="handleImageError($event, student)"
                    @load="handleImageLoad($event, student)"
                  >
                  <!-- Fallback for missing images -->
                  <div v-else class="photo-placeholder">
                    <i class="fas fa-user-circle"></i>
                  </div>
                </div>
                <div class="card-overlay">
                  <h3 class="student-name">{{ student.name }}</h3>
                  <div class="student-basic-info">
                    <span class="age"><i class="fas fa-birthday-cake"></i> {{ student.age }}</span>
                    <span class="rating">
                      <i class="fas fa-star"></i> {{ student.rating }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="card-body">
                <div class="study-info">
                  <div class="info-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>{{ student.study_subject }} ({{ student.study_level }})</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ student.region }}</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-brain"></i>
                    <span>{{ student.learning_style }} Learner</span>
                  </div>
                </div>

                <div class="learning-topics">
                  <h4>Learning Topics:</h4>
                  <div class="topic-tags">
                    <span 
                      v-for="topic in student.learning_topics" 
                      :key="topic" 
                      class="topic-tag"
                    >
                      {{ topic }}
                    </span>
                  </div>
                </div>

                <div class="bio">
                  <p>{{ student.bio }}</p>
                </div>

                <div class="availability">
                  <h4>Available:</h4>
                  <div class="day-tags">
                    <span 
                      v-for="day in student.availability" 
                      :key="day" 
                      class="day-tag"
                    >
                      {{ day }}
                    </span>
                  </div>
                </div>

                <div class="interests">
                  <h4>Interests:</h4>
                  <div class="interest-tags">
                    <span 
                      v-for="interest in student.interests" 
                      :key="interest" 
                      class="interest-tag"
                    >
                      {{ interest }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" v-if="visibleStudents.length > 0">
          <button @click="swipeLeft" class="action-btn reject-btn">
            <i class="fas fa-times"></i>
          </button>
          <button @click="swipeRight" class="action-btn like-btn">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="visibleStudents.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No more students found</h3>
        <p>Try adjusting your filters or check back later for new matches!</p>
        <button @click="resetFilters" class="btn-primary">Reset Filters</button>
      </div>
    </div>
  </div>
</template>

<script>
import studentsData from '@/data/students.json'

export default {
  name: 'HomePage',
  data() {
    return {
      students: studentsData,
      showFilters: false,
      currentIndex: 0,
      isDragging: false,
      startX: 0,
      currentX: 0,
      imageErrors: new Set(),
      filters: {
        studySubject: '',
        learningTopic: '',
        minAge: 18,
        maxAge: 30,
        gender: [],
        minRating: 0,
        region: ''
      }
    }
  },
  computed: {
    uniqueSubjects() {
      return [...new Set(this.students.map(s => s.study_subject))]
    },
    uniqueTopics() {
      const topics = this.students.flatMap(s => s.learning_topics)
      return [...new Set(topics)]
    },
    uniqueRegions() {
      return [...new Set(this.students.map(s => s.region))]
    },
    filteredStudents() {
      return this.students.filter(student => {
        // Study subject filter
        if (this.filters.studySubject && student.study_subject !== this.filters.studySubject) {
          return false
        }
        
        // Learning topic filter
        if (this.filters.learningTopic && !student.learning_topics.includes(this.filters.learningTopic)) {
          return false
        }
        
        // Age filter
        if (student.age < this.filters.minAge || student.age > this.filters.maxAge) {
          return false
        }
        
        // Gender filter
        if (this.filters.gender.length > 0 && !this.filters.gender.includes(student.gender)) {
          return false
        }
        
        // Rating filter
        if (student.rating < this.filters.minRating) {
          return false
        }
        
        // Region filter
        if (this.filters.region && student.region !== this.filters.region) {
          return false
        }
        
        return true
      })
    },
    visibleStudents() {
      return this.filteredStudents.slice(this.currentIndex, this.currentIndex + 3)
    }
  },
  methods: {
    validateAgeRange(type) {
      if (type === 'min' && parseInt(this.filters.minAge) > parseInt(this.filters.maxAge)) {
        this.filters.minAge = this.filters.maxAge;
      } else if (type === 'max' && parseInt(this.filters.maxAge) < parseInt(this.filters.minAge)) {
        this.filters.maxAge = this.filters.minAge;
      }
    },
    getImageUrl(imageName) {
      if (!imageName || this.imageErrors.has(imageName)) {
        return null
      }
      // Try multiple possible paths for images
      const basePaths = [
        `/images/${imageName}`,
        `/src/assets/images/${imageName}`,
        `/public/images/${imageName}`,
        `./images/${imageName}`
      ]
      return basePaths[0] // Start with the most likely path
    },
    handleImageError(event, student) {
      console.log(`Image failed to load: ${student.photo}`)
      this.imageErrors.add(student.photo)
      // Hide the image element
      event.target.style.display = 'none'
    },
    handleImageLoad(event, student) {
      console.log(`Image loaded successfully: ${student.photo}`)
      event.target.style.display = 'block'
    },
    resetFilters() {
      this.filters = {
        studySubject: '',
        learningTopic: '',
        minAge: 18,
        maxAge: 30,
        gender: [],
        minRating: 0,
        region: ''
      }
      this.currentIndex = 0
    },
    applyFilters() {
      this.currentIndex = 0
      this.showFilters = false
    },
    swipeLeft() {
      this.currentIndex++
      console.log('Swiped left - Not interested')
    },
    swipeRight() {
      this.currentIndex++
      console.log('Swiped right - Interested!')
    },
    handleTouchStart(e) {
      this.isDragging = true
      this.startX = e.touches[0].clientX
    },
    handleTouchMove(e) {
      if (!this.isDragging) return
      e.preventDefault()
      this.currentX = e.touches[0].clientX - this.startX
      this.updateCardPosition()
    },
    handleTouchEnd() {
      if (!this.isDragging) return
      
      if (Math.abs(this.currentX) > 100) {
        if (this.currentX > 0) {
          this.swipeRight()
        } else {
          this.swipeLeft()
        }
      }
      
      this.resetCardPosition()
      this.isDragging = false
    },
    handleMouseDown(e) {
      this.isDragging = true
      this.startX = e.clientX
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(e) {
      if (!this.isDragging) return
      this.currentX = e.clientX - this.startX
      this.updateCardPosition()
    },
    handleMouseUp() {
      if (!this.isDragging) return
      
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
      
      if (Math.abs(this.currentX) > 100) {
        if (this.currentX > 0) {
          this.swipeRight()
        } else {
          this.swipeLeft()
        }
      }
      
      this.resetCardPosition()
      this.isDragging = false
    },
    updateCardPosition() {
      const topCard = this.$refs.cards?.[0]
      if (topCard) {
        topCard.style.transform = `translateX(${this.currentX}px) rotate(${this.currentX * 0.1}deg)`
        topCard.style.opacity = 1 - Math.abs(this.currentX) / 300
      }
    },
    resetCardPosition() {
      const topCard = this.$refs.cards?.[0]
      if (topCard) {
        topCard.style.transform = ''
        topCard.style.opacity = ''
      }
      this.currentX = 0
    }
  }
}
</script>

<style scoped>
/* Import Font Awesome locally if installed, otherwise use CDN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main container styling */
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--mint) 0%, var(--spearmint) 100%);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header Actions Container */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* Competition Toggle Button */
.competition-toggle {
  background: linear-gradient(135deg, var(--spearmint), var(--mint-light));
  color: var(--teal-green);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.15);
  flex-shrink: 0;
}

.competition-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 125, 127, 0.25);
}

/* Update responsive design for competition button */
@media (max-width: 480px) {
  .competition-toggle {
    padding: 0.5rem 0.75rem;
  }
}

/* Profile Toggle Button */
.profile-toggle {
  background: linear-gradient(135deg, var(--spearmint), var(--mint-light));
  color: var(--teal-green);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.15);
  flex-shrink: 0;
}

.profile-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 125, 127, 0.25);
}

/* Update responsive design for the header actions */
@media (max-width: 480px) {
  .header-actions {
    gap: 0.5rem;
  }
  
  .profile-toggle {
    padding: 0.5rem 0.75rem; /* Smaller padding for the profile button */
  }
}

/* Header Styles */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 1200px;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 1;
  min-width: 0; /* Allow container to shrink below content size if needed */
}

.app-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.text-container {
  min-width: 0; /* Allow text to shrink if needed */
}

/* Update responsive design for the header */
@media (max-width: 480px) {
  .app-header {
    flex-direction: row; /* Keep as row, don't change to column */
    gap: 0.5rem;
  }
  
  .logo-container {
    gap: 0.5rem;
  }
  
  .app-logo {
    height: 40px; /* Smaller logo on mobile */
  }
  
  .app-title {
    font-size: 1.5rem; /* Smaller title on mobile */
  }
  
  .app-subtitle {
    font-size: 0.8rem; /* Smaller subtitle on mobile */
  }
  
  .filter-toggle {
    padding: 0.5rem 0.75rem; /* Smaller padding for the filter button */
  }
}

.app-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--teal-green);
  margin: 0;
  background: linear-gradient(45deg, var(--teal-green), var(--teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  font-size: 1rem;
  color: var(--teal);
  margin: 0;
  font-weight: 300;
}

.filter-toggle {
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.3);
  flex-shrink: 0;
}

.filter-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 125, 127, 0.4);
}

/* Filters Panel */
.filters-panel {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(22, 125, 127, 0.1);
  border: 1px solid var(--spearmint);
  width: 100%;
  max-width: 1200px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  color: var(--teal-green);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group select,
.filter-group input {
  padding: 0.75rem;
  border: 2px solid var(--spearmint);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--teal);
}

/* Dual-thumb Slider Styles */
.range-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dual-slider-container {
  position: relative;
  height: 6px;
  margin: 20px 0;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 6px;
  background: var(--spearmint);
  border-radius: 3px;
}

/* Fix for the dual-thumb slider to make both thumbs accessible */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  position: absolute;
  height: 6px;
  cursor: pointer;
  outline: none;
  margin: 0;
  padding: 0;
  pointer-events: none; /* Add this to prevent range itself from capturing events */
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--teal-green);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  position: relative;
  pointer-events: auto; /* Make sure the thumb still captures events */
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--teal-green);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  position: relative;
  pointer-events: auto; /* Make sure the thumb still captures events */
}

/* Adjust the min slider to cover only the left half and max slider to cover the right half */
.min-slider {
  z-index: 2;
  width: 50%;
  left: 0;
}

.max-slider {
  z-index: 2;
  width: 50%;
  left: 50%;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
}

.btn-secondary {
  background: transparent;
  color: var(--teal-green);
  border: 2px solid var(--teal-green);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.3);
}

/* Card Stack Container - FIXED CENTERING */
.card-stack-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.match-info {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--teal-green);
  font-weight: 600;
  font-size: 1.1rem;
  width: 100%;
}

.card-stack-wrapper {
  position: relative;
  width: 100%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-stack {
  position: relative;
  width: 100%;
  height: 580px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* FIXED: Card Group Centering */
.card-group {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.student-card {
  position: absolute;
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(22, 125, 127, 0.15);
  overflow: hidden;
  cursor: grab;
  transition: transform 0.3s ease, opacity 0.3s ease;
  user-select: none;
  transform-origin: center;
  /* FIXED: Perfect centering */
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.student-card:active {
  cursor: grabbing;
}

.student-card.top-card {
  z-index: 100;
}

.card-header {
  position: relative;
  height: 260px;
  overflow: hidden;
}

.student-photo-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--spearmint), var(--mint));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--teal-green);
  font-size: 4rem;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  color: white;
  padding: 1.5rem;
}

.student-name {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.student-basic-info {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.age,
.rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-body {
  padding: 1.5rem;
  max-height: 320px;
  overflow-y: auto;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--teal-green);
  font-size: 0.95rem;
}

.info-item i {
  width: 20px;
  color: var(--teal);
  flex-shrink: 0;
}

.learning-topics h4,
.availability h4,
.interests h4 {
  color: var(--teal-green);
  margin: 1rem 0 0.5rem 0;
  font-size: 1rem;
}

.topic-tags,
.day-tags,
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.topic-tag {
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-tag {
  background: var(--spearmint);
  color: var(--teal-green);
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.interest-tag {
  background: var(--mint);
  color: var(--teal-green);
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--spearmint);
}

.bio {
  margin: 1rem 0;
  color: var(--teal);
  font-style: italic;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* FIXED: Action Buttons Positioning */
.action-buttons {
  position: relative;
  margin-top: 2rem;
  display: flex;
  gap: 2rem;
  z-index: 1000;
  justify-content: center;
  width: 100%;
}

.action-btn {
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reject-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

.like-btn {
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--teal-green);
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(22, 125, 127, 0.15);
  width: 100%;
  max-width: 380px;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--teal);
  margin-bottom: 2rem;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.card-enter-active,
.card-leave-active {
  transition: all 0.5s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.8) translateY(50px);
}

.card-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(1.1) translateX(100px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-page {
    padding: 0.75rem;
  }
  
  .app-header {
    padding: 0.5rem 0;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-actions {
    justify-content: stretch;
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: 1;
  }
  
  .card-stack-wrapper {
    min-height: 620px;
  }
  
  .card-stack {
    height: 500px;
  }
  
  .card-header {
    height: 220px;
  }
  
  .student-card {
    max-width: 100%;
  }
  
  .action-buttons {
    gap: 1.5rem;
  }
  
  .action-btn {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 0.5rem;
  }
  
  .app-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .range-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .range-container span {
    align-self: center;
  }
  
  .card-stack-wrapper {
    min-height: 580px;
  }
  
  .card-stack {
    height: 460px;
  }
  
  .card-header {
    height: 200px;
  }
  
  .card-body {
    padding: 1rem;
    max-height: 260px;
  }
  
  .action-buttons {
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .action-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>
