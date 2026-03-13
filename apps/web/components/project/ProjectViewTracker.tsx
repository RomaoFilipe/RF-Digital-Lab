'use client';

import { useEffect } from 'react';

type Props = {
  slug: string;
  apiBase: string;
};

export function ProjectViewTracker({ slug, apiBase }: Props) {
  useEffect(() => {
    const key = `project-viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    fetch(`${apiBase}/content/${slug}/view`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // no-op: view counters are best-effort only
    });
  }, [slug, apiBase]);

  return null;
}
