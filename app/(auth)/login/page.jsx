'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tv, Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase is unconfigured or returns invalid credentials during development
        if (
          error.message.includes('FetchError') ||
          error.message.includes('placeholder') ||
          error.message.includes('Invalid login')
        ) {
          // Allow dev bypass if user wants to test dashboard immediately
          setErrorMsg(`${error.message}. (Tip: If Supabase keys are not yet configured, click "Enter as Demo Operator" below)`);
        } else {
          setErrorMsg(error.message);
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    router.push('/');
  };

  return (
    <Card className="border-slate-800 bg-slate-900/95 shadow-2xl">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
          <Tv className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl justify-center font-bold text-white">
          Operator Broadcast Console
        </CardTitle>
        <CardDescription>
          Sign in to control live volleyball scoreboard, graphics, and OBS Studio.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Operator Email</span>
            </label>
            <Input
              type="email"
              placeholder="operator@broadcaster.live"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Password</span>
            </label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button
            type="submit"
            variant="broadcast"
            className="w-full gap-2 font-semibold"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoBypass}
            className="w-full text-xs text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
          >
            Enter as Demo Operator (Local Dev)
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
