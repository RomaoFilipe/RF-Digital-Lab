import { ContentForm } from '../../../../components/ContentForm';

export default function NewContentPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <div>
        <p className="eyebrow">Editor</p>
        <h1 className="font-display text-3xl">Novo Conteúdo</h1>
      </div>
      <ContentForm mode="create" />
    </div>
  );
}
