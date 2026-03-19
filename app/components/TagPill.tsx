interface TagPillProps {
  tag: string;
  variant?: 'default' | 'active' | 'language' | 'difficulty';
  onClick?: () => void;
}

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const defaultStyle = 'bg-neutral-700/50 text-gray-400 border-neutral-600/50';

export function TagPill({ tag, variant = 'default', onClick }: TagPillProps) {
  const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-150';

  const styles: Record<string, string> = {
    default: defaultStyle,
    active: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    language: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    difficulty: difficultyColors[tag] ?? defaultStyle,
  };

  return (
    <span
      className={`${base} ${styles[variant]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
