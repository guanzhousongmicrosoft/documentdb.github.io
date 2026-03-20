export interface Sample {
  id: string;
  title: string;
  description: string;
  language: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  githubUrl: string;
}
