'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';

type Settings = {
  siteTitle: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  contactEmail?: string | null;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  async function load() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/settings`);
    const data = await res.json();
    setSettings(data);
  }

  async function save() {
    if (!settings) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings),
    });
  }

  useEffect(() => {
    load();
  }, []);

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>
      <Card className="grid gap-4">
        <Input
          value={settings.siteTitle}
          onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
          placeholder="Site Title"
        />
        <Input
          value={settings.heroTitle ?? ''}
          onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
          placeholder="Hero Title"
        />
        <Input
          value={settings.heroSubtitle ?? ''}
          onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
          placeholder="Hero Subtitle"
        />
        <Input
          value={settings.contactEmail ?? ''}
          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
          placeholder="Contact Email"
        />
        <Button onClick={save} size="sm">
          Guardar
        </Button>
      </Card>
    </div>
  );
}
