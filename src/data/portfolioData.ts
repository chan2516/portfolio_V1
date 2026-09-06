import {
  CandidateContact,
  CandidateStats,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  CertificationItem,
  CodeSnippet,
} from '../types';

export const candidateInfo = {
  name: 'CHANDAN VISHWAKARMA',
  title: 'Java Developer | Software Engineer | SDE-1',
  roleBadge: 'Enterprise Java 17 & Microservices Specialist',
  summary:
    'Java Developer with 1+ year of professional experience building enterprise applications, RESTful microservices, and secure integrations using Java 17, Spring Boot, Spring Security, and JPA/Hibernate. Integrated 3+ banking APIs within a live ERP platform and contributed to API design, production troubleshooting, documentation, and CI/CD deployments. Also built and deployed 2 full-stack applications using Next.js / React.js, Spring Boot, JWT/RBAC, SQL, Docker, automated testing, and cloud platforms.',
  bioParagraphs: [
    'Specializing in robust backend architecture with Java 17 and Spring Boot 3, I bring hands-on experience designing distributed microservices, implementing high-throughput banking payment integrations, and enforcing enterprise-grade security protocols.',
    'My engineering approach emphasizes scalable design patterns, RESTful API documentation with OpenAPI/Swagger, containerized deployments on AWS EC2 & Ubuntu Linux, and database query optimization across PostgreSQL and MySQL.',
  ],
  status: 'Open to SDE-1 / Software Engineer Opportunities',
};

export const contactData: CandidateContact = {
  phone: '+91-7208342941',
  email: 'chandanvishwakarma2038@gmail.com',
  location: 'Mumbai, Maharashtra, India',
  linkedin: 'linkedin.com/in/chan2004',
  linkedinUrl: 'https://linkedin.com/in/chan2004',
  github: 'github.com/Chan236',
  githubUrl: 'https://github.com/Chan236',
};

export const candidateStats: CandidateStats[] = [
  {
    label: 'Professional Experience',
    value: '1+ Year',
    description: 'Enterprise ERP & Core Java Engineering',
  },
  {
    label: 'Live Banking APIs',
    value: '3+ Integrated',
    description: 'Secure transactions & auto-reconciliation',
  },
  {
    label: 'Full-Stack Apps Deployed',
    value: '2 Production Apps',
    description: 'Docker, AWS, Render & Next.js/React',
  },
  {
    label: 'B.Sc. IT Academic CGPA',
    value: '8.6 / 10',
    description: 'SIES College, University of Mumbai',
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'strategic-erp',
    role: 'Java Developer',
    company: 'Strategic ERP Solutions',
    location: 'Mumbai, Maharashtra',
    period: 'September 2025 – Present',
    current: true,
    description:
      'Spearheading enterprise microservices development, banking API integrations, and core financial modules within a live ERP platform handling real-time transactions.',
    bullets: [
      'Engineered RESTful microservices integrating 3+ banking APIs into the ERP platform, enabling secure transactions, automated reconciliation, and real-time financial reporting.',
      'Built and maintained JSP-based frontend modules with Spring MVC backend, optimizing data rendering across financial dashboards.',
      'Implemented Spring Security configurations and session management to meet client-mandated security standards.',
      'Designed and documented REST endpoints using Swagger/OpenAPI, cutting new developer onboarding time by 40%.',
      'Collaborated in Agile/Scrum sprints with QA and DevOps teams on CI/CD deployments to Ubuntu Linux servers.',
      'Diagnosed and resolved critical production bugs in ERP financial modules using systematic logging and root-cause analysis, minimizing downtime.',
    ],
    techStack: [
      'Java 17',
      'Spring Boot',
      'Spring Security',
      'Spring MVC',
      'Hibernate / JPA',
      'Banking APIs',
      'PostgreSQL',
      'Swagger / OpenAPI',
      'Ubuntu Linux',
      'Maven',
      'CI/CD',
    ],
    metrics: [
      { label: 'Onboarding Time Saved', value: '40%' },
      { label: 'Banking Gateways', value: '3+' },
      { label: 'System Uptime Impact', value: 'High' },
    ],
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: 'localcart',
    title: 'LocalCart',
    subtitle: 'Full-Stack Multi-Vendor Marketplace',
    category: 'Full-Stack',
    summary:
      'Comprehensive enterprise e-commerce platform built with Next.js and Java Spring Boot REST API backend, orchestrated into 5 containerized microservices on AWS EC2 with automated CI/CD and zero-downtime updates.',
    bullets: [
      'Developed a comprehensive e-commerce platform by engineering a Next.js frontend coupled with a Java Spring Boot REST API backend.',
      'Designed automated CI/CD workflows using GitHub Actions to build and distribute multi-stage Docker images to remote registries.',
      'Provisioned AWS EC2 Linux environments to host 5 containerized services orchestrated via Docker Compose for caching, proxying, and data persistence.',
      'Integrated Nginx as a reverse proxy to manage traffic flow and implemented SSL/HTTPS encryption protocols using Certbot.',
      'Achieved zero-downtime updates by deploying Watchtower for automated container synchronization and lifecycle management.',
    ],
    techStack: [
      'Next.js',
      'Java Spring Boot',
      'PostgreSQL',
      'Redis',
      'Docker Compose',
      'AWS EC2',
      'GitHub Actions',
      'Nginx',
      'Certbot (SSL)',
      'Watchtower',
    ],
    features: [
      'Multi-Vendor Storefront & Vendor Portals',
      'Redis In-Memory Session & Catalog Caching',
      'Automated Multi-Stage Docker Builds',
      'Zero-Downtime Rolling Container Updates via Watchtower',
      'Nginx Reverse Proxy with TLS/SSL Termination',
    ],
    architectureDetails: [
      {
        title: 'Edge & Ingress Layer',
        desc: 'Nginx reverse proxy on AWS EC2 forwarding requests with SSL/TLS encryption handled via automated Certbot certificates.',
        badge: 'Nginx + Certbot',
      },
      {
        title: 'Client Layer',
        desc: 'Server-Side Rendered (SSR) & Static Generation using Next.js with responsive multi-vendor interfaces and payment checkouts.',
        badge: 'Next.js 14',
      },
      {
        title: 'Core Business API',
        desc: 'Java 17 Spring Boot microservice running stateless REST APIs with transactional integrity, data validation, and JWT security.',
        badge: 'Spring Boot 3',
      },
      {
        title: 'Persistence & Cache',
        desc: 'PostgreSQL relational database paired with Redis distributed cache for fast product querying and session throttling.',
        badge: 'PostgreSQL + Redis',
      },
      {
        title: 'CI/CD & DevOps',
        desc: 'GitHub Actions triggered builds pushing to Docker Hub, synchronized on EC2 automatically via Watchtower daemon.',
        badge: 'GitHub Actions + Watchtower',
      },
    ],
    githubUrl: 'https://github.com/Chan236',
    liveUrl: 'https://github.com/Chan236',
    metrics: [
      { label: 'Container Services', value: '5 Containers' },
      { label: 'Deployment Uptime', value: 'Zero-Downtime' },
      { label: 'Cloud Infrastructure', value: 'AWS EC2 Linux' },
    ],
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    subtitle: 'Agile Task Management & Kanban System',
    category: 'Full-Stack',
    summary:
      'Full-stack agile management suite featuring real-time task lifecycle tracking, role-based member assignment, JWT auth with refresh-token rotation, and interactive Kanban boards deployed on Render.',
    bullets: [
      'Developed a full-stack project management tool supporting project creation, task tracking, member assignment, and Kanban workflow.',
      'Built JWT authentication with refresh-token rotation and REST APIs using pagination, filtering, and sorting.',
      'Implemented React Context API state management and drag-and-drop Kanban UI; deployed backend on Render with PostgreSQL.',
    ],
    techStack: [
      'Java 17',
      'Spring Boot 3',
      'Spring Security',
      'JWT Auth & Refresh Rotation',
      'React.js',
      'PostgreSQL',
      'Spring Data JPA',
      'Render Cloud',
    ],
    features: [
      'Interactive Drag-and-Drop Kanban Board with Status Columns',
      'Stateless JWT Authentication with Secure Refresh-Token Rotation',
      'Dynamic Pagination, Column Sorting, and Full-Text Filter APIs',
      'RBAC (Role-Based Access Control) for Project Owners and Assignees',
      'Cloud-hosted Backend on Render connected to PostgreSQL',
    ],
    architectureDetails: [
      {
        title: 'Frontend Interface',
        desc: 'React.js application with Context API centralized state management, responsive Kanban column interactions, and real-time feedback.',
        badge: 'React.js + Context API',
      },
      {
        title: 'Security & Auth Subsystem',
        desc: 'Spring Security filter chain validating bearer tokens, short-lived JWT generation, and secure httpOnly refresh-token rotation.',
        badge: 'JWT + Spring Security',
      },
      {
        title: 'Data & Query Layer',
        desc: 'Spring Data JPA repositories executing optimized queries with pageable parameters, indexed foreign keys, and entity relations.',
        badge: 'Spring Data JPA + PostgreSQL',
      },
      {
        title: 'Hosting & Deployment',
        desc: 'Deployed on Render cloud infrastructure with managed PostgreSQL instance and automated Git branch releases.',
        badge: 'Render + PostgreSQL',
      },
    ],
    githubUrl: 'https://github.com/Chan236',
    liveUrl: 'https://github.com/Chan236',
    metrics: [
      { label: 'Security Model', value: 'JWT + Refresh Rotation' },
      { label: 'Cloud Host', value: 'Render + Managed DB' },
      { label: 'Workflow', value: 'Interactive Kanban' },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    category: 'Languages',
    description: 'Core programming and scripting languages for systems and web development',
    skills: ['Java 8 & 17', 'JavaScript (ES6+)', 'SQL', 'HTML5', 'CSS3'],
    featured: true,
  },
  {
    id: 'core-java',
    category: 'Core Java',
    description: 'Deep foundation in object-oriented architecture, concurrency, and modern Java features',
    skills: [
      'OOP (Object-Oriented Programming)',
      'Collections Framework',
      'Multithreading & Concurrency',
      'Streams API & Lambdas',
      'Exception Handling',
      'Generics & Functional Interfaces',
    ],
    featured: true,
  },
  {
    id: 'backend',
    category: 'Backend & Frameworks',
    description: 'Enterprise Java frameworks powering scalable, secure microservices',
    skills: [
      'Spring Boot 3',
      'Spring MVC',
      'Spring Security',
      'Spring Data JPA',
      'Hibernate ORM',
      'JSP / Servlets',
      'Thymeleaf',
    ],
    featured: true,
  },
  {
    id: 'architecture',
    category: 'Architecture & APIs',
    description: 'Designing distributed microservices, secure authentication, and clear contracts',
    skills: [
      'Microservices Architecture',
      'RESTful API Design',
      'Banking API Integrations',
      'JWT Authentication & RBAC',
      'MVC Pattern',
      'API Idempotency & Reconciliation',
    ],
    featured: true,
  },
  {
    id: 'databases',
    category: 'Databases & Persistence',
    description: 'Relational database schema modeling, connection pooling, and query tuning',
    skills: ['PostgreSQL', 'MySQL', 'JDBC', 'Redis Caching', 'Database Migrations'],
  },
  {
    id: 'frontend',
    category: 'Frontend & UI',
    description: 'Modern component-driven web interfaces, state management, and SSR',
    skills: ['Next.js', 'React.js', 'Axios', 'Bootstrap 5', 'Tailwind CSS', 'Context API'],
  },
  {
    id: 'devops',
    category: 'DevOps & Tools',
    description: 'Containerization, continuous integration, cloud instances, and developer tooling',
    skills: [
      'Docker & Docker Compose',
      'Git & GitHub',
      'Maven',
      'CI/CD Pipelines (GitHub Actions)',
      'AWS EC2',
      'Ubuntu Linux',
      'Nginx Reverse Proxy',
      'Postman',
      'Swagger / OpenAPI',
      'Apache Tomcat',
      'Watchtower',
    ],
    featured: true,
  },
  {
    id: 'testing',
    category: 'Testing & Quality',
    description: 'Automated test coverage for controllers, service logic, and API endpoints',
    skills: ['JUnit 5', 'Mockito', 'Spring Boot Test', 'Postman API Testing', 'Integration Testing'],
  },
];

export const educationData: EducationItem[] = [
  {
    id: 'sies-college',
    degree: 'Bachelor of Science in Information Technology (B.Sc. IT)',
    institution: 'SIES College of Arts, Science and Commerce',
    location: 'Mumbai, Maharashtra',
    period: '2022 – 2025',
    cgpa: '8.6 / 10',
    highlights: [
      'Strong academic performance graduating with an impressive 8.6 / 10 CGPA.',
      'Comprehensive study in Object-Oriented Programming with Java, Relational Database Management Systems, Data Structures, Software Engineering, and Operating Systems.',
      'Led academic project demonstrations focusing on full-stack Java and database normalization.',
    ],
  },
];

export const certificationsData: CertificationItem[] = [
  {
    id: 'quastech-java',
    title: 'Full Stack Java Development Training',
    issuer: 'QUASTECH',
    year: '2025',
    skillsCovered: [
      'Core Java 17 (OOP, Multithreading, Collections)',
      'Spring Boot & Spring MVC',
      'Hibernate & JPA ORM',
      'REST APIs & Microservices',
      'Frontend with HTML/CSS/JS/React',
      'MySQL & Database Connectivity',
    ],
  },
  {
    id: 'udemy-docker',
    title: 'Docker for Developers',
    issuer: 'Udemy',
    year: '2026',
    skillsCovered: [
      'Multi-Stage Dockerfile Optimization',
      'Docker Compose Orchestration',
      'Container Networking & Volumes',
      'CI/CD Pipelines with Docker Hub & EC2',
      'Production Security Hardening',
    ],
  },
];

export const sampleCodeSnippets: CodeSnippet[] = [
  {
    id: 'banking-service',
    title: 'Banking Webhook & Auto-Reconciliation Service',
    filename: 'BankingReconciliationService.java',
    language: 'java',
    description:
      'Production-grade Spring Boot service demonstrating transactional banking webhook ingestion, cryptographic signature verification, and automated reconciliation.',
    code: `@Service
@Slf4j
@RequiredArgsConstructor
public class BankingReconciliationService {

    private final TransactionRepository transactionRepo;
    private final BankingClient bankingClient;
    private final ReconciliationAuditLogger auditLogger;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ReconciliationResponse processWebhook(
            String payload, 
            String bankSignatureHeader, 
            String idempotencyKey) {

        // 1. Verify bank payload cryptographic signature
        if (!bankingClient.verifyHmacSignature(payload, bankSignatureHeader)) {
            log.error("Invalid HMAC signature received from Banking Gateway");
            throw new SecurityException("Tampered webhook signature detected");
        }

        // 2. Prevent duplicate processing via Idempotency Key check
        if (transactionRepo.existsByIdempotencyKey(idempotencyKey)) {
            log.info("Duplicate webhook event skipped for key: {}", idempotencyKey);
            return ReconciliationResponse.duplicateAcknowledged(idempotencyKey);
        }

        // 3. Parse incoming transaction record
        BankTransactionDTO bankTx = bankingClient.parseTransaction(payload);

        // 4. Update ERP ledger state and trigger auto-reconciliation
        ErpTransaction erpRecord = transactionRepo.findByReferenceId(bankTx.getReferenceId())
            .orElseThrow(() -> new EntityNotFoundException("Ledger transaction not found"));

        erpRecord.reconcileWith(bankTx.getAmount(), bankTx.getSettlementTimestamp());
        transactionRepo.save(erpRecord);

        // 5. Audit log event for compliance
        auditLogger.recordAudit("RECONCILED", erpRecord.getId(), bankTx.getGatewayReference());

        return ReconciliationResponse.success(erpRecord.getId(), "Reconciliation completed");
    }
}`,
  },
  {
    id: 'jwt-security',
    title: 'Spring Security 6 Stateless JWT Filter Configuration',
    filename: 'SecurityConfig.java',
    language: 'java',
    description:
      'Stateless Spring Security configuration enforcing Role-Based Access Control (RBAC), CSRF disabling for REST, and JWT filter chain evaluation.',
    code: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/actuator/health"
                ).permitAll()
                .requestMatchers("/api/v1/erp/banking/**").hasAnyRole("FINANCE_ADMIN", "SYSTEM_SDE")
                .requestMatchers("/api/v1/projects/**").authenticated()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}`,
  },
  {
    id: 'docker-compose',
    title: 'LocalCart 5-Container Docker Compose Topology',
    filename: 'docker-compose.yml',
    language: 'yaml',
    description:
      'Multi-container architecture hosting Next.js frontend, Spring Boot API, PostgreSQL, Redis, and Watchtower on AWS EC2.',
    code: `version: '3.8'

services:
  # 1. Reverse Proxy & SSL Gateway
  nginx:
    image: nginx:alpine
    container_name: localcart-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend-api
    restart: unless-stopped

  # 2. Next.js SSR Frontend
  frontend:
    image: chan236/localcart-frontend:latest
    container_name: localcart-frontend
    environment:
      - NEXT_PUBLIC_API_URL=https://api.localcart.internal
    restart: unless-stopped

  # 3. Java 17 Spring Boot REST API
  backend-api:
    image: chan236/localcart-backend:latest
    container_name: localcart-api
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db:5432/localcart
      - SPRING_REDIS_HOST=redis-cache
    depends_on:
      - postgres-db
      - redis-cache
    restart: unless-stopped

  # 4. PostgreSQL Relational Persistence
  postgres-db:
    image: postgres:15-alpine
    container_name: localcart-postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  # 5. Redis In-Memory Cache
  redis-cache:
    image: redis:7-alpine
    container_name: localcart-redis
    restart: unless-stopped

  # Automated Zero-Downtime Deployment
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 300 --cleanup

volumes:
  pgdata:`,
  },
];
