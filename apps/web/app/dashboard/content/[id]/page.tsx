import { ContentForm } from '../../../../components/ContentForm';
import { apiFetch } from '../../../../lib/api';
import { ContentItem } from '../../../../lib/types';

async function getContent(id: string) {
  return apiFetch<ContentItem>(`/content/admin/${id}`);
}

export default async function EditContentPage({ params }: { params: { id: string } }) {
  const item = await getContent(params.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <div>
        <p className="eyebrow">Editor</p>
        <h1 className="font-display text-3xl">Editar Conteúdo</h1>
      </div>
      <ContentForm mode="edit" initial={item} />
    </div>
  );
}
