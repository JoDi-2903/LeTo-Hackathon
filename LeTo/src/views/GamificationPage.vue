<template>
  <div class="gamification-page">
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
        <button class="home-toggle" @click="$router.push('/')">
          <i class="fas fa-home"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="gamification-container">
      <!-- Streak Section -->
      <div class="gamification-card streak-card">
        <h2 class="section-title">
          <i class="fas fa-fire"></i> Your Learning Streak
        </h2>
        <div class="streak-container">
          <div class="streak-count">
            <span class="streak-number">{{ currentStreak }}</span>
            <span class="streak-label">days</span>
          </div>
          <div class="streak-text">
            <p v-if="currentStreak >= 5">You're on fire! Keep it up!</p>
            <p v-else-if="currentStreak > 0">Great start! Come back tomorrow to build your streak.</p>
            <p v-else>Start your streak today by completing a study session!</p>
          </div>
        </div>
        
        <!-- Weekly Calendar View -->
        <div class="streak-calendar">
          <div 
            v-for="(day, index) in streakCalendar" 
            :key="index" 
            class="calendar-day"
            :class="{ 'day-completed': day.completed, 'day-today': day.isToday, 'day-future': day.isFuture }"
          >
            <span class="day-name">{{ day.name }}</span>
            <div class="day-icon">
              <i v-if="day.completed" class="fas fa-check-circle"></i>
              <i v-else-if="day.isToday" class="fas fa-circle"></i>
              <i v-else-if="!day.isFuture" class="far fa-times-circle"></i>
              <i v-else class="far fa-circle"></i>
            </div>
          </div>
        </div>
        
        <!-- Daily Goal -->
        <div class="daily-goal">
          <h3>Today's Goal</h3>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: `${dailyProgress}%` }"></div>
            <span class="progress-text">{{ dailyProgress }}%</span>
          </div>
          <button @click="completeActivity" class="btn-activity" :disabled="dailyProgress === 100">
            <i class="fas fa-plus-circle"></i> Complete Study Activity
          </button>
        </div>
      </div>
      
      <!-- Leaderboard Section -->
      <div class="gamification-card leaderboard-card">
        <h2 class="section-title">
          <i class="fas fa-trophy"></i> Leaderboard
        </h2>
        
        <div class="leaderboard-tabs">
          <button 
            v-for="tab in leaderboardTabs" 
            :key="tab.id"
            @click="currentLeaderboardTab = tab.id"
            :class="{ active: currentLeaderboardTab === tab.id }"
            class="tab-button"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="leaderboard-container">
          <div class="leaderboard-header">
            <span class="rank-header">Rank</span>
            <span class="name-header">Name</span>
            <span class="score-header">Score</span>
          </div>
          
          <div 
            v-for="(user, index) in filteredLeaderboard" 
            :key="user.id"
            class="leaderboard-item"
            :class="{ 
              'current-user': user.isCurrentUser,
              'top-three': index < 3 
            }"
          >
            <div class="rank">
              <span v-if="index === 0" class="medal gold"><i class="fas fa-medal"></i></span>
              <span v-else-if="index === 1" class="medal silver"><i class="fas fa-medal"></i></span>
              <span v-else-if="index === 2" class="medal bronze"><i class="fas fa-medal"></i></span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="user-info">
              <span class="user-avatar" :style="{ backgroundColor: user.avatarColor }">
                {{ user.name.charAt(0).toUpperCase() }}
              </span>
              <span class="user-name">{{ user.name }}</span>
            </div>
            <div class="user-score">{{ user.scores[currentLeaderboardTab] }}</div>
          </div>
        </div>
      </div>
      
      <!-- Achievements Section -->
      <div class="gamification-card achievements-card">
        <h2 class="section-title">
          <i class="fas fa-award"></i> Achievements
        </h2>
        
        <div class="achievements-grid">
          <div 
            v-for="achievement in achievements" 
            :key="achievement.id"
            class="achievement-item"
            :class="{ 'achievement-unlocked': achievement.unlocked }"
          >
            <div class="achievement-icon">
              <i :class="achievement.icon"></i>
            </div>
            <div class="achievement-info">
              <h3>{{ achievement.name }}</h3>
              <p class="achievement-desc">{{ achievement.description }}</p>
              <div v-if="!achievement.unlocked && achievement.progress !== undefined" class="achievement-progress">
                <div class="progress-bar" :style="{ width: `${achievement.progress}%` }"></div>
                <span class="progress-text">{{ achievement.progress }}%</span>
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
  name: 'GamificationPage',
  data() {
    return {
      // Streak data
      currentStreak: 5,
      longestStreak: 12,
      streakCalendar: [
        { name: 'M', completed: true, isToday: false, isFuture: false },
        { name: 'T', completed: true, isToday: false, isFuture: false },
        { name: 'W', completed: true, isToday: false, isFuture: false },
        { name: 'T', completed: true, isToday: false, isFuture: false },
        { name: 'F', completed: false, isToday: true, isFuture: false },
        { name: 'S', completed: false, isToday: false, isFuture: true },
        { name: 'S', completed: false, isToday: false, isFuture: true }
      ],
      dailyProgress: 66,
      
      // Leaderboard data
      currentLeaderboardTab: 'weekly',
      leaderboardTabs: [
        { id: 'weekly', name: 'This Week' },
        { id: 'monthly', name: 'This Month' },
        { id: 'allTime', name: 'All Time' }
      ],
      leaderboardData: [
        { 
          id: 1, 
          name: 'Sarah Kim', 
          isCurrentUser: false, 
          avatarColor: '#4CAF50',
          scores: { weekly: 285, monthly: 1240, allTime: 5430 }
        },
        { 
          id: 2, 
          name: 'Alex Taylor', 
          isCurrentUser: false, 
          avatarColor: '#2196F3',
          scores: { weekly: 270, monthly: 1170, allTime: 4980 }
        },
        { 
          id: 3, 
          name: 'You', 
          isCurrentUser: true, 
          avatarColor: '#9C27B0',
          scores: { weekly: 220, monthly: 950, allTime: 3750 }
        },
        { 
          id: 4, 
          name: 'Mike Johnson', 
          isCurrentUser: false, 
          avatarColor: '#FF9800',
          scores: { weekly: 210, monthly: 920, allTime: 3420 }
        },
        { 
          id: 5, 
          name: 'Emma Chen', 
          isCurrentUser: false, 
          avatarColor: '#F44336',
          scores: { weekly: 195, monthly: 840, allTime: 3120 }
        },
        { 
          id: 6, 
          name: 'David Müller', 
          isCurrentUser: false, 
          avatarColor: '#009688',
          scores: { weekly: 185, monthly: 790, allTime: 2950 }
        },
        { 
          id: 7, 
          name: 'Sophie Martinez', 
          isCurrentUser: false, 
          avatarColor: '#795548',
          scores: { weekly: 170, monthly: 720, allTime: 2730 }
        }
      ],
      
      // Achievements data
      achievements: [
        {
          id: 1,
          name: 'First Study Buddy',
          description: 'Make your first match with a study partner',
          icon: 'fas fa-handshake',
          unlocked: true
        },
        {
          id: 2,
          name: '7 Day Streak',
          description: 'Use LeTo for 7 consecutive days',
          icon: 'fas fa-calendar-check',
          unlocked: false,
          progress: 71 // 5 out of 7 days = ~71%
        },
        {
          id: 3,
          name: 'Study Group',
          description: 'Form a study group with 3+ students',
          icon: 'fas fa-users',
          unlocked: true
        },
        {
          id: 4,
          name: 'Perfect Score',
          description: 'Get 100% on a practice quiz',
          icon: 'fas fa-star',
          unlocked: false,
          progress: 80
        },
        {
          id: 5,
          name: 'Knowledge Seeker',
          description: 'Study 5 different subjects',
          icon: 'fas fa-book',
          unlocked: false,
          progress: 60
        },
        {
          id: 6,
          name: 'Top of the Class',
          description: 'Reach #1 on the weekly leaderboard',
          icon: 'fas fa-crown',
          unlocked: false
        }
      ]
    }
  },
  computed: {
    filteredLeaderboard() {
      return [...this.leaderboardData].sort((a, b) => {
        return b.scores[this.currentLeaderboardTab] - a.scores[this.currentLeaderboardTab];
      });
    }
  },
  methods: {
    completeActivity() {
      // Simulate completing a study activity
      if (this.dailyProgress < 100) {
        this.dailyProgress = Math.min(100, this.dailyProgress + 33);
        
        // If progress reaches 100%, mark today as completed
        if (this.dailyProgress === 100) {
          const todayIndex = this.streakCalendar.findIndex(day => day.isToday);
          if (todayIndex !== -1) {
            this.streakCalendar[todayIndex].completed = true;
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* Import Font Awesome locally if installed, otherwise use CDN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main container styling */
.gamification-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--mint) 0%, var(--spearmint) 100%);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header Styles */
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

.home-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 125, 127, 0.25);
}

/* Gamification Container */
.gamification-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gamification-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(22, 125, 127, 0.15);
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.section-title {
  color: var(--teal-green);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid var(--mint-light);
  padding-bottom: 0.75rem;
}

/* Streak Card Styles */
.streak-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.streak-count {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FF9B21, #FF5722);
  border-radius: 50%;
  color: white;
  box-shadow: 0 6px 15px rgba(255, 87, 34, 0.3);
  flex-shrink: 0;
}

.streak-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.streak-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.streak-text {
  font-size: 1.1rem;
  color: var(--teal-green);
}

/* Streak Calendar */
.streak-calendar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.day-name {
  font-size: 0.9rem;
  color: #666;
}

.day-icon {
  font-size: 1.5rem;
}

.day-completed .day-icon {
  color: #4CAF50;
}

.day-today .day-icon {
  color: #FF9800;
}

.day-future .day-icon {
  color: #BBBBBB;
}

/* Daily Goal */
.daily-goal {
  background-color: #f5f9fa;
  padding: 1rem;
  border-radius: 12px;
}

.daily-goal h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--teal-green);
  font-size: 1.1rem;
}

.progress-container {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 1rem;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--teal-light), var(--teal-green));
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -1.5rem;
  font-size: 0.9rem;
  color: var(--teal-green);
  font-weight: bold;
}

.btn-activity {
  background: linear-gradient(135deg, var(--teal-light), var(--teal));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  width: 100%;
  justify-content: center;
}

.btn-activity:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.3);
}

.btn-activity:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Leaderboard Styles */
.leaderboard-tabs {
  display: flex;
  margin-bottom: 1.25rem;
  background-color: #f5f9fa;
  border-radius: 8px;
  padding: 0.3rem;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--teal-green);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: linear-gradient(135deg, var(--teal-light), var(--teal));
  color: white;
  font-weight: 600;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 70px 1fr 80px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--teal-green);
  border-bottom: 1px solid #e0e0e0;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: 70px 1fr 80px;
  padding: 0.75rem 1rem;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.leaderboard-item:hover {
  background-color: #f9f9f9;
}

.leaderboard-item.current-user {
  background-color: rgba(22, 125, 127, 0.1);
  font-weight: 600;
}

.leaderboard-item.top-three {
  background-color: #f5f9fa;
}

.medal {
  font-size: 1.5rem;
}

.gold {
  color: #FFD700;
}

.silver {
  color: #C0C0C0;
}

.bronze {
  color: #CD7F32;
}

.rank {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: #555;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}

.user-score {
  font-weight: 600;
  text-align: right;
  color: var(--teal-green);
}

/* Achievements Styles */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.achievement-item {
  background-color: #f5f9fa;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.achievement-unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #f5f9fa, #e6f7f8);
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.1);
}

.achievement-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--teal-light), var(--teal));
  color: white;
  border-radius: 10px;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 0.4rem 0;
  font-size: 1rem;
  color: var(--teal-green);
}

.achievement-desc {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #666;
}

.achievement-progress {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  position: relative;
}

.achievement-progress .progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--teal-light), var(--teal));
  border-radius: 3px;
}

.achievement-progress .progress-text {
  position: absolute;
  right: 0;
  top: -1.25rem;
  font-size: 0.8rem;
  color: var(--teal-green);
}

/* Responsive Design */
@media (max-width: 768px) {
  .streak-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .app-header {
    flex-direction: row;
    gap: 0.5rem;
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
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .streak-count {
    width: 80px;
    height: 80px;
  }
  
  .streak-number {
    font-size: 2rem;
  }
  
  .leaderboard-header, .leaderboard-item {
    grid-template-columns: 50px 1fr 70px;
    padding: 0.75rem 0.5rem;
  }
  
  .tab-button {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style>
