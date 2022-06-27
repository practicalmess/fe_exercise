import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import Home from './pages/Home'
import InterstateTrade from './pages/InterstateTrade'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StateEconomySearch from './pages/StateEconomySearch'
import StateSearch from './pages/StateSearch'

export interface User {
    id: number
}

export interface WithUserProps {
    user: User | null
}

function App() {
    const [sessionUser, setSessionUser] = useState<User | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:4000/session', {
                credentials: 'include',
            })
            const user = await response.json()
            if (user?.id) {
                setSessionUser(user)
            }
        }
        fetchData()
    }, []);
    const userProps: WithUserProps = {
        user: sessionUser
    }
    return (
        <Router>
            <div className="App" style={{ margin: '1rem' }}>
                <header className="App-header">
                    <h1>Focus Frontend Interview Exercise</h1>
                </header>
                <nav
                    style={{
                        borderBottom: 'solid 1px',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    <Link to="/">Home</Link>|{' '}
                    <Link to="/states">States Search Example</Link>|{' '}
                    <Link to="/trade">Interstate Trade Search</Link>|{' '}
                    <Link to="/economy">State Economy Search</Link>|{' '}
                    <Link to="/login">Login</Link> |{' '}
                    <Link to="/signup">Signup</Link> |{' '}
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/states" element={<StateSearch {...userProps} />} />
                    <Route path="/trade" element={<InterstateTrade {...userProps} />} />
                    <Route path="/economy" element={<StateEconomySearch {...userProps} />} />

                    <Route path="/login" element={<Login {...userProps} />} />
                    <Route path="/signup" element={<Signup {...userProps} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
