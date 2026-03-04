import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="font-display text-4xl text-white">Control center</h1>
        <p className="mt-2 text-sm text-slate">Content, media and settings in one technical workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Content</p>
          <p className="mt-3 text-2xl font-display text-white">Manage published work</p>
          <p className="mt-3 text-sm leading-7 text-slate">Create, duplicate, publish and archive portfolio items and articles.</p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/content">Open</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/content/new">New</Link>
            </Button>
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Media</p>
          <p className="mt-3 text-2xl font-display text-white">Uploads and assets</p>
          <p className="mt-3 text-sm leading-7 text-slate">Batch upload local assets, inspect dimensions and copy public URLs fast.</p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/media">Open</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/settings">SEO</Link>
            </Button>
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Settings</p>
          <p className="mt-3 text-2xl font-display text-white">Identity and platform copy</p>
          <p className="mt-3 text-sm leading-7 text-slate">Tune platform details, preview the public site and keep messaging aligned.</p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/settings">Open</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/">Preview site</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
