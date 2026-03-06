"use client";

import { useState } from "react";

type CommandSnippetProps = {
  command: string;
  label?: string;
};

export default function CommandSnippet({ command, label = "Command" }: CommandSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-full overflow-hidden rounded-lg border border-neutral-700 bg-black">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </span>
        <button
          type="button"
          onClick={copyCommand}
          className="rounded border border-neutral-600 px-2 py-1 text-xs font-medium text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain px-3 py-3 [scrollbar-gutter:stable]">
        <pre className="m-0 w-full whitespace-pre text-xs leading-relaxed text-green-400">
          <code>{command}</code>
        </pre>
      </div>
    </div>
  );
}
