
<template>
  <div class="profile-page">
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

    <!-- Profile Form -->
    <div class="profile-container">
      <div class="profile-card">
        <h2 class="profile-title">Your Profile</h2>
        
        <form class="profile-form" @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="name">
              <i class="fas fa-user"></i> Name
            </label>
            <input 
              type="text" 
              id="name" 
              v-model="profile.name" 
              placeholder="Enter your name"
              required 
            >
          </div>
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i> Email
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="profile.email" 
              placeholder="Enter your university email"
              required @input= "loginError = ''"
            >
          </div>
          <div class="form-group">
            <label for="yearBranch">
              <i class="fas fa-graduation-cap"></i> Year/Branch
            </label>
            <input 
              type="text" 
              id="yearBranch" 
              v-model="profile.yearBranch" 
              placeholder="e.g. 2nd Year, Computer Science"
            >
          </div>
          <div class="form-group">
            <label for="bio">
              <i class="fas fa-info-circle"></i> Short Bio
            </label>
            <textarea 
              id="bio" 
              v-model="profile.bio" 
              rows="5"
              style="width: 100%;"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="photo">
              <i class="fas fa-image"></i> Profile Picture
            </label>
            <input 
              type="file" 
              id="photo"
              accept="image/*"
              @change="onPhotoChange"
            >
            <img
              v-if="profile.photo"
              :src="profile.photo"
              alt="Profile Picture"
              class="profile-picture"
            />
          </div>
          
      <div class="form-group">
        <label>
          <i class="fas fa-star"></i> Interests
        </label>
        <div style="margin-bottom: 10px;">
          <input
            v-model="newInterest"
            @keyup.enter="addCustomInterest"
            placeholder="Add custom interest..."
            style="width: 70%; padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc;"
          />
          <button type="button" @click="addCustomInterest" style="padding: 0.5rem 1rem; border-radius: 6px; border: none; background: var(--teal-green); color: white; margin-left: 8px;">
            Add
          </button>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
          <span
            v-for="(interest, idx) in suggestedInterests"
            :key="'suggested-' + idx"
            @click="toggleInterest(interest)"
            :style="{
              background: profile.interests.includes(interest) ? 'var(--teal-green)' : '#f0f0f0',
              color: profile.interests.includes(interest) ? 'white' : '#222',
              borderRadius: '16px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '14px'
            }"
          >
            {{ interest }}
          </span>
        </div>
        <div v-if="profile.interests.length > 0" style="margin-top: 8px;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <span
              v-for="(interest, idx) in profile.interests"
              :key="'selected-' + idx"
              style="background: var(--teal-green); color: white; border-radius: 16px; padding: 6px 14px; font-size: 14px; display: flex; align-items: center;"
            >
              {{ interest }}
              <span @click="removeInterest(interest)" style="margin-left: 8px; cursor: pointer; font-weight: bold;">×</span>
            </span>
          </div>
        </div>
      </div>
      <div class="form-actions">
            <button type="submit" class="btn-primary">
              Update Profile
            </button>
          </div>
          <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const UNIVERSITY_DOMAINS = ['university.edu', 'college.edu'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import { useToast } from 'vue-toastification'
const toast = useToast()


export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
         name: '',
        email: '',
        yearBranch: '',
        bio: '',
        photo: '',
        interests:[]
      },
       suggestedInterests: [
      'Machine Learning',
      'Web Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
      'Mathematics',
      'Physics',
      'Biology',
      'Economics'
    ],
      loginError: ''
    }
  },

  methods: {
    
    validateEmail() {
      if (!emailRegex.test(this.profile.email)) return false;
      const domain = this.profile.email.split('@')[1].trim().toLowerCase();
      return UNIVERSITY_DOMAINS.includes(domain);
    },
    updateProfile() {
      try {
        if (!this.validateEmail()) {
          toast.error('Please use a valid university email address.')
          return;
        }
        this.loginError = '';
        // ...rest of your logic
        console.log('Profile updated:', this.profile);
        //alert('Profile updated successfully!');
        toast.success('Profile updated successfully!')
      } catch (err) {
        toast.error('An unexpected error occurred.')
        //this.loginError = 'An unexpected error occurred.';
        console.error(err);
      }
      },
    toggleInterest(interest) {
    const idx = this.profile.interests.indexOf(interest);
    if (idx === -1) {
      this.profile.interests.push(interest);
    } else {
      this.profile.interests.splice(idx, 1);
    }
  },
  addCustomInterest() {
    const trimmed = this.newInterest.trim();
    if (trimmed && !this.profile.interests.includes(trimmed)) {
      this.profile.interests.push(trimmed);
      if (!this.suggestedInterests.includes(trimmed)) {
        this.suggestedInterests.push(trimmed);
      }
      this.newInterest = '';
    }
  },
  removeInterest(interest) {
    const idx = this.profile.interests.indexOf(interest);
    if (idx !== -1) {
      this.profile.interests.splice(idx, 1);
    }
  }
  }
}

</script>

<style scoped>
/* Import Font Awesome locally if installed, otherwise use CDN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main container styling */
.profile-page {
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

/* Profile Container */
.profile-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(22, 125, 127, 0.15);
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
}

.profile-title {
  color: var(--teal-green);
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
}

/* Form Styles */
.profile-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--teal-green);
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--spearmint);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--teal);
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  background: linear-gradient(135deg, var(--teal-green), var(--teal));
  color: white;
  min-width: 180px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(22, 125, 127, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-card {
    padding: 1.5rem;
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
  
  .profile-card {
    padding: 1rem;
  }
  
  .profile-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .form-actions {
    margin-top: 1.5rem;
  }
  .error-message {
  color: #c0392b;
  background: #c0392b;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}
}
</style>
