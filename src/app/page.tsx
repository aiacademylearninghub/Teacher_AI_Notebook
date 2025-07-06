import { AppLayout } from '@/components/layout/app-layout';
import { ChatPanel } from '@/components/chat/chat-panel';
import { SourcePanel } from '@/components/sources/source-panel';
import { StudioPanel } from '@/components/studio/studio-panel';

export default function Home() {
  return (
    <AppLayout
      sourcePanel={<SourcePanel />}
      mainPanel={<ChatPanel />}
      studioPanel={<StudioPanel />}
    />
  );
}
