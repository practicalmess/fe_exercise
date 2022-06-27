import React, {useState, useEffect} from 'react'
import Input from '../components/input';
import {WithUserProps} from '../App';

interface SignupData {
    userName: string,
    password: string,
    confirmPassword: string
}

async function postSignupData(data: {username: string; password: string}){
    const response = await fetch('http://localhost:4000/signup', {
        credentials: 'include',
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}



const onSubmit = ({userName, password}: SignupData) => {
    const data = {
        username: userName,
        password
    };
    postSignupData(data).then(data => console.log(data)).catch(error => console.log(error));
}

const Signup = ({user}: WithUserProps) => {
    useEffect(() => {
        if (user?.id) {
            window.location.href = '/'
        }
    }, [])
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [alertLevel, setAlertLevel] = useState<string>('');
    const [alertMessage, setAlertMessage] =useState<string>('');
    const validateInfo = (e: React.FormEvent<HTMLFormElement>, {userName, password, confirmPassword}: SignupData) => {
        e.preventDefault();
        if(userName === '') {
            setAlertMessage('Please enter a username');
        } else if(password === '') {
            setAlertMessage('Please enter a password');
        } else if(password !== confirmPassword) {
            setAlertMessage('Passwords do not match')
        } else {
            onSubmit({userName, password, confirmPassword});
        }

    }
    return (
        <div className="Signup">
            <h1>Signup</h1>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => validateInfo(e, {userName, password, confirmPassword})}>
                <label htmlFor="userName">Username</label>
                <Input type="text" name="userName" required onChange={(e: React.FormEvent<HTMLInputElement>) => setUserName((e.target as HTMLInputElement).value)} />
                <label htmlFor="password">Password</label>
                <Input type="text" name="password" required onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)} />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Input type="text" name="confirmPassword" required onChange={(e: React.FormEvent<HTMLInputElement>) => setConfirmPassword((e.target as HTMLInputElement).value)} />
                <input type="submit"/>
            </form>
            <div className={`Signup-alert${alertLevel}`}>
                <span>{alertMessage}</span>
            </div>
        </div>
    );
}
export default Signup
