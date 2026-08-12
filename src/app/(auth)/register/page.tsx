'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Card className="p-6 border-2 border-terminal-secondary">
      <div className="mb-6">
        <p className="text-terminal-secondary font-mono text-sm mb-4">$ useradd --create-home</p>
        <h2 className="text-2xl font-bold text-terminal-primary font-mono">Create Account</h2>
      </div>

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
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-terminal-secondary hover:bg-terminal-primary text-black font-mono font-bold"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-terminal-secondary/30">
        <p className="text-terminal-fg/60 font-mono text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-terminal-secondary hover:text-terminal-primary">
            Login here
          </Link>
        </p>
      </div>
    </Card>
  );
}
