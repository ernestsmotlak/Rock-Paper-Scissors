// import { json } from 'express';
import React from 'react'
import { useState } from 'react';
import { NavigationType, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = ({ setUuid, setBtnInLoginClicked, setUsernameFromLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccessful, setLoginccessful] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://84.247.184.37:3020/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoginccessful(errorData.loginStatus);
                console.log('Prvi Login status: ' + loginSuccessful);
                throw new Error(errorData.error);
            }

            const data = await response.json();
            setLoginccessful(data.loginStatus);
            console.log(username + ' login was successful!');

            setUuid(data.uniqueUserID);
            setUsernameFromLogin(data.usernameLogin);

            localStorage.setItem('usernameFromLogin', data.usernameLogin);
            localStorage.setItem('uuid', data.uniqueUserID); // Store uuid in localStorage
            localStorage.setItem('btnInLoginClicked', 'true');
            console.log('Ls uuid: ' + localStorage.getItem('uuid'));
            console.log('Ls btn: ' + localStorage.getItem('btnInLoginClicked'));

            setBtnInLoginClicked(true);
            navigate(`/username/${data.uniqueUserID}`);



        }
        catch (error) {
            setError(error.message);
            setLoginccessful(error.loginStatus);
            console.log('Tretjic Login status: ' + loginSuccessful);
        }

    };


    return (
        <div>
            <h2 className='header mt-5 mb-4'>Login</h2>
            <form className='container login-form w-25'
                onSubmit={handleSubmit}
                style={{ backgroundColor: '#e5e5e5', borderColor: '#cdcccd', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px' }}>
                <div className='row justify-content-center'>
                    <label className='form-label mt-3' style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Insert your username:</label>
                    <input className='form-control-lg w-75 mb-3 login-form' style={{ backgroundColor: '#F7F7F7' }} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='row justify-content-center'>
                    <label className='form-label' style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Insert you password:</label>
                    <input className='form-control-lg w-75 login-form' style={{ backgroundColor: '#F7F7F7' }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='btn btn-secondary mt-3 mb-3' type='submit'>Login.</button>
            </form>
            <br />
            {error && <span className='text-danger fw-bold fs-3 mb-3'>{error}</span>}
            <div className="text-center p-3 fixed-bottom"
                // style={{ backgroundColor: '#e5e5e5' }}
                style={{ backgroundColor: '#e5e5e5', borderColor: '#cdcccd', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px' }}>
                Code available at:
                &nbsp;
                <a className="text-dark" href="https://github.com/ernestsmotlak/WarCardGame">
                    {/* <i className="bi bi-github" style={{ width: '20px', height: '20px' }}></i> */}
                    <svg style={{ width: '20px', height: 'auto', marginBottom: '3px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                    </svg>

                </a>
            </div>
        </div>
    )
}

export default Login