'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement login logic with NextAuth
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Card className="p-6 border-2 border-terminal-primary">
      <div className="mb-6">
        <p className="text-terminal-primary font-mono text-sm mb-4">$ login --user</p>
        <h2 className="text-2xl font-bold text-terminal-secondary font-mono">Sign In</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-terminal-primary/30">
        <p className="text-terminal-fg/60 font-mono text-sm text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-terminal-primary hover:text-terminal-secondary">
            Register here
          </Link>
        </p>
      </div>
    </Card>
  );
}
