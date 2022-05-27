import { useState } from 'react';

import SignupImg from '../images/Signup.svg'

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';
import { ADD_USER, LOGIN_USER } from '../utils/mutations';

function Login() {
    // the tab state to figure out which tab the user clicked on.
    const [formTabState, setFormTabState] = useState("Login");
    

    // state of the login form
    const [loginFormState, setLoginFormState] = useState({ email: '', password: '' });
    const [login, { error: loginError }] = useMutation(LOGIN_USER);
    const handleLoginChange = (event) => {
        // get name and value of input element from the event.target
        let { name, value } = event.target;

        // if it is an email make sure it is all lowercase
        if(name === 'email'){
            value = value.toLowerCase().trim();
        }
    
        setLoginFormState({
          ...loginFormState,
          [name]: value.trim(),
        });
    };
    const handleLoginFormSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const { data } = await login({
            variables: { ...loginFormState }
          });
      
          // after user data is returned, get the user's login json web token
          // and use the custom Auth object to add the token to the 
          // local storage.
          // Auth.login then redirects the page to home.
          Auth.login(data.login.token);
        } catch (e) {
          console.error(e);
          return;
        }
    
        // clear form values
        setLoginFormState({
          email: '',
          password: '',
        });
    };


    // state of the signup form
    const [signupFormState, setSignupFormState] = useState({ username: '', email: '', password: '' });
    const [addUser, { error }] = useMutation(ADD_USER);
    const handleSignupChange = (event) => {
        // get name and value of input element from the event.target
        let { name, value } = event.target;

        // if it is an email make sure it is all lowercase
        if(name === 'email'){
            value = value.toLowerCase().trim();
        }
    
        setSignupFormState({
          ...signupFormState,
          // remove extra whitespace
          [name]: value.replace(/ +/g, ' ').trim(),
        });
    };
    // submit signup form
    const handleSignupFormSubmit = async (event) => {
        event.preventDefault();

        try {
        const { data } = await addUser({
            // and pass in variable data from form
            variables: { ...signupFormState }
        });

        // after user data is returned, get the user's json web token
        // and use the custom Auth object to add the token to the 
        // local storage.
        Auth.login(data.addUser.token);
        } 
        catch (e) {
        console.error(e);
        return;
        }
    };


    return (
        <section className="login-section w-100">
            <div className='d-flex align-items-center justify-content-between'>
                <div className='login-divs'>
                    <img src={SignupImg} alt="sign up illustration" />
                </div>
                <div className='login-divs login-contain'>
                    <div className="login-header-contain">
                        <div className={formTabState === 'Login' ? 'p-1 login-header login-header-active' : 'p-1 login-header'}
                        onClick={() => setFormTabState('Login')}>
                            <h3 className='m-0'>Login</h3>
                        </div>
                        <div className={formTabState === 'Sign Up' ? 'p-1 login-header login-header-active' : 'p-1 login-header'}
                        onClick={() => setFormTabState('Sign Up')}>
                            <h3 className='m-0'>Sign Up</h3>
                        </div>
                    </div>
                    <div className='login-body-contain'>
                        {formTabState === 'Login' ? (
                            <div>
                                <form className='info-form' onSubmit={handleLoginFormSubmit}>
                                    {loginError && (
                                            <div className='new-here'>
                                                New here? Press the sign up tab above to create an account
                                            </div>
                                    )}
                                    <div className='d-flex flex-wrap'>
                                        <label htmlFor="email" className='bold w-100'>Email:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='Your email'
                                            name='email'
                                            type='email'
                                            id='email'
                                            onChange={handleLoginChange}
                                        />
                                    </div>
                                    <div className='d-flex flex-wrap mt-4'>
                                        <label htmlFor="password" className='bold w-100'>Password:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='******'
                                            name='password'
                                            type='password'
                                            id='password'
                                            onChange={handleLoginChange}
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <button className='btn login-submit' type='submit'>
                                            Login
                                        </button>
                                    </div>
                                    {loginError && (
                                            <div className='err-text'>
                                                The email or password entered was incorrect.
                                            </div>
                                    )}
                                    
                                </form>
                            </div>
                        ) : (
                            <div>
                                <form className='info-form' onSubmit={handleSignupFormSubmit}>
                                    <div className='d-flex flex-wrap'>
                                        <label htmlFor="username" className='bold w-100'>Username:</label>
                                        {/* pattern contains regex for not allowing spaces or tabs.
                                        title changes message that appears when the pattern is not met */}
                                        <input
                                            className='form-input mt-2 username-input'
                                            placeholder='Your username'
                                            name='username'
                                            type='text'
                                            id='username'
                                            pattern='^\S+\w\S{1,}'
                                            title='Username can not have any spaces, tabs, or special characters'
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                    {/* username is required */}
                                    {error && error.message.includes('required') && error.message.includes('username') && (
                                            <div className='err-text'>
                                                Please enter a username.
                                            </div>
                                    )}
                                    {/* username already exists */}
                                    {error && error.message.includes('E11000') && error.message.includes('username') && (
                                            <div className='err-text'>
                                                This username is already taken. Please choose another.
                                            </div>
                                    )}
                                    <div className='d-flex flex-wrap mt-4'>
                                        <label htmlFor="email" className='bold w-100'>Email:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='Your email'
                                            name='email'
                                            type='email'
                                            id='email'
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                    {error && error.message.includes('E11000') && error.message.includes('email') && (
                                            <div className='err-text'>
                                                This email already exists in Novelfiy. Please choose another.
                                            </div>
                                    )}
                                    <div className='d-flex flex-wrap mt-4'>
                                        <label htmlFor="password" className='bold w-100'>Password:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='******'
                                            name='password'
                                            type='password'
                                            id='password'
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                    {error && error.message.includes('password') && error.message.includes('shorter') && (
                                            <div className='err-text'>
                                                Password is too short. Please make a password of at least 5 characters
                                            </div>
                                    )}
                                    <div className='mt-4'>
                                        <button className='btn login-submit' type='submit'>
                                            Sign Up
                                        </button>
                                    </div>   
                                </form>

                                {error && <div>Sign up failed</div>}
                    </div>
                        )}
                    </div>
                </div>
            </div>
            
            
        </section>
    );
}

export default Login;