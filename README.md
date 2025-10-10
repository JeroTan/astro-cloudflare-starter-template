# AstroJS for Cloudflare Worker Template

This is a template for building AstroJS projects that can be deployed to Cloudflare Workers. This project is designed to be a starting point for developers who want to leverage the power of Astro for static site generation and Cloudflare Workers for serverless deployment.

## Section 1. Getting Started

To create a new project using this template, run the following command:

```bash
npx astro-cfw-template@latest
```

This will prompt you for a project name and create a new directory with the project files.

After the project is created, navigate to the project directory and start the development server:

```bash
cd <your-project-name>
npm run dev
```

## Section 2. Dependencies

This template comes with a set of pre-configured dependencies to get you started quickly. Here's a brief overview of what's included:

-   **Astro (`astro`)**: The core of the project. Astro is a web framework for building fast, content-focused websites.
-   **Astro Check (`@astrojs/check`)**: A command-line tool for checking your Astro project for errors and validating your TypeScript code.
-   **Cloudflare Adapter (`@astrojs/cloudflare`)**: This adapter allows you to build and deploy your Astro project to Cloudflare Pages and Workers.
-   **Sitemap (`@astrojs/sitemap`)**: A utility to automatically generate a `sitemap.xml` file for your site, which helps with SEO.
-   **Tailwind CSS (`tailwindcss` and `@tailwindcss/vite`)**: A utility-first CSS framework for rapidly building custom designs. The `@tailwindcss/vite` package provides the necessary integration with Vite, Astro's underlying build tool.