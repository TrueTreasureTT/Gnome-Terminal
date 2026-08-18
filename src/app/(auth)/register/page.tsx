'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function RegisterPage(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Useradd failed: Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Useradd failed: Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Useradd failed: Process exited with error.');
        setLoading(false);
        return;
      }

      setSuccess('User created successfully. Initializing session redirect...');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError('An unexpected system error occurred. Process terminated.');
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-terminal-secondary bg-black/90 shadow-lg">
      <div className="mb-6">
        <p className="text-terminal-secondary font-mono text-sm mb-4">$ useradd --create-home</p>
        <h2 className="text-2xl font-bold text-terminal-primary font-mono">Create Account</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-500 rounded font-mono text-xs text-red-400">
          [ERROR] {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-950/50 border border-terminal-primary rounded font-mono text-xs text-terminal-primary">
          [SUCCESS] {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Username</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            required
            className="bg-black text-terminal-primary border-terminal-secondary/50 focus:border-terminal-secondary font-mono"
          />
        </div>

        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
            className="bg-black text-terminal-primary border-terminal-secondary/50 focus:border-terminal-secondary font-mono"
          />
        </div>

        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-black text-terminal-primary border-terminal-secondary/50 focus:border-terminal-secondary font-mono"
          />
        </div>

        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-black text-terminal-primary border-terminal-secondary/50 focus:border-terminal-secondary font-mono"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-terminal-secondary hover:bg-terminal-primary text-black font-mono font-bold transition-colors"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-terminal-secondary/30">
        <p className="text-terminal-fg/60 font-mono text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-terminal-secondary hover:text-terminal-primary underline">
            Login here
          </Link>
        </p>
      </div>
    </Card>
  );
}
