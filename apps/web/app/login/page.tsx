'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      setError('Credenciais inválidas');
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <div className="container py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-slate">Acesso reservado a um único administrador.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input {...register('email')} placeholder="Email" />
            <Input {...register('password')} type="password" placeholder="Password" />
            {error && <span className="text-sm text-red-600">{error}</span>}
            <Button type="submit" disabled={formState.isSubmitting}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
