// Test if your backend is accessible
// Run this in browser console on your Vercel site

console.log('🔍 Testing Backend Connection...');
console.log('Current API URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

// Test backend health
fetch(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000')
  .then(res => res.text())
  .then(data => {
    console.log('✅ Backend Response:', data);
    console.log('✅ Backend is reachable!');
  })
  .catch(err => {
    console.error('❌ Backend Connection Failed:', err.message);
    console.log('Check if:');
    console.log('1. Backend URL is correct');
    console.log('2. Backend is running on Render');
    console.log('3. CORS is configured properly');
  });
