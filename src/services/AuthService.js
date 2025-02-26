// services/AuthService.js
class AuthService {
  static login(username, password) {
    // Call your backend authentication API
    return fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        // Store authentication token
        localStorage.setItem('authToken', data.token);
        return data;
      });
  }

  static logout() {
    localStorage.removeItem('authToken');
  }

  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    // Add additional token validation if needed
    return !!token;
  }
}

export default AuthService;
