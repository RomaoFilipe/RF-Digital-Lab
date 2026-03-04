import { ContentForm } from '../../../../components/ContentForm';

export default function NewContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Novo Conteúdo</h1>
      <ContentForm mode="create" />
    </div>
  );
}
