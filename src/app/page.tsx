import { ChatPanel } from '@/components/chat/chat-panel';
import { SourcePanel } from '@/components/sources/source-panel';

export default function Home() {
  return (
    <div className="flex h-full">
      <aside className="hidden md:flex flex-col w-[320px] lg:w-[360px] border-r border-border">
        <SourcePanel />
      </aside>
      <main className="flex-1 flex flex-col">
        <ChatPanel />
      </main>
    </div>
  );
}
