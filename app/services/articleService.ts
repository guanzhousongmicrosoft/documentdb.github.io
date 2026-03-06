import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { Article } from '../types/Article';
import { Link } from '../types/Link';

const articlesDirectory = path.join(process.cwd(), 'articles');
const dockerGuideContent = `# Docker

Run DocumentDB locally in minutes using Docker.

## Start DocumentDB

\`\`\`bash
docker run -dt --name documentdb \\
  -p 10260:10260 \\
  ghcr.io/documentdb/documentdb/documentdb-local:latest \\
  --username <YOUR_USERNAME> \\
  --password <YOUR_PASSWORD>
\`\`\`

> Replace \`<YOUR_USERNAME>\` and \`<YOUR_PASSWORD>\` with your own credentials.

## Verify the container

\`\`\`bash
docker ps --filter "name=documentdb"
\`\`\`

## Next steps

- [Node.js Setup Guide](/docs/getting-started/nodejs-setup)
- [Python Setup Guide](/docs/getting-started/python-setup)
- [Linux Packages Guide](/docs/getting-started/packages)
- [Package Finder](/packages)
`;

const linuxPackagesGuideContent = `# Linux Packages

Install DocumentDB on Linux hosts with apt/rpm packages.

## Fastest path

Use the [Package Finder](/packages) to generate the exact install command for your distro, architecture, and PostgreSQL version.

## APT example

\`\`\`bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg && \\
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable ubuntu24" | sudo tee /etc/apt/sources.list.d/documentdb.list && \\
sudo apt update && \\
sudo apt install postgresql-16-documentdb
\`\`\`

## RPM example

\`\`\`bash
sudo dnf install -y dnf-plugins-core && \\
sudo dnf config-manager --set-enabled crb && \\
sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg && \\
printf '%s\\n' '[documentdb]' 'name=DocumentDB Repository' 'baseurl=https://documentdb.io/rpm/rhel9' 'enabled=1' 'gpgcheck=1' 'gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg' | sudo tee /etc/yum.repos.d/documentdb.repo >/dev/null && \\
sudo dnf install postgresql16-documentdb
\`\`\`

## Next steps

- [Docker Quick Start](/docs/getting-started/docker)
- [Node.js Setup Guide](/docs/getting-started/nodejs-setup)
- [Python Setup Guide](/docs/getting-started/python-setup)
`;

function splitPrebuiltNavigation(section: string, links: Link[]): Link[] {
  if (section !== 'getting-started') {
    return links;
  }

  const isPrebuiltPackages = (link: Link) =>
    link.link.includes('prebuilt-packages') || /pre-built packages/i.test(link.title);
  const dockerAndLinuxLinks: Link[] = [
    {
      title: 'Docker',
      link: '/docs/getting-started/docker',
    },
    {
      title: 'Linux Packages',
      link: '/docs/getting-started/packages',
    },
  ];
  const filteredLinks = links.filter((link) => !isPrebuiltPackages(link));
  const gettingStartedIndex = filteredLinks.find((link) => link.link === 'index.md');

  if (!gettingStartedIndex) {
    return [...dockerAndLinuxLinks, ...filteredLinks];
  }

  const remainingLinks = filteredLinks.filter((link) => link !== gettingStartedIndex);
  return [gettingStartedIndex, ...dockerAndLinuxLinks, ...remainingLinks];
}

function updateGettingStartedIndexContent(content: string): string {
  return content.replace(
    /- \[Pre-built Packages\]\([^)]+\) - [^\n]+/i,
    '- [Docker](/docs/getting-started/docker) - Start DocumentDB locally with Docker\n- [Linux Packages](/docs/getting-started/packages) - Install via apt/rpm repositories'
  );
}

export function getArticleContent(): Article {
  const contentPath = path.join(articlesDirectory, 'content.yml');
  const fileContents = fs.readFileSync(contentPath, 'utf8');
  return yaml.load(fileContents) as Article;
}

export function getArticleNavigation(section: string): Link[] {
  const navPath = path.join(articlesDirectory, section, 'navigation.yml');

  if (!fs.existsSync(navPath)) {
    return [];
  }

  const fileContents = fs.readFileSync(navPath, 'utf8');
  const rawLinks = yaml.load(fileContents) as Link[];
  const normalizedLinks = splitPrebuiltNavigation(section, rawLinks);
  
  // Transform Markdown file links to published relative URIs
  return normalizedLinks.map(link => {
    // Convert .md file references to proper URIs
    // e.g., "index.md" -> "/docs/section"
    // e.g., "nodejs-setup.md" -> "/docs/section/nodejs-setup"
    let transformedLink = link.link;
    
    if (transformedLink.endsWith('.md')) {
      const filename = transformedLink.replace('.md', '');
      if (filename === 'index') {
        transformedLink = `/docs/${section}`;
      } else {
        transformedLink = `/docs/${section}/${filename}`;
      }
    }
    
    return {
      ...link,
      link: transformedLink,
      // Recursively transform children if they exist
      children: link.children?.map(child => ({
        ...child,
        link: child.link.endsWith('.md') 
          ? `/docs/${section}/${child.link.replace('.md', '')}`
          : child.link
      }))
    };
  });
}

export function getMarkdownContent(section: string, file: string = 'index'): string {
  const markdownPath = path.join(articlesDirectory, section, `${file}.md`);

  if (!fs.existsSync(markdownPath)) {
    return '';
  }

  return fs.readFileSync(markdownPath, 'utf8');
}

export function getAllSections(): string[] {
  const sections = fs.readdirSync(articlesDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return sections;
}

export function getAllArticlePaths(): { section: string; slug: string[] }[] {
  const sections = getAllSections();
  const paths: { section: string; slug: string[] }[] = [];

  sections.forEach(section => {
    const sectionPath = path.join(articlesDirectory, section);
    const files = fs.readdirSync(sectionPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
      .map(dirent => dirent.name.replace('.md', ''));

    files.forEach(file => {
      if (file === 'index') {
        // For index files, create both /section and /section/index routes
        paths.push({ section, slug: [] });
      } else {
        paths.push({ section, slug: [file] });
      }
    });

    if (section === 'getting-started') {
      paths.push({ section, slug: ['docker'] });
      paths.push({ section, slug: ['packages'] });
    }
  });

  const uniquePaths = new Map<string, { section: string; slug: string[] }>();
  paths.forEach((entry) => {
    const key = `${entry.section}/${entry.slug.join('/')}`;
    uniquePaths.set(key, entry);
  });

  return Array.from(uniquePaths.values());
}

export function getArticleByPath(section: string, slug: string[] = []): {
  content: string;
  frontmatter: {
    title?: string;
    [key: string]: any;
  };
  navigation: Link[];
  section: string;
  file: string;
} | null {
  const file = slug.length > 0 ? slug[slug.length - 1] : 'index';
  const navigation = getArticleNavigation(section);

  if (section === 'getting-started' && file === 'docker') {
    return {
      content: dockerGuideContent,
      frontmatter: {
        title: 'Docker',
        description: 'Run DocumentDB locally using Docker.',
      },
      navigation,
      section,
      file,
    };
  }

  if (section === 'getting-started' && file === 'packages') {
    return {
      content: linuxPackagesGuideContent,
      frontmatter: {
        title: 'Linux Packages',
        description: 'Install DocumentDB via apt and rpm packages.',
      },
      navigation,
      section,
      file,
    };
  }

  const rawContent = getMarkdownContent(section, file);
  
  if (!rawContent) {
    return null;
  }

  // Parse front matter
  const { data: frontmatter, content } = matter(rawContent);
  const normalizedContent =
    section === 'getting-started' && file === 'index'
      ? updateGettingStartedIndexContent(content)
      : content;

  return {
    content: normalizedContent,
    frontmatter,
    navigation,
    section,
    file
  };
}
