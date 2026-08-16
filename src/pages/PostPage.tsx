import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Container, Section } from '../shared/components/Layout';
import { Tag } from '../shared/components/Card';
import { formatDate } from '../shared/utils/formatDate';
import { postsService } from '../services/postsService';
import type { Post } from '../entities/post/types';

const PostSection = styled(Section)`
  align-items: flex-start;
  min-height: auto;
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.glow};
  }
`;

const PostHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PostDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReadingTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PostContent = styled.div`
  max-width: 760px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;

  h1, h2, h3 {
    margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.glow};
  }

  p, ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  code {
    background: rgba(123, 44, 255, 0.15);
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
  }

  pre {
    background: rgba(255, 255, 255, 0.05);
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    code {
      background: none;
      padding: 0;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.glow};
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    postsService
      .getPostBySlug(slug)
      .then((result) => {
        if (!cancelled) setPost(result);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      });

    return () => {
      cancelled = true;
    };
    // Resets to "loading" per slug via the key on the <Route> element in
    // app/App.tsx, so navigating between two post permalinks re-runs this
    // from a clean `post === undefined` state instead of flashing stale content.
  }, [slug]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (post === undefined) {
    return (
      <PostSection>
        <Container $maxWidth="900px">
          <EmptyState>Carregando...</EmptyState>
        </Container>
      </PostSection>
    );
  }

  if (post === null) {
    return (
      <PostSection>
        <Container $maxWidth="900px">
          <BackLink to="/#blog">&larr; Voltar para o blog</BackLink>
          <EmptyState>Post não encontrado.</EmptyState>
        </Container>
      </PostSection>
    );
  }

  return (
    <PostSection>
      <Container $maxWidth="900px">
        <BackLink to="/#blog">&larr; Voltar para o blog</BackLink>
        <PostHeader>
          <PostDate>{formatDate(post.date)}</PostDate>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            <ReadingTime>{post.readingTime} min de leitura</ReadingTime>
          </PostMeta>
        </PostHeader>
        <PostContent>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </PostContent>
      </Container>
    </PostSection>
  );
};
