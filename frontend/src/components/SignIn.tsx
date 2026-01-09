import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import signin from '../functions/signin';
import { type Sign_In } from '@kunaljprsingh/ecom-types';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

export default function SignInForm() {
    const [formData, setFormData] = useState<Sign_In>({
        email: '',
        password: '',
    });
    const { onLogin } = useAuth()

    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { token, message } = await signin(formData, "user")
        if (!token) {
            toast.error(message);
        } else {
            localStorage.setItem('token', `Bearer ${token}`)
            onLogin();
            navigate("/")
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-700">Remember me</span>
                        </label>
                        <button className="text-sm text-gray-700 hover:text-black">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                    >
                        Sign In
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="text-black font-medium hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}