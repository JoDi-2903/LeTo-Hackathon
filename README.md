# LeTo - Learn Together

## Overview

LeTo (Learn Together) is an educational platform designed to connect students for collaborative learning. The app facilitates finding study partners, forming study groups, accessing educational resources, and tracking learning progress through gamification elements.

## Features

### Study Partner Matching
- Swipe-based interface to find compatible study partners
- Filtering options by subject, learning topics, age, gender, rating, and region
- Detailed student profiles with learning preferences and availability

### Learning Groups
- Create and join study groups based on academic interests
- View private groups you're part of and discover public learning communities
- Schedule and manage group study sessions

### Course Management
- Access courses from multiple learning platforms in one place
- Track course progress and completion status
- Discover recommended courses based on your profile and interests
- Connect with external learning platforms (Coursera, edX, LinkedIn Learning, etc.)

### Gamification
- Daily learning streak tracking
- Achievement system for learning milestones
- Competitive leaderboards (weekly, monthly, all-time)
- Progress visualization and goal setting

### User Profiles
- Academic profile creation with university verification
- Customizable interests and study preferences
- Learning style and availability management

## Screenshots
<img width="3921" height="2334" alt="Picture2" src="https://github.com/user-attachments/assets/42ca60d8-ce44-4ca1-a05a-0d98e3493908" />



## Usage Guide

### Finding Study Partners
Navigate to the Home page to view potential study partners. Use the filter button to set preferences by subject, learning topics, age range, and more. Swipe right on profiles you're interested in studying with, or left to pass.

### Managing Learning Groups
Access the Groups & Courses page to view your existing study groups, join public groups, or create new ones. Each group displays meeting frequency and member information.

### Accessing Courses
The Courses section provides access to your enrolled courses and recommendations. Connect with external learning platforms to import your courses and track progress in one place.

### Tracking Progress
The Gamification page shows your learning streak, daily goals, achievements, and position on leaderboards. Complete learning activities to maintain your streak and earn achievements.

### Setting Up Your Profile
Fill out your profile with academic information, interests, and a profile picture. A valid university email is required for verification.


## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/LeTo.git
   cd LeTo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run serve
   ```

4. Build for production:
   ```
   npm run build
   ```

## Technical Stack

- **Frontend Framework**: Vue.js
- **Styling**: CSS with responsive design
- **Icons**: Font Awesome
- **State Management**: Vue's built-in reactivity system
- **Routing**: Vue Router


## Project Structure

```
LeTo/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── students.json
│   ├── views/
│   │   ├── HomePage.vue          # Study partner matching interface
│   │   ├── GroupsCoursesPage.vue # Learning groups and courses
│   │   ├── GamificationPage.vue  # Streaks, achievements, leaderboards
│   │   └── ProfilePage.vue       # User profile management
│   ├── App.vue
│   └── main.js
├── public/
│   └── images/
│       └── app_logo_no_text.png
└── ...
```

---

*LeTo - Connecting students for better learning outcomes*
