<template>
  <div class="home-page">
    <!-- Header -->
    <header class="app-header">
      <div class="logo-container">
        <h1 class="app-title">LeTo</h1>
        <p class="app-subtitle">Learn Together</p>
      </div>
      <button class="filter-toggle" @click="showFilters = !showFilters">
        <i class="fas fa-filter"></i>
      </button>
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
              <input type="range" v-model="filters.minAge" min="18" max="30" class="range-slider">
              <span>{{ filters.minAge }} - {{ filters.maxAge }}</span>
              <input type="range" v-model="filters.maxAge" min="18" max="30" class="range-slider">
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

      <div class="card-stack" ref="cardStack">
        <transition-group name="card" tag="div">
          <div
            v-for="(student, index) in visibleStudents"
            :key="student.id"
            :class="['student-card', { 'top-card': index === 0 }]"
            :style="{ zIndex: visibleStudents.length - index }"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            ref="cards"
          >
            <!-- Card Content -->
            <div class="card-header">
              <img :src="student.photo" :alt="student.name" class="student-photo">
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

        <!-- Action Buttons -->
        <div class="action-buttons" v-if="visibleStudents.length > 0">
          <button @click="swipeLeft" class="action-btn reject-btn">
            <i class="fas fa-times"></i>
          </button>
          <button @click="swipeRight" class="action-btn like-btn">
            <i class="fas fa-heart"></i>
          </button>
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
    },
    handleMouseMove(e) {
      if (!this.isDragging) return
      this.currentX = e.clientX - this.startX
      this.updateCardPosition()
    },
    handleMouseUp() {
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

<style>
@import '@/styles/HomePage.css';
</style>
