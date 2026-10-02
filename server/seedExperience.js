import sequelize from './db.js';
import Experience from './models/Experience.js';

const experienceData = [
  {
    id: 'strategic-erp',
    role: 'Java Developer',
    company: 'ITaakash Software Solutions Pvt. Ltd.',
    location: 'Mumbai, Maharashtra',
    period: 'September 2025 – Present',
    current: true,
    description: 'Develop and support Java/Spring enterprise modules, financial workflows, and banking integrations for a production ERP platform.',
    bullets: [
      'Developed a configurable Spring Boot microservice integrating 3+ banking APIs for payment initiation, balance enquiry, and statement retrieval, reducing client-specific backend changes.',
      'Automated transaction-status updates with Spring Scheduler and added structured logging and Grafana monitoring to improve diagnosis of integration failures.',
      'Troubleshoot production issues across ERP applications, REST APIs, databases, and banking integrations using logs, debugging, and root-cause analysis.',
      'Optimized complex SQL queries spanning 10–20 related tables and investigated issues across legacy Java 8/J2EE and JSP modules.',
      'Execute unit and API tests with JUnit, Mockito, and Postman, and document REST endpoints with Swagger/OpenAPI.',
      'Collaborate with business stakeholders, QA, and DevOps to clarify data flows, verify fixes, and support releases on Ubuntu Linux environments.'
    ],
    techStack: ['Java 17', 'Spring Boot', 'Spring Security', 'Spring MVC', 'Hibernate / JPA', 'Banking APIs', 'PostgreSQL', 'Swagger / OpenAPI', 'Ubuntu Linux', 'Maven', 'CI/CD'],
    metrics: [
      { label: 'Related SQL Tables', value: '10–20' },
      { label: 'Banking Gateways', value: '3+' },
      { label: 'Support Coverage', value: 'App · API · DB' }
    ]
  }
];

async function seed() {
  await sequelize.sync();
  
  console.log('Seeding experience...');
  for (const exp of experienceData) {
    const exists = await Experience.findByPk(exp.id);
    if (!exists) {
      await Experience.create(exp);
      console.log(`✅ Added Experience: ${exp.role}`);
    }
  }
  console.log('Done!');
  process.exit();
}

seed();
