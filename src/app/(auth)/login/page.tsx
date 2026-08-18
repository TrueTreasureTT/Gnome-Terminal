'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Authentication failed: Invalid credentials.');
        setLoading(false);
        return;
      }

      router.push('/terminal');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Connection refused.');
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-terminal-primary bg-black/90 shadow-lg">
      <div className="mb-6">
        <p className="text-terminal-primary font-mono text-sm mb-4">$ login --user</p>
        <h2 className="text-2xl font-bold text-terminal-secondary font-mono">Sign In</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-500 rounded font-mono text-xs text-red-400">
          [ERROR] {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-terminal-primary font-mono text-sm mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="bg-black text-terminal-primary border-terminal-primary/50 focus:border-terminal-primary font-mono"
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
            className="bg-black text-terminal-primary border-terminal-primary/50 focus:border-terminal-primary font-mono"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold transition-colors"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-terminal-primary/30">
        <p className="text-terminal-fg/60 font-mono text-sm text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-terminal-primary hover:text-terminal-secondary underline">
            Register here
          </Link>
        </p>
      </div>
    </Card>
  );
}
