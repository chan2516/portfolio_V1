import sequelize from './db.js';
import Project from './models/Project.js';

// Hardcoded data extracted from your old portfolioData.ts
const projectsData = [
  {
    id: 'localcart',
    title: 'LocalCart',
    subtitle: 'Full-Stack Multi-Vendor Marketplace',
    category: 'Full-Stack',
    summary: 'Comprehensive enterprise e-commerce platform built with Next.js and Java Spring Boot REST API backend, orchestrated into 5 containerized microservices on AWS EC2 with automated CI/CD and zero-downtime updates.',
    bullets: [
      'Developed a comprehensive e-commerce platform by engineering a Next.js frontend coupled with a Java Spring Boot REST API backend.',
      'Designed automated CI/CD workflows using GitHub Actions to build and distribute multi-stage Docker images to remote registries.',
      'Provisioned AWS EC2 Linux environments to host 5 containerized services orchestrated via Docker Compose for caching, proxying, and data persistence.',
      'Integrated Nginx as a reverse proxy to manage traffic flow and implemented SSL/HTTPS encryption protocols using Certbot.',
      'Achieved zero-downtime updates by deploying Watchtower for automated container synchronization and lifecycle management.'
    ],
    techStack: ['Next.js', 'Java Spring Boot', 'PostgreSQL', 'Redis', 'Docker Compose', 'AWS EC2', 'GitHub Actions', 'Nginx', 'Certbot (SSL)', 'Watchtower'],
    features: ['Multi-Vendor Storefront & Vendor Portals', 'Redis In-Memory Session & Catalog Caching', 'Automated Multi-Stage Docker Builds', 'Zero-Downtime Rolling Container Updates via Watchtower', 'Nginx Reverse Proxy with TLS/SSL Termination'],
    architectureDetails: [
      { title: 'Edge & Ingress Layer', desc: 'Nginx reverse proxy on AWS EC2 forwarding requests with SSL/TLS encryption handled via automated Certbot certificates.', badge: 'Nginx + Certbot' },
      { title: 'Client Layer', desc: 'Server-Side Rendered (SSR) & Static Generation using Next.js with responsive multi-vendor interfaces and payment checkouts.', badge: 'Next.js 14' },
      { title: 'Core Business API', desc: 'Java 17 Spring Boot microservice running stateless REST APIs with transactional integrity, data validation, and JWT security.', badge: 'Spring Boot 3' },
      { title: 'Persistence & Cache', desc: 'PostgreSQL relational database paired with Redis distributed cache for fast product querying and session throttling.', badge: 'PostgreSQL + Redis' },
      { title: 'CI/CD & DevOps', desc: 'GitHub Actions triggered builds pushing to Docker Hub, synchronized on EC2 automatically via Watchtower daemon.', badge: 'GitHub Actions + Watchtower' }
    ],
    githubUrl: 'https://github.com/chan2516/localcart',
    liveUrl: 'https://shop.chandandev.me',
    metrics: [{ label: 'Container Services', value: '5 Containers' }, { label: 'Deployment Uptime', value: 'Zero-Downtime' }, { label: 'Cloud Infrastructure', value: 'AWS EC2 Linux' }]
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    subtitle: 'Agile Task Management & Kanban System',
    category: 'Full-Stack',
    summary: 'Full-stack agile management suite featuring real-time task lifecycle tracking, role-based member assignment, JWT auth with refresh-token rotation, and interactive Kanban boards deployed on Render.',
    bullets: [
      'Developed a full-stack project management tool supporting project creation, task tracking, member assignment, and Kanban workflow.',
      'Built JWT authentication with refresh-token rotation and REST APIs using pagination, filtering, and sorting.',
      'Implemented React Context API state management and drag-and-drop Kanban UI; deployed backend on Render with PostgreSQL.'
    ],
    techStack: ['Java 17', 'Spring Boot 3', 'Spring Security', 'JWT Auth & Refresh Rotation', 'React.js', 'PostgreSQL', 'Spring Data JPA', 'Render Cloud'],
    features: ['Interactive Drag-and-Drop Kanban Board with Status Columns', 'Stateless JWT Authentication with Secure Refresh-Token Rotation', 'Dynamic Pagination, Column Sorting, and Full-Text Filter APIs', 'RBAC (Role-Based Access Control) for Project Owners and Assignees', 'Cloud-hosted Backend on Render connected to PostgreSQL'],
    architectureDetails: [
      { title: 'Frontend Interface', desc: 'React.js application with Context API centralized state management, responsive Kanban column interactions, and real-time feedback.', badge: 'React.js + Context API' }
    ],
    githubUrl: '',
    liveUrl: '',
    metrics: []
  }
];

async function seed() {
  await sequelize.sync(); // ensure tables exist
  
  console.log('Seeding projects...');
  for (const p of projectsData) {
    const exists = await Project.findByPk(p.id);
    if (!exists) {
      await Project.create(p);
      console.log(`✅ Added: ${p.title}`);
    }
  }
  console.log('Done!');
  process.exit();
}

seed();
