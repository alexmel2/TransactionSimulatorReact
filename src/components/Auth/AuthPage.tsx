import React, { useState } from 'react';
import { authService } from '../../services/authService';

interface AuthPageProps {
    onAuthSuccess: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            if (isLogin) {
                const data = await authService.login(username, password);
                // שליחת הטוקן לרכיב האב (App.tsx) - תתאים ל-data.token במידת הצורך
                onAuthSuccess(data.token || data); 
            } else {
                await authService.register(username, email, password);
                alert("Account created successfully! Please sign in.");
                setIsLogin(true); // מעבר אוטומטי למסך התחברות
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            setErrorMessage(error.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center px-6 font-sans">
            <div className="text-4xl font-black italic text-[#00a3e0] tracking-tighter mb-8">
                shva<span className="text-gray-200">.</span>simulator
            </div>

            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-[#2D1F5B] tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {isLogin ? 'Enter your details to access the simulator' : 'Sign up to start simulating transactions'}
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-5 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-xl">
                        ⚠️ {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B61FF] bg-gray-50/50 text-[#2D1F5B]"
                                placeholder="alex@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B61FF] bg-gray-50/50 text-[#2D1F5B]"
                            placeholder="alex_melnik"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B61FF] bg-gray-50/50 text-[#2D1F5B]"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 bg-[#7B61FF] text-white font-bold rounded-xl shadow-md transition-all transform mt-4 ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#684ee3] hover:-translate-y-0.5'
                        }`}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
                    <span className="text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setErrorMessage(null); }}
                        className="text-[#7B61FF] font-bold hover:underline bg-transparent border-none p-0"
                        disabled={isLoading}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};