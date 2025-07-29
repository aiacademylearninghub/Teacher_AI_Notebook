"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import type { Source } from './source-panel';
import { nanoid } from 'nanoid';

interface TextSourceFormProps {
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  onSourceAdded: () => void;
}

export function TextSourceForm({ setSources, onSourceAdded }: TextSourceFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newSource: Source = {
      id: nanoid(),
      name: title,
      icon: FileText,
      content: content,
      type: 'text',
      isSelected: true,
    };
    
    setSources(prevSources => [...prevSources, newSource]);
    onSourceAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="source-title">Title</Label>
        <Input
          id="source-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My Research Notes"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="source-content">Content</Label>
        <Textarea
          id="source-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or type your text here..."
          required
          rows={10}
        />
      </div>
      <Button type="submit">Add Source</Button>
    </form>
  );
}
