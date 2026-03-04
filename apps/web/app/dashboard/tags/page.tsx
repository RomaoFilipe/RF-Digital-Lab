'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';

type Tag = { id: string; name: string; slug: string };

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/tags`);
    const data = await res.json();
    setTags(data);
  }

  async function createTag() {
    if (!name) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });
    setName('');
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Tags</h1>
      <div className="flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova tag"
        />
        <Button onClick={createTag} size="sm">
          Criar
        </Button>
      </div>
      <Card>
        <ul className="grid gap-2 text-sm">
          {tags.map((tag) => (
            <li key={tag.id}>{tag.name} ({tag.slug})</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
