// Portfolio content — all user-visible texts organized by section.
// Update this file to change any text shown in the portfolio.

export const hero = {
  name: 'Mara Moreira',
  title: 'Backend Developer | Full Stack Developer | Systems Integration | Software Architecture',
  tagline: 'Transformando problemas complexos em soluções escaláveis, resilientes e sustentáveis.',
  description:
    'Desenvolvedora Web Full Stack com foco em Back-End, arquitetura de software e integrações corporativas. Experiência no desenvolvimento de APIs, processamento de documentos fiscais eletrônicos e integração com ambientes enterprise, incluindo SAP.\n\nAtuação baseada em Clean Architecture, princípios SOLID e sistemas distribuídos, com foco em manutenibilidade, performance e evolução contínua dos sistemas.',
};

export const professionalSummary = {
  title: 'Professional Summary',
  intro:
    'Software Developer com atuação em desenvolvimento backend e integração de sistemas corporativos.',
  experienceLabel: 'Experiência em:',
  items: [
    'desenvolvimento de APIs REST',
    'processamento assíncrono e mensageria',
    'sistemas fiscais eletrônicos (NF-e, NFSe, DFe)',
    'integração entre sistemas enterprise',
    'modernização de código legado',
    'arquitetura desacoplada e orientada a domínio',
  ],
  closing: 'Foco na construção de software confiável, observável e preparado para crescimento.',
};

export const coreCompetencies = {
  title: 'Core Competencies',
  items: [
    'Backend Development (.NET / ASP.NET Core)',
    'Systems Integration',
    'Software Architecture',
    'Distributed Systems',
    'Event-Driven Architecture',
    'API Design',
    'Enterprise Integration (SAP)',
    'Messaging Systems',
    'Legacy System Refactoring',
    'Observability & Reliability',
    'Secure Software Development',
  ],
};

export const technicalSkills = {
  title: 'Technical Skills',
  categories: [
    {
      name: 'Backend Development',
      items: [
        'C#',
        '.NET / ASP.NET Core',
        'REST API Development',
        'Entity Framework Core',
        'Clean Architecture',
        'SOLID Principles',
        'Design Patterns',
        'Domain-Driven Design (DDD)',
      ],
    },
    {
      name: 'Messaging & Async Processing',
      items: [
        'RabbitMQ',
        'Message Queues',
        'Background Workers',
        'Event Processing',
        'Retry Strategies',
        'Circuit Breaker Patterns',
      ],
    },
    {
      name: 'Enterprise & Integration',
      items: [
        'SAP Integration',
        'Corporate Systems Integration',
        'Electronic Fiscal Documents (NF-e, NFSe, DFe)',
        'Legacy Systems Integration',
      ],
    },
    {
      name: 'Databases & Infrastructure',
      items: ['SQL Server', 'MySQL', 'Docker', 'AWS (Cloud Fundamentals)'],
    },
    {
      name: 'Frontend (Support Stack)',
      items: ['React', 'TypeScript', 'Next.js', 'Styled Components', 'HTML5 / CSS3'],
    },
  ],
};

export const engineeringPrinciples = {
  title: 'Engineering Principles',
  items: [
    {
      icon: '🛡️',
      name: 'Resilient Systems',
      description:
        'Aplicações preparadas para falhas com retry strategies, isolamento de serviços e graceful degradation.',
    },
    {
      icon: '🔧',
      name: 'Maintainable Code',
      description: 'Código modular, testável e orientado à evolução contínua.',
    },
    {
      icon: '🏗️',
      name: 'Decoupled Architecture',
      description: 'Separação clara de responsabilidades com baixo acoplamento e alta coesão.',
    },
    {
      icon: '📊',
      name: 'Observability',
      description:
        'Logging estruturado, métricas e tracing distribuído para monitoramento em produção.',
    },
    {
      icon: '🔐',
      name: 'Security by Design',
      description:
        'Validação de entrada, autenticação segura e proteção contra vulnerabilidades desde o design da solução.',
    },
    {
      icon: '⚡',
      name: 'High-Performance APIs',
      description:
        'APIs REST com validação consistente, controle de acesso e foco em performance.',
    },
  ],
};

export const areasOfExpertise = {
  title: 'Areas of Expertise',
  items: [
    { icon: '🔗', label: 'Systems Integration' },
    { icon: '📨', label: 'Messaging & Event Processing' },
    { icon: '🏗', label: 'Backend Architecture' },
    { icon: '📄', label: 'Electronic Fiscal Systems (NF-e, NFSe, DFe)' },
    { icon: '📊', label: 'Observability & Monitoring' },
    { icon: '⚡', label: 'Performance Optimization' },
    { icon: '🔐', label: 'Secure API Development' },
  ],
};

export const technicalArticles = {
  title: 'Technical Articles',
  posts: [
    {
      title: 'Clean Architecture na Prática',
      excerpt:
        'Aplicação prática de princípios arquiteturais para sistemas mais manuteníveis e escaláveis.',
    },
    {
      title: 'Integrações Corporativas: Desafios e Soluções',
      excerpt:
        'Aprendizados na integração entre sistemas legados e plataformas enterprise como SAP.',
    },
    {
      title: 'Processamento Assíncrono com RabbitMQ',
      excerpt:
        'Uso de mensageria para construção de sistemas assíncronos resilientes.',
    },
  ],
};
