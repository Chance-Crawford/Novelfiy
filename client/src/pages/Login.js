import { useState } from 'react';

import SignupImg from '../images/Signup.svg'

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';
import { ADD_USER, LOGIN_USER } from '../utils/mutations';

function Login() {
    // the tab state to figure out which tab the user clicked on.
    const [formTabState, setFormTabState] = useState("Login");

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
          [name]: value.trim(),
        });
    };
    // submit signup form
    const handleSignupFormSubmit = async (event) => {
        event.preventDefault();

        // use try/catch instead of promises to handle errors
        // We use the try...catch block functionality here, as it is 
        // especially useful with asynchronous code such as Promises. This way, we 
        // can use async/await instead of .then() and .catch() method-chaining while 
        // still being able to handle any errors that may occur.
        try {
        // execute addUser mutation 
        // Upon success, we destructure the data object from 
        // the response of our mutation and simply log it to see if 
        // we're getting our token.
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
                                <form className='info-form'>
                                    <div className='d-flex flex-wrap'>
                                        <label htmlFor="email" className='bold w-100'>Email:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='Your email'
                                            name='email'
                                            type='email'
                                            id='email'
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
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <button className='btn login-submit' type='submit'>
                                            Login
                                        </button>
                                    </div>
                                    
                                </form>
                            </div>
                        ) : (
                            <div>
                                <form className='info-form' onSubmit={handleSignupFormSubmit}>
                                    <div className='d-flex flex-wrap'>
                                        <label htmlFor="username" className='bold w-100'>Username:</label>
                                        <input
                                            className='form-input mt-2'
                                            placeholder='Your username'
                                            name='username'
                                            type='text'
                                            id='username'
                                            
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                    {error && error.message.includes('E11000') && error.message.includes('username') && (
                                            <div className='err-text'>
                                                This username already exists. Please choose another.
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