import { AppLayout } from '@/components/layout/app-layout';
import { NotebookPanel } from '@/components/notebook/notebook-panel';
import { SourcePanel } from '@/components/sources/source-panel';

export default function Home() {
  return (
    <AppLayout
      sourcePanel={<SourcePanel />}
    >
      <NotebookPanel />
    </AppLayout>
  );
}
