import type { Post, PostMetadata } from '../../entities/post/types';

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Parse markdown frontmatter
 */
export const parseFrontmatter = (markdown: string): { 
  metadata: Record<string, unknown>; 
  content: string;
} => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const [, frontmatterString, content] = match;
  const metadata: Record<string, unknown> = {};

  frontmatterString.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/['"]/g, ''));
      } else {
        metadata[key.trim()] = value.replace(/['"]/g, '');
      }
    }
  });

  return { metadata, content: content.trim() };
};

/**
 * Mock posts for development
 * In production, these would come from markdown files or a CMS
 */
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Clean Architecture na Prática',
    date: '2024-02-15',
    tags: ['Arquitetura', 'Clean Code', 'Backend'],
    readingTime: 5,
    slug: 'clean-architecture-na-pratica',
    excerpt:
      'Como aplicar os princípios de Clean Architecture em projetos reais para construir sistemas mais manuteníveis e escaláveis.',
    content: `
# Clean Architecture na Prática

Clean Architecture é uma abordagem de design de software que visa criar sistemas independentes de frameworks, testáveis e manuteníveis.

## Princípios Fundamentais

1. **Independência de Frameworks**: A arquitetura não depende de bibliotecas externas
2. **Testabilidade**: Regras de negócio podem ser testadas sem UI, banco de dados, etc.
3. **Independência de UI**: A UI pode mudar facilmente
4. **Independência de Banco de Dados**: Regras de negócio não estão vinculadas ao banco
5. **Independência de Agentes Externos**: Regras de negócio não conhecem nada sobre o mundo exterior

## Camadas da Arquitetura

- **Entities**: Regras de negócio da empresa
- **Use Cases**: Regras de negócio da aplicação
- **Interface Adapters**: Conversão de dados
- **Frameworks & Drivers**: Detalhes de implementação
    `,
  },
  {
    id: '2',
    title: 'Integrações Corporativas: Desafios e Soluções',
    date: '2024-02-10',
    tags: ['Integração', 'Enterprise', 'SAP'],
    readingTime: 7,
    slug: 'integracoes-corporativas-desafios-e-solucoes',
    excerpt:
      'Experiências e aprendizados na integração de sistemas legados com ambientes enterprise como SAP.',
    content: `
# Integrações Corporativas: Desafios e Soluções

Integrar sistemas corporativos é um dos maiores desafios no desenvolvimento enterprise.

## Desafios Comuns

1. **Sistemas Legados**: Código antigo sem documentação
2. **Protocolos Diversos**: SOAP, REST, RFC, etc.
3. **Dados Inconsistentes**: Falta de padronização
4. **Performance**: Alto volume de transações
5. **Segurança**: Autenticação e autorização complexas

## Soluções Aplicadas

- Camadas de abstração
- Padrões de integração (Enterprise Integration Patterns)
- Message brokers (RabbitMQ, Kafka)
- Circuit breakers para resiliência
- Retry policies e idempotência
    `,
  },
  {
    id: '3',
    title: 'Processamento Assíncrono com RabbitMQ',
    date: '2024-02-05',
    tags: ['Mensageria', 'RabbitMQ', 'Performance'],
    readingTime: 6,
    slug: 'processamento-assincrono-com-rabbitmq',
    excerpt:
      'Como utilizar RabbitMQ para criar sistemas assíncronos resilientes e escaláveis.',
    content: `
# Processamento Assíncrono com RabbitMQ

RabbitMQ é um message broker robusto que facilita a comunicação assíncrona entre serviços.

## Por que usar Mensageria?

- **Desacoplamento**: Serviços não precisam conhecer uns aos outros
- **Escalabilidade**: Adicione consumers conforme necessário
- **Resiliência**: Mensagens não se perdem em caso de falhas
- **Balanceamento**: Distribui carga entre múltiplos workers

## Padrões de Uso

1. **Work Queues**: Distribuição de tarefas pesadas
2. **Publish/Subscribe**: Notificações para múltiplos consumidores
3. **Routing**: Mensagens direcionadas por critérios
4. **Topics**: Padrões de roteamento complexos
5. **RPC**: Chamadas remotas assíncronas
    `,
  },
];

/**
 * Get all posts
 */
export const getAllPosts = async (): Promise<PostMetadata[]> => {
  // In production, this would read from markdown files or fetch from an API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return mockPosts.map(({ content, ...metadata }) => metadata);
};

/**
 * Get post by slug
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  // In production, this would read the specific markdown file
  const post = mockPosts.find((p) => p.slug === slug);
  return post || null;
};

/**
 * Get posts by tag
 */
export const getPostsByTag = async (tag: string): Promise<PostMetadata[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
};

/**
 * Get all unique tags
 */
export const getAllTags = async (): Promise<string[]> => {
  const allPosts = await getAllPosts();
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};
