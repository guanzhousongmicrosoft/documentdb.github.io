import { Sample } from '../types/Sample';
import { TagPill } from './TagPill';

const languageIcons: Record<string, string> = {
  'Node.js': '⬡',
  Python: '🐍',
  TypeScript: '𝗧𝗦',
  Go: '◉',
  Java: '☕',
  'C#': '♯',
  Rust: '⚙',
};

const languageColors: Record<string, string> = {
  'Node.js': 'from-green-500 to-green-600',
  Python: 'from-blue-500 to-yellow-500',
  TypeScript: 'from-blue-500 to-blue-600',
  Go: 'from-cyan-500 to-cyan-600',
  Java: 'from-orange-500 to-red-500',
  'C#': 'from-purple-500 to-purple-600',
  Rust: 'from-orange-600 to-red-700',
};

export function SampleCard({ sample }: { sample: Sample }) {
  const gradient = languageColors[sample.language] ?? 'from-neutral-500 to-neutral-600';
  const icon = languageIcons[sample.language] ?? '◈';

  return (
    <article className="group relative flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative flex flex-col h-full bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {icon}
              </div>
              <div>
                <span className="text-teal-400 text-xs font-medium">{sample.language}</span>
                <p className="text-gray-500 text-xs">{sample.industry}</p>
              </div>
            </div>
            <TagPill tag={sample.difficulty} variant="difficulty" />
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors leading-snug">
            {sample.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
            {sample.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {sample.tags.map((tag) => (
              <TagPill key={tag} tag={tag} variant="default" />
            ))}
          </div>

          {/* CTA */}
          <a
            href={sample.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors font-medium text-sm mt-auto"
          >
            View on GitHub
            <svg
              className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
