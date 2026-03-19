# DocumentDB Website

A modern website for DocumentDB built with [Next.js](https://nextjs.org/) for the main site and [Jekyll](https://jekyllrb.com/) for the `/blogs/` section. The site features community blog posts and technical documentation, with content automatically pulled from the [documentdb/docs](https://github.com/documentdb/docs) repository during the build process.

## Prerequisites for Development

- **[Node.js](https://nodejs.org/)** (*20 or higher*)

- **[Ruby](https://www.ruby-lang.org/)** with **Bundler** (*for the Jekyll-powered blog section*)

- **[Git](https://git-scm.com/)** (*for cloning documentation content*)

You can develop locally on any machine with these prerequisites installed, or use [GitHub Codespaces](#develop-in-github-codespaces) for a pre-configured environment.

## Getting Started

Get started by cloning and running this repository locally.

1. Clone this repository

1. Install dependencies:

    ```bash
    npm install
    ```

1. Install Ruby dependencies:

    ```bash
    BUNDLE_FORCE_RUBY_PLATFORM=true bundle install
    ```

1. Start the Next.js development server:

    ```bash
    npm run dev
    ```

1. For a full static preview, including the Jekyll-powered blog section:

    ```bash
    npm run build
    npm run start
    ```

1. Observe that the preview site will be available at http://localhost:3000

The first time you run `npm run dev` or `npm run build`, documentation content will be automatically compiled from the [documentdb/docs](https://github.com/documentdb/docs) repository.

## Contributing

We welcome contributions to improve the DocumentDB website, whether it's blog posts, bug fixes, or enhancements to the site itself.

### Contributing Blog Posts

Blog posts are managed locally in this repository. Contribute directly through a pull request to this repository.

1. Open [blogs/_data/posts.yml](blogs/_data/posts.yml)

1. Add your blog post entry following the format of existing posts

1. Submit a pull request for review

### Contributing Documentation & Reference Content

Documentation articles and API reference content are managed in a separate repository. For more information, see [documentdb/docs](https://github.com/documentdb/docs).

> [!IMPORTANT]
> Please refer to that repository for instructions on contributing:
>
> - Documentation articles (`getting-started/`, `postgres-api/`, `architecture/`, etc.)
> - API reference content (`api-reference/`)
>

## Content Configuration

Documentation content is automatically compiled during builds from external repositories. The mapping is configured in [content.config.json](content.config.json).

```json
{
  "sources": [
    {
      "repository": "https://github.com/documentdb/docs",
      "branch": "main",
      "mappings": [
        {
          "source": "api-reference",
          "target": "reference"
        },
        {
          "source": "getting-started",
          "target": "articles/getting-started"
        }
      ]
    }
  ],
  "include": ["**/*.md", "**/*.yml"],
  "exclude": ["**/{readme,README}.md"]
}
```

### Configuration options

The `content.config.json` file controls how documentation is compiled from external sources into this site.

- **sources** - Array of repositories to clone content from. Each source includes:
  - **repository** - Git repository URL
  - **branch** - Git branch to clone from
  - **mappings** - Array of source folder to target folder mappings
- **include** - Array of glob patterns for files to include (opt-in filtering)
- **exclude** - Array of glob patterns for files to exclude

### Manual content operations

While content is automatically compiled during builds, you can manually trigger these operations during development:

```bash
# Build the full static site artifact
npm run build
```

```bash
# Start the static preview server
npm run start
```

## Develop in GitHub Codespaces

Launch a pre-configured development environment with all dependencies installed:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/documentdb/documentdb.github.io)

The Codespaces environment includes:
- Node.js 20
- Git
- Visual Studio Code extensions for Markdown and YAML editing
- All npm dependencies

Simply run `npm run dev` after the container starts.
