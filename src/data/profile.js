/*
 * ────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit this file only.
 *
 *  The site renders one "role preset" at a time (AI, MERN, .NET, Front End).
 *  Pick the default with `site.defaultRole`, or preview any preset with
 *  ?role=ai | ?role=mern | ?role=dotnet | ?role=frontend in the URL.
 *
 *  Everything shared (name, contact, work history) lives at the top. Each
 *  preset only overrides what changes between roles: titles, summary, skills,
 *  the tech stack shown per job, projects and the colour theme.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  defaultRole: 'mern',
  // The role switcher is always visible during `npm run dev`. Set this to true
  // to also show it in production, or append ?switcher to the URL.
  showRoleSwitcher: false,
};

export const person = {
  name: 'Raja Umer Sharif',
  monogram: 'RS', // drawn in particles in the contact section
  email: 'rajaumer.job@gmail.com',
  phone: '', // e.g. '+1 (555) 123-4567' — hidden when empty
  location: '', // e.g. 'Dallas, TX · Open to remote' — hidden when empty
  education: 'Bachelor of Arts',
  careerStart: '2015-04', // used to compute "years of experience"
  resumeUrl: '', // e.g. '/Raja-Umer-Sharif-Resume.pdf' (put the file in /public)
  socials: [
    { label: 'GitHub', url: '' },
    { label: 'LinkedIn', url: '' },
  ],
};

/*
 * Work history. Highlights are written to be technology-neutral so they read
 * correctly for every role preset; the stack chips under each job come from
 * the active preset's `stacks[job.id]`.
 */
export const experience = [
  {
    id: 'glenoaks',
    company: 'Glen Oaks Hospital',
    location: 'Greenville, TX',
    start: '2020-07',
    end: null, // null = present
    level: 'senior',
    domain: 'Healthcare',
    highlights: [
      'Build and maintain the component-driven interface for the Member Medical Profile and core institution pages.',
      'Design and consume RESTful APIs and services that power data-heavy clinical and member workflows.',
      'Implemented single sign-on with OAuth / OpenID Connect, silent token refresh and organisation-wide password policies.',
      'Integrated Google Places address autocomplete and record-matching against existing patient data sources.',
      'Own build tooling, dependency management and CI/CD pipelines for faster, safer releases.',
    ],
  },
  {
    id: 'equifax',
    company: 'Equifax',
    location: 'Alpharetta, GA',
    start: '2019-02',
    end: '2020-06',
    level: 'senior',
    domain: 'Fintech',
    highlights: [
      'Partnered with business users and the UX team to gather requirements and produce internal and external technical documentation.',
      'Built single-page applications with reusable components, lazy-loaded modules, route guards and reactive form validation.',
      'Developed services and microservices for synchronous and asynchronous communication between distributed systems.',
      'Created dynamic data visualisations and owned cross-browser compatibility across Chrome, Safari, Firefox and Edge.',
    ],
  },
  {
    id: 'ditech',
    company: 'Ditech Holding Corporation',
    location: 'Tampa, FL',
    start: '2017-09',
    end: '2019-01',
    level: 'mid',
    domain: 'Fintech',
    highlights: [
      'Designed interactive web interfaces, dynamic forms and role-based navigation generated from server data.',
      'Implemented business logic and data access backed by SQL queries and PL/SQL stored procedures.',
      'Integrated SOAP/XML and REST web services to move transactions across financial institutions.',
      'Wrote unit and end-to-end tests and fixed defects found during each test cycle in Agile sprints.',
    ],
  },
  {
    id: 'christus',
    company: 'Christus Health',
    location: 'Cincinnati, OH',
    start: '2015-04',
    end: '2017-08',
    level: 'junior',
    domain: 'Healthcare',
    highlights: [
      'Built reusable components and front-end libraries for single-page applications with ES6+, Babel and Webpack.',
      'Managed application state and routing for SPAs and wired them to REST and SOAP services.',
      'Wrote server-side business logic to fetch data and bind it to application views.',
      'Upgraded legacy pages to responsive, standards-compliant layouts and grew unit-test coverage.',
    ],
  },
];

/* Skills every preset shows, appended after the role-specific groups. */
const sharedSkills = [
  {
    title: 'Engineering Practices',
    items: ['Agile / Scrum', 'SDLC', 'Test-Driven Development', 'OOP / OOAD', 'MVC & Clean Architecture', 'Microservices', 'Code Review', 'Technical Documentation'],
  },
  {
    title: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'Docker', 'Jenkins', 'CI/CD', 'Git / GitHub', 'Bitbucket', 'Linux / Bash'],
  },
];

export const roles = {
  /* ───────────────────────────── AI Developer ───────────────────────────── */
  ai: {
    label: 'AI Developer',
    titles: ['AI Developer', 'LLM Application Engineer', 'Full Stack Engineer'],
    jobTitle: { senior: 'Software Engineer', mid: 'Software Engineer', junior: 'Junior Software Engineer' },
    headline: 'I build AI-powered products end to end — from model evaluation and retrieval pipelines to the interfaces people trust.',
    summary: [
      'I am a software engineer with a decade of experience shipping production web applications for healthcare and financial companies, now focused on bringing large language models into real products.',
      'My background in full stack development means I care about the whole system: clean data, reliable APIs, careful evaluation of model output, and a UI that makes AI features feel dependable rather than magical.',
    ],
    theme: { a: '#7c5cff', b: '#22d3ee', c: '#f472b6' },
    skills: [
      { title: 'AI & LLMs', items: ['LLM APIs (Claude, OpenAI)', 'Prompt Engineering', 'RAG Pipelines', 'Embeddings & Vector Search', 'Agents & Tool Use', 'AI Model Evaluation', 'Data Annotation', 'LangChain / LlamaIndex'] },
      { title: 'Data & ML', items: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'Jupyter', 'Data Visualisation (D3.js)'] },
      { title: 'Backend & APIs', items: ['FastAPI', 'Node.js', 'Express', 'REST', 'GraphQL', 'Streaming / SSE', 'OAuth / OpenID'] },
      { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Angular', 'Tailwind CSS', 'Material UI'] },
      { title: 'Data Stores', items: ['PostgreSQL + pgvector', 'MongoDB', 'Redis', 'DynamoDB', 'Oracle', 'SQL Server'] },
    ],
    stacks: {
      glenoaks: ['React', 'TypeScript', 'Node.js', 'Python', 'REST', 'OAuth / OpenID', 'AWS'],
      equifax: ['Angular', 'TypeScript', 'Microservices', 'D3.js', 'Docker'],
      ditech: ['JavaScript', 'SQL', 'PL/SQL', 'SOAP', 'REST'],
      christus: ['React', 'Redux', 'Node.js', 'Express', 'Jasmine'],
    },
    // Sample projects — replace with your own work and links.
    projects: [
      { title: 'Clinical Knowledge Assistant', description: 'Retrieval-augmented chat over internal policy documents with source citations, feedback capture and an evaluation harness that scores every answer.', tags: ['Python', 'FastAPI', 'pgvector', 'React'], links: { live: '', code: '' } },
      { title: 'LLM Evaluation Dashboard', description: 'Side-by-side comparison of prompts and models on a labelled test set, tracking accuracy, latency and cost per run.', tags: ['Next.js', 'TypeScript', 'PostgreSQL'], links: { live: '', code: '' } },
      { title: 'Document Intelligence Pipeline', description: 'Extracts structured fields from scanned forms with an LLM, validates them against business rules and routes low-confidence items to human review.', tags: ['Python', 'Queues', 'Docker'], links: { live: '', code: '' } },
    ],
  },

  /* ───────────────────────────── MERN Stack ───────────────────────────── */
  mern: {
    label: 'MERN Stack',
    titles: ['Full Stack Developer', 'MERN Stack Engineer', 'React & Node.js Specialist'],
    jobTitle: { senior: 'Full Stack Developer', mid: 'Full Stack Developer', junior: 'Junior Full Stack Developer' },
    headline: 'I design and ship fast, accessible web applications with React, Node.js and MongoDB — from the database schema to the last pixel.',
    summary: [
      'I am a full stack JavaScript engineer with a decade of experience building production applications for healthcare and financial companies.',
      'I enjoy owning features end to end: modelling data, designing clean REST and GraphQL APIs, and crafting responsive React interfaces that stay maintainable as teams and products grow.',
    ],
    theme: { a: '#22c55e', b: '#38bdf8', c: '#a3e635' },
    skills: [
      { title: 'Frontend', items: ['React', 'Redux Toolkit', 'React Router', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Material UI', 'Bootstrap'] },
      { title: 'Backend', items: ['Node.js', 'Express', 'REST', 'GraphQL', 'Socket.IO', 'JWT / OAuth', 'Microservices'] },
      { title: 'Databases', items: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB'] },
      { title: 'Testing', items: ['Jest', 'React Testing Library', 'Cypress', 'Jasmine', 'Karma'] },
      { title: 'Tooling', items: ['Vite', 'Webpack', 'Babel', 'npm / pnpm', 'ESLint', 'Prettier'] },
    ],
    stacks: {
      glenoaks: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'OAuth / OpenID', 'Webpack'],
      equifax: ['React', 'TypeScript', 'Node.js', 'Microservices', 'D3.js', 'Docker'],
      ditech: ['JavaScript', 'Node.js', 'MySQL', 'REST', 'Bootstrap'],
      christus: ['React', 'Redux', 'Node.js', 'Express', 'Jasmine', 'Karma'],
    },
    projects: [
      { title: 'Patient Portal', description: 'Appointment booking, secure messaging and lab results in a responsive React app backed by an Express API with role-based access.', tags: ['React', 'Express', 'MongoDB', 'JWT'], links: { live: '', code: '' } },
      { title: 'Real-time Team Board', description: 'Kanban board with live cursors and instant updates over WebSockets, optimistic UI and offline-friendly sync.', tags: ['React', 'Socket.IO', 'Node.js', 'Redis'], links: { live: '', code: '' } },
      { title: 'Commerce Platform', description: 'Product catalogue, cart and Stripe checkout with an admin dashboard for inventory and order analytics.', tags: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'], links: { live: '', code: '' } },
    ],
  },

  /* ───────────────────────────── C# / .NET ───────────────────────────── */
  dotnet: {
    label: 'C# / .NET',
    titles: ['.NET Developer', 'C# Software Engineer', 'Full Stack .NET Engineer'],
    jobTitle: { senior: 'Software Engineer (.NET)', mid: 'Software Engineer (.NET)', junior: 'Junior .NET Developer' },
    headline: 'I build reliable, well-structured systems with C# and ASP.NET Core — clean APIs, solid data layers and modern web front ends.',
    summary: [
      'I am a software engineer with a decade of experience delivering enterprise applications for healthcare and financial companies.',
      'I focus on maintainable architecture: well-designed Web APIs, efficient data access with Entity Framework and SQL, thorough automated testing, and front ends in Angular, React or Blazor that are a pleasure to use.',
    ],
    theme: { a: '#8b5cf6', b: '#60a5fa', c: '#c084fc' },
    skills: [
      { title: 'Languages & Runtime', items: ['C#', '.NET 8', 'ASP.NET Core', 'TypeScript', 'SQL', 'PL/SQL'] },
      { title: 'Backend', items: ['ASP.NET Core Web API', 'Entity Framework Core', 'LINQ', 'SignalR', 'gRPC', 'Background Services'] },
      { title: 'Frontend', items: ['Blazor', 'Angular', 'React', 'Razor Pages', 'Bootstrap'] },
      { title: 'Data', items: ['SQL Server', 'Oracle', 'PostgreSQL', 'Redis', 'Cosmos DB'] },
      { title: 'Testing & Cloud', items: ['xUnit', 'NUnit', 'Moq', 'Azure App Service', 'Azure Functions', 'Azure DevOps'] },
    ],
    stacks: {
      glenoaks: ['ASP.NET Web API', 'C#', 'Angular', 'SQL Server', 'OAuth / OpenID', 'Azure'],
      equifax: ['C#', 'Microservices', 'Angular', 'TypeScript', 'Docker'],
      ditech: ['ASP.NET', 'SQL', 'PL/SQL', 'Oracle', 'SOAP'],
      christus: ['ASP.NET', 'JavaScript', 'Angular', 'Jasmine'],
    },
    projects: [
      { title: 'Claims Processing API', description: 'ASP.NET Core Web API with clean architecture, EF Core, validation pipelines and background workers for batch jobs.', tags: ['ASP.NET Core', 'EF Core', 'SQL Server'], links: { live: '', code: '' } },
      { title: 'Operations Dashboard', description: 'Blazor dashboard with live metrics pushed over SignalR, role-based views and exportable reports.', tags: ['Blazor', 'SignalR', 'Azure'], links: { live: '', code: '' } },
      { title: 'Scheduling Service', description: 'Distributed job scheduler for monthly statements and notifications with retries, idempotency and full observability.', tags: ['.NET 8', 'Azure Functions', 'Redis'], links: { live: '', code: '' } },
    ],
  },

  /* ───────────────────────────── Front End / UI ───────────────────────────── */
  frontend: {
    label: 'Front End',
    titles: ['Front End Developer', 'UI Engineer', 'Angular & React Developer'],
    jobTitle: { senior: 'Front End / UI Developer', mid: 'Front End / UI Developer', junior: 'Jr UI Developer' },
    headline: 'I craft fast, accessible and beautiful interfaces — design systems, data visualisation and the details users feel.',
    summary: [
      'I am a front end engineer with a decade of experience building user interfaces for healthcare and financial companies, with a creative background in visual and graphic design.',
      'I translate designs into robust component libraries, keep performance and accessibility front of mind, and work closely with UX and back-end teams to ship features users love.',
    ],
    theme: { a: '#f97316', b: '#ec4899', c: '#facc15' },
    skills: [
      { title: 'Core', items: ['HTML5', 'CSS3 / SASS / LESS', 'JavaScript (ES6+)', 'TypeScript', 'Responsive Design', 'Accessibility'] },
      { title: 'Frameworks', items: ['Angular', 'React', 'Redux', 'NgRx', 'RxJS', 'Vue.js', 'jQuery'] },
      { title: 'UI & Visualisation', items: ['Material UI', 'Bootstrap', 'D3.js', 'WebGL / Three.js', 'Design Systems'] },
      { title: 'Testing', items: ['Jest', 'Jasmine', 'Karma', 'Protractor', 'QUnit'] },
      { title: 'Design Tools', items: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'] },
    ],
    stacks: {
      glenoaks: ['Angular 8/9', 'TypeScript', 'RxJS', 'NgRx', 'Material UI', 'SASS'],
      equifax: ['Angular', 'TypeScript', 'RxJS', 'D3.js', 'Karma'],
      ditech: ['Angular', 'Backbone.js', 'jQuery', 'Bootstrap', 'AJAX'],
      christus: ['React', 'Redux', 'AngularJS', 'Bootstrap', 'Jasmine'],
    },
    projects: [
      { title: 'Healthcare Design System', description: 'Accessible component library with tokens, theming and documentation, adopted across multiple product teams.', tags: ['Angular', 'Storybook', 'SASS'], links: { live: '', code: '' } },
      { title: 'Credit Insights Visualisation', description: 'Interactive D3.js charts for exploring credit trends with zoom, brushing and responsive layouts.', tags: ['D3.js', 'TypeScript', 'RxJS'], links: { live: '', code: '' } },
      { title: 'WebGL Portfolio', description: 'This site: a GPU particle system that morphs between shapes as you scroll, with bloom and custom shaders.', tags: ['Three.js', 'GLSL', 'Vite'], links: { live: '', code: '' } },
    ],
  },
};

export { sharedSkills };
