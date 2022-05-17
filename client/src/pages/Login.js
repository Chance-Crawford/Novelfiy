import { useState } from 'react';

import SignupImg from '../images/Signup.svg'

function Login() {
    const [formTabState, setFormTabState] = useState("Login");

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
                                    <div className='mt-3'>
                                        <button className='btn login-submit' type='submit'>
                                            Submit
                                        </button>
                                    </div>
                                    
                                </form>
                            </div>
                        ) : (
                            <div>Sign</div>
                        )}
                    </div>
                </div>
            </div>
            
            
        </section>
    );
}

export default Login;