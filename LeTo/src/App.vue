<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Ensure html and body take full space */
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Global app styles */
#app {
  min-height: 100vh;
  width: 100%;
  font-family: 
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Remove default margins and padding */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Global button reset */
button {
  font-family: inherit;
  cursor: pointer;
}

/* Global input styles */
input, select, textarea {
  font-family: inherit;
}

/* Accessibility improvements */
:focus {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--mint);
}

::-webkit-scrollbar-thumb {
  background: var(--spearmint);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--teal);
}
</style>
