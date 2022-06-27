import React, {useState, useEffect} from 'react';
import Input from '../components/input';
import {WithUserProps} from '../App';

interface LoginData {
    userName: string,
    password: string
}

async function postLoginData(data: {username: string; password: string}){
    const response = await fetch('http://localhost:4000/login', {
        credentials: 'include',
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}

const Login = ({user}: WithUserProps) => {
    useEffect(() => {
        if (user?.id) {
            window.location.href = '/'
        }
    }, [])
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [alertLevel, setAlertLevel] = useState<string>('');
    const [alertMessage, setAlertMessage] =useState<string>('');
    const validateInfo = (e: React.FormEvent<HTMLFormElement>, {userName, password}: LoginData) => {
        e.preventDefault();
        if(userName === '') {
            setAlertMessage('Please enter a username');
        } else if(password === '') {
            setAlertMessage('Please enter a password');
        } else {
            onSubmit({userName, password});
        }

    }
    const onSubmit = ({userName, password}: LoginData) => {
        const data = {
            username: userName,
            password
        };
        postLoginData(data)
        .then(data => {
            switch(data.status) {
                case 204:
                    window.location.href = '/';
                    break;
                case 403:
                    setAlertMessage('Username or password is incorrect');
                    break;
                default:
                    setAlertMessage('Login error, please try again');
                    break;
            }
        })
        .catch(error => {
            console.log(error);
            setAlertMessage('Login error, please try again');
        });
    }
    return (
        <div className="Login">
            <h1>Login</h1>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => validateInfo(e, {userName, password})}>
                <label htmlFor="userName">Username</label>
                <Input type="text" name="userName" required onChange={(e: React.FormEvent<HTMLInputElement>) => setUserName((e.target as HTMLInputElement).value)} />
                <label htmlFor="password">Password</label>
                <Input type="text" name="password" required onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)} />
                <input type="submit"/>
            </form>
            {alertMessage &&
                <div>
                    <span>{alertMessage}</span>
                </div>
            }
        </div>
    );
}

export default Login
