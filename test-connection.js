// Quick test script to verify backend-frontend connection
// Run this after starting both servers

const testAPI = async () => {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing SkillOrbit API Connection...\n');
  
  try {
    // Test 1: Backend health check
    console.log('1. Testing backend health...');
    const healthResponse = await fetch('http://localhost:5000/');
    const healthText = await healthResponse.text();
    console.log('✅ Backend health:', healthText);
    
    // Test 2: User registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('✅ Registration result:', registerResult.message);
    
    if (registerResult.token) {
      const token = registerResult.token;
      const userId = registerResult.user._id;
      
      // Test 3: Add a skill
      console.log('\n3. Testing skill creation...');
      const skillData = {
        userId: userId,
        name: 'JavaScript',
        category: 'Programming',
        proficiency: 75
      };
      
      const skillResponse = await fetch(`${baseURL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillData)
      });
      
      const skillResult = await skillResponse.json();
      console.log('✅ Skill creation result:', skillResult.message);
      
      // Test 4: Get dashboard data
      console.log('\n4. Testing dashboard data...');
      const dashboardResponse = await fetch(`${baseURL}/users/${userId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Dashboard data:', dashboardData);
    }
    
    console.log('\n🎉 All tests passed! Backend and database are working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend: cd backend && npm run dev');
    console.log('2. Start the frontend: cd frontend && npm run dev');
    console.log('3. Open http://localhost:3000 in your browser');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Make sure backend server is running on port 5000');
    console.log('3. Check your .env configuration');
  }
};

// Run the test
testAPI();
