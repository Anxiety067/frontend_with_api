import React, { useState } from 'react';
import backgroundLeft from '../images/backImg.jpg';
import backgroundRight from '../images/frontImg.jpg';
import AuthService from './AuthService';
import './LoginSignup.css';

const LoginSignup = () => {
  const [isActive, setIsActive] = useState(false);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    billing_address: '',
    user_type: 'individual',
    organization_name: ''
  });
  const [signupError, setSignupError] = useState('');

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await AuthService.login(loginIdentifier, loginPassword);
      // Handle successful login 
      console.log('Login successful', response);
      // TODO: Implement navigation or state update after successful login
      // history.push('/dashboard') or updateAppState(response)
    } catch (error) {
      setLoginError(error.message || 'Login failed');
    }
  };

  // Handle Signup Submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    try {
      // Destructure and validate required fields
      const { 
        name, 
        email, 
        password, 
        phone_number, 
        billing_address, 
        user_type,
        organization_name 
      } = signupData;
      
      // Comprehensive validation
      const requiredFields = [
        { value: name, message: 'Name is required' },
        { value: email, message: 'Email is required' },
        { value: password, message: 'Password is required' },
        { value: phone_number, message: 'Phone number is required' },
        { value: billing_address, message: 'Billing address is required' }
      ];

      // Check for any empty required fields
      const emptyField = requiredFields.find(field => !field.value);
      if (emptyField) {
        throw new Error(emptyField.message);
      }

      // Additional validation for organization type
      if (user_type === 'organization' && !organization_name) {
        throw new Error('Organization name is required for organization type');
      }

      // Proceed with signup
      const response = await AuthService.signup(signupData);
      
      // Handle successful signup
      console.log('Signup successful', response);
      
      // Switch back to login form
      setIsActive(false);
    } catch (error) {
      setSignupError(error.message || 'Signup failed');
    }
  };

  // Handle input changes for signup
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <input 
            type="text" 
            name="name"
            placeholder="Name" 
            value={signupData.name}
            onChange={handleSignupChange}
            required 
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={signupData.email}
            onChange={handleSignupChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={signupData.password}
            onChange={handleSignupChange}
            required 
          />
          <input 
            type="tel" 
            name="phone_number"
            placeholder="Phone Number" 
            value={signupData.phone_number}
            onChange={handleSignupChange}
            required 
          />
          <input 
            type="text" 
            name="billing_address"
            placeholder="Billing Address" 
            value={signupData.billing_address}
            onChange={handleSignupChange}
            required 
          />
          <select 
            name="user_type"
            value={signupData.user_type}
            onChange={handleSignupChange}
          >
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
          </select>
          {signupData.user_type === 'organization' && (
            <input 
              type="text" 
              name="organization_name"
              placeholder="Organization Name" 
              value={signupData.organization_name}
              onChange={handleSignupChange}
              required={signupData.user_type === 'organization'}
            />
          )}
          {signupError && <p style={{color: 'red'}}>{signupError}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <input 
            type="text" 
            placeholder="Email or Phone Number" 
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <a href="/forgot-password">Forget Your Password?</a>
          {loginError && <p style={{color: 'red'}}>{loginError}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div 
            className="toggle-panel toggle-left" 
            style={{
              backgroundImage: `url(${backgroundLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="toggle-content">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button 
                className="hidden" 
                id="login"
                type="button"
                onClick={handleLoginClick}
              >
                Sign In
              </button>
            </div>
          </div>
          <div 
            className="toggle-panel toggle-right"
            style={{
              backgroundImage: `url(${backgroundRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="toggle-content">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button 
                className="hidden" 
                id="register"
                type="button"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;