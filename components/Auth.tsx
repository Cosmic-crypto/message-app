import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User } from '../types';

interface AuthProps {
    onAuthSuccess: (user: User) => void;
}

type UserCredentials = Record<string, { password: string }>;

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useLocalStorage<UserCredentials>('users', {});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        if (isLogin) {
            const user = users[email];
            if (user && user.password === password) {
                onAuthSuccess({ email });
            } else {
                setError('Invalid email or password.');
            }
        } else { // Sign Up
            if (users[email]) {
                setError('User with this email already exists.');
            } else {
                setUsers(prev => ({ ...prev, [email]: { password } }));
                onAuthSuccess({ email });
            }
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in-up">
                <h1 className="text-3xl font-bold text-center text-white mb-2">Gemini Messenger</h1>
                <p className="text-center text-gray-400 mb-8">{isLogin ? 'Welcome back!' : 'Create your account'}</p>

                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-900 border border-red-700 text-red-300 text-sm p-3 rounded-lg mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-blue-400 hover:text-blue-500 ml-2">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
