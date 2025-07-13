<template>
  <div class="groups-courses-page">
    <!-- Header -->
    <header class="app-header">
      <div class="logo-container" @click="$router.push('/')">
        <img src="/images/app_logo_no_text.png" alt="LeTo Logo" class="app-logo">
        <div class="text-container">
          <h1 class="app-title">LeTo</h1>
          <p class="app-subtitle">Learn Together</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="home-toggle" @click="$router.push('/')">
          <i class="fas fa-home"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content-container">
      <!-- Search and Filter Controls -->
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Search groups or courses...">
        </div>
        <div class="filter-controls">
          <button class="filter-button" @click="activeTab = 'myGroups'">
            <i class="fas fa-users"></i> My Groups
          </button>
          <button class="filter-button" @click="activeTab = 'publicGroups'">
            <i class="fas fa-globe"></i> Public Groups
          </button>
          <button class="filter-button" @click="activeTab = 'myCourses'">
            <i class="fas fa-book"></i> My Courses
          </button>
          <button class="filter-button" @click="activeTab = 'recommendedCourses'">
            <i class="fas fa-graduation-cap"></i> Courses
          </button>
        </div>
      </div>
      
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- My Learning Groups -->
        <div v-if="activeTab === 'myGroups'" class="section">
          <h2 class="section-title">My Learning Groups</h2>
          <div class="cards-grid">
            <div v-for="(group, index) in myGroups" :key="'my-group-'+index" class="group-card">
              <div class="card-badge" :class="{'active-badge': group.active}">
                {{ group.active ? 'Active' : 'Inactive' }}
              </div>
              <h3 class="card-title">{{ group.name }}</h3>
              <div class="card-subject">{{ group.subject }}</div>
              <div class="card-info">
                <div class="info-item">
                  <i class="fas fa-user-friends"></i> {{ group.members }} members
                </div>
                <div class="info-item">
                  <i class="fas fa-calendar"></i> {{ group.meetingFrequency }}
                </div>
              </div>
              <div class="meeting-time" v-if="group.nextMeeting">
                <i class="fas fa-clock"></i> Next: {{ group.nextMeeting }}
              </div>
              <div class="card-actions">
                <button class="action-button primary">
                  <i class="fas fa-comments"></i> Chat
                </button>
                <button class="action-button secondary">
                  <i class="fas fa-calendar-plus"></i> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Public Learning Groups -->
        <div v-if="activeTab === 'publicGroups'" class="section">
          <h2 class="section-title">Public Learning Groups</h2>
          <div class="cards-grid">
            <div v-for="(group, index) in publicGroups" :key="'public-group-'+index" class="group-card">
              <div class="card-badge">{{ group.members }} members</div>
              <h3 class="card-title">{{ group.name }}</h3>
              <div class="card-subject">{{ group.subject }}</div>
              <div class="card-description">{{ group.description }}</div>
              <div class="card-info">
                <div class="info-item">
                  <i class="fas fa-building"></i> {{ group.university }}
                </div>
                <div class="info-item">
                  <i class="fas fa-calendar"></i> {{ group.meetingFrequency }}
                </div>
              </div>
              <div class="card-tags">
                <span v-for="(tag, tagIndex) in group.tags" :key="'tag-'+tagIndex" class="tag">
                  {{ tag }}
                </span>
              </div>
              <div class="card-actions">
                <button class="action-button primary">
                  <i class="fas fa-plus"></i> Join Group
                </button>
                <button class="action-button secondary">
                  <i class="fas fa-info-circle"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- My Courses -->
        <div v-if="activeTab === 'myCourses'" class="section">
          <h2 class="section-title">My Enrolled Courses</h2>
          <div class="cards-grid">
            <div v-for="(course, index) in myCourses" :key="'my-course-'+index" class="course-card">
              <div class="card-badge progress-badge">
                {{ course.progress }}% Complete
              </div>
              <div class="course-image">
                <img :src="course.image" :alt="course.title">
                <div class="provider-badge">{{ course.provider }}</div>
              </div>
              <h3 class="card-title">{{ course.title }}</h3>
              <div class="card-info">
                <div class="info-item">
                  <i class="fas fa-clock"></i> {{ course.duration }}
                </div>
                <div class="info-item">
                  <i class="fas fa-star"></i> {{ course.rating }}
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{width: course.progress + '%'}"></div>
              </div>
              <div class="card-actions">
                <button class="action-button primary">
                  <i class="fas fa-play-circle"></i> Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Courses -->
        <div v-if="activeTab === 'recommendedCourses'" class="section">
          <h2 class="section-title">Recommended Courses</h2>
          <p class="section-description">Courses tailored to your interests and current studies</p>
          
          <div class="cards-grid">
            <div v-for="(course, index) in recommendedCourses" :key="'rec-course-'+index" class="course-card">
              <div class="card-badge price-badge" v-if="course.price > 0">
                {{ course.price.toFixed(2) }} €
              </div>
              <div class="card-badge free-badge" v-else>
                Free
              </div>
              <div class="course-image">
                <img :src="course.image" :alt="course.title">
                <div class="provider-badge">{{ course.provider }}</div>
              </div>
              <h3 class="card-title">{{ course.title }}</h3>
              <div class="card-description">{{ course.description }}</div>
              <div class="card-info">
                <div class="info-item">
                  <i class="fas fa-clock"></i> {{ course.duration }}
                </div>
                <div class="info-item">
                  <i class="fas fa-star"></i> {{ course.rating }}
                </div>
              </div>
              <div class="card-actions">
                <button class="action-button primary">
                  <i class="fas fa-shopping-cart"></i> {{ course.price > 0 ? 'Purchase' : 'Enroll' }}
                </button>
                <button class="action-button secondary">
                  <i class="fas fa-info-circle"></i> Details
                </button>
              </div>
            </div>
          </div>

          <!-- Platform Connections -->
          <div class="platform-connections">
            <h3 class="connections-title">Connect with Learning Platforms</h3>
            <div class="platforms-grid">
              <div v-for="(platform, index) in platforms" :key="'platform-'+index" class="platform-card">
                <img :src="platform.logo" :alt="platform.name" class="platform-logo">
                <h4 class="platform-name">{{ platform.name }}</h4>
                <p class="platform-description">{{ platform.description }}</p>
                <button class="platform-connect-btn" :class="{'connected': platform.connected}">
                  <i :class="platform.connected ? 'fas fa-check' : 'fas fa-plug'"></i> 
                  {{ platform.connected ? 'Connected' : 'Connect' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupsCoursesPage',
  data() {
    return {
      activeTab: 'myGroups',
      searchQuery: '',
      myGroups: [
        {
          name: 'Calculus Champions',
          subject: 'Mathematics',
          members: 6,
          meetingFrequency: 'Twice a week',
          nextMeeting: 'Tomorrow, 4:00 PM',
          active: true
        },
        {
          name: 'Quantum Physics Study',
          subject: 'Physics',
          members: 4,
          meetingFrequency: 'Weekly',
          nextMeeting: 'Thursday, 2:30 PM',
          active: true
        },
        {
          name: 'Data Structures & Algorithms',
          subject: 'Computer Science',
          members: 8,
          meetingFrequency: 'Weekly',
          nextMeeting: 'Monday, 6:00 PM',
          active: true
        },
        {
          name: 'Organic Chemistry Lab Prep',
          subject: 'Chemistry',
          members: 5,
          meetingFrequency: 'Monthly',
          nextMeeting: null,
          active: false
        }
      ],
      publicGroups: [
        {
          name: 'Linear Algebra Mastery',
          subject: 'Mathematics',
          description: 'Deep dive into vectors, matrices, and transformations',
          members: 12,
          university: 'Technical University of Munich',
          meetingFrequency: 'Weekly',
          tags: ['Vectors', 'Matrices', 'Eigenvalues']
        },
        {
          name: 'Machine Learning Basics',
          subject: 'Computer Science',
          description: 'Understand fundamental ML concepts and algorithms',
          members: 15,
          university: 'Ludwig Maximilian University',
          meetingFrequency: 'Twice a week',
          tags: ['AI', 'Python', 'Algorithms']
        },
        {
          name: 'Thermodynamics Group',
          subject: 'Physics',
          description: 'Tackling complex thermodynamic problems together',
          members: 8,
          university: 'Technical University of Munich',
          meetingFrequency: 'Weekly',
          tags: ['Energy', 'Entropy', 'Systems']
        },
        {
          name: 'Business Economics Study Group',
          subject: 'Economics',
          description: 'Analyzing business cases and economic theories',
          members: 10,
          university: 'Hochschule München',
          meetingFrequency: 'Bi-weekly',
          tags: ['Microeconomics', 'Business', 'Case Studies']
        }
      ],
      myCourses: [
        {
          title: 'Advanced JavaScript Programming',
          provider: 'Udemy',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=JS+Course',
          duration: '20 hours',
          rating: 4.7,
          progress: 65
        },
        {
          title: 'Linear Algebra Fundamentals',
          provider: 'Coursera',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=Math+Course',
          duration: '12 hours',
          rating: 4.9,
          progress: 30
        },
        {
          title: 'Introduction to Machine Learning',
          provider: 'edX',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=ML+Course',
          duration: '40 hours',
          rating: 4.8,
          progress: 15
        }
      ],
      recommendedCourses: [
        {
          title: 'Quantum Computing for Beginners',
          provider: 'Coursera',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=Quantum+Computing',
          duration: '18 hours',
          rating: 4.6,
          price: 49.99,
          description: 'Learn the fundamentals of quantum computing and quantum algorithms.'
        },
        {
          title: 'Advanced Data Structures',
          provider: 'edX',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=Data+Structures',
          duration: '25 hours',
          rating: 4.7,
          price: 39.99,
          description: 'Master complex data structures used in efficient algorithms.'
        },
        {
          title: 'Python for Data Science',
          provider: 'DataCamp',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=Python+Data+Science',
          duration: '30 hours',
          rating: 4.9,
          price: 59.99,
          description: 'Apply Python programming to data analysis and visualization.'
        },
        {
          title: 'Intro to Artificial Intelligence',
          provider: 'Stanford Online',
          image: 'https://placehold.co/600x400/167d7f/ffffff?text=AI+Course',
          duration: '12 hours',
          rating: 4.8,
          price: 0,
          description: 'Learn the fundamentals of AI and its applications.'
        }
      ],
      platforms: [
        {
          name: 'Coursera',
          logo: 'https://placehold.co/200x100/ffffff/167d7f?text=Coursera',
          description: 'Connect to access thousands of courses from top universities.',
          connected: true
        },
        {
          name: 'edX',
          logo: 'https://placehold.co/200x100/ffffff/167d7f?text=edX',
          description: 'University-level courses from world-class institutions.',
          connected: false
        },
        {
          name: 'LinkedIn Learning',
          logo: 'https://placehold.co/200x100/ffffff/167d7f?text=LinkedIn+Learning',
          description: 'Professional courses to improve your career skills.',
          connected: false
        },
        {
          name: 'Udemy',
          logo: 'https://placehold.co/200x100/ffffff/167d7f?text=Udemy',
          description: 'Practical skills-based courses on various topics.',
          connected: true
        }
      ]
    }
  },
  methods: {
    // Methods for handling interactions would go here
  }
}
</script>

<style scoped>
/* Import Font Awesome if not already available */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main container styling */
.groups-courses-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--mint) 0%, var(--spearmint) 100%);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* Added to ensure scrolling works */
  position: relative; /* Changed to relative */
}

/* Header Styles - Kept from original design */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1200px;
  flex-wrap: nowrap;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 1;
  min-width: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.02);
}

.app-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.text-container {
  min-width: 0;
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

/* Header Actions Container */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.home-toggle {
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

.home-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 125, 127, 0.4);
}

/* Main Content Container */
.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: visible; /* Ensure content can expand */
  flex: 1; /* Allow container to grow */
}

/* Search and Filter Section */
.search-filter {
  background-color: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-medium);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--mint);
}

.search-box i {
  color: var(--teal-green);
  margin-right: 0.75rem;
}

.search-box input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  color: #333;
}

.search-box input:focus {
  outline: none;
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-button {
  background: white;
  border: 2px solid var(--teal);
  color: var(--teal-green);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-button:hover {
  background: linear-gradient(135deg, var(--spearmint), var(--mint-light));
  transform: translateY(-2px);
}

.filter-button i {
  font-size: 1rem;
}

/* Tab Content */
.tab-content {
  width: 100%;
  overflow: visible; /* Ensure content isn't cut off */
}

.section {
  margin-bottom: 3rem;
  overflow: visible; /* Ensure content isn't cut off */
}

.section-title {
  color: var(--teal-green);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1rem;
  border-left: 5px solid var(--teal);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 0 10px 10px 0;
  backdrop-filter: blur(5px);
  box-shadow: var(--shadow-light);
}

.section-description {
  color: var(--teal-dark);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  padding-left: 1rem;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Group Card Styles */
.group-card, .course-card {
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow-light);
  transition: all var(--transition-medium);
  position: relative;
  overflow: hidden;
}

.group-card:hover, .course-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--mint-light);
  color: var(--teal-green);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.active-badge {
  background: linear-gradient(135deg, #c1f8cf, #a0e9af);
  color: #2c7744;
}

.progress-badge {
  background: linear-gradient(135deg, var(--mint-light), var(--spearmint));
}

.price-badge {
  background: linear-gradient(135deg, #ffebc8, #ffd78e);
  color: #b86e00;
}

.free-badge {
  background: linear-gradient(135deg, #c1f8cf, #a0e9af);
  color: #2c7744;
}

.card-title {
  font-size: 1.3rem;
  color: var(--teal-green);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.card-subject {
  color: var(--teal);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.card-description {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.meeting-time {
  background-color: #f8f8f8;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--teal-green);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: #f0f0f0;
  border-radius: 15px;
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  color: #555;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.action-button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  border: none;
  flex: 1;
  justify-content: center;
}

.action-button.primary {
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
}

.action-button.secondary {
  background: white;
  border: 1px solid var(--spearmint);
  color: var(--teal-green);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(22, 125, 127, 0.2);
}

/* Course Card Specific Styles */
.course-image {
  width: 100%;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.provider-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--teal-green);
  padding: 0.2rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(to right, var(--spearmint), var(--teal-green));
  border-radius: 4px;
}

/* Platform Connections Section */
.platform-connections {
  margin-top: 3rem;
}

.connections-title {
  color: var(--teal-green);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.platform-card {
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow-light);
  transition: all var(--transition-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.platform-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.platform-logo {
  width: 120px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.platform-name {
  font-size: 1.2rem;
  color: var(--teal-green);
  margin-bottom: 0.5rem;
}

.platform-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.platform-connect-btn {
  background: linear-gradient(135deg, var(--spearmint), var(--teal-green));
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.platform-connect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(22, 125, 127, 0.2);
}

.platform-connect-btn.connected {
  background: #e0e0e0;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  .platforms-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .search-filter {
    padding: 1rem;
  }
  
  .filter-controls {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch; /* Improved mobile scrolling */
  }
  
  .filter-button {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  /* Fixed mobile view */
  body, html {
    overflow-x: hidden; /* Prevent horizontal scrolling */
    max-width: 100%;
  }
  
  .groups-courses-page {
    padding: 0.5rem; /* Reduced padding to maximize space */
    min-height: auto; /* Allow content to determine height */
  }
  
  .app-header {
    flex-direction: row;
    gap: 0.5rem;
    margin-bottom: 1rem; /* Reduced margin */
  }
  
  .logo-container {
    gap: 0.5rem;
  }
  
  .app-logo {
    height: 40px;
  }
  
  .app-title {
    font-size: 1.5rem;
    }
  
  .app-subtitle {
    font-size: 0.8rem;
  }
  
  .home-toggle {
    padding: 0.5rem 0.75rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .platforms-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  /* Improved card sizing for mobile */
  .group-card, .course-card {
    padding: 1rem; /* Reduced padding */
  }
  
  /* Ensure platform cards fit properly */
  .platform-card {
    padding: 1rem;
  }
  
  .platform-logo {
    width: 100px;
    height: 50px;
  }
  
  /* Better handling of buttons on small screens */
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>
