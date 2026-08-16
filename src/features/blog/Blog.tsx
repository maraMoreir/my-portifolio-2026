import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Card, Tag } from '../../shared/components/Card';
import { SectionTitle } from '../../shared/components/SectionTitle';
import { FadeInWhenVisible } from '../../shared/animations/FadeInWhenVisible';
import { formatDate } from '../../shared/utils/formatDate';
import { useBlogPosts } from './hooks/useBlogPosts';

// TODO: Extract UI strings to i18n configuration for multi-language support
// Currently using Portuguese (pt-BR) as primary language for Brazilian market


const BlogContainer = styled(Section)``;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  justify-content: center;
`;

const FilterTag = styled(Tag)<{ $active?: boolean }>`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'rgba(123, 44, 255, 0.2)'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }
`;

const PostCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PostDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const PostExcerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ReadingTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Blog: React.FC = () => {
  const { posts, tags, selectedTag, toggleTag, clearTag, isLoading, error } =
    useBlogPosts();

  if (isLoading) {
    return (
      <BlogContainer id="blog">
        <Container>
          <SectionTitle>Novidades</SectionTitle>
          <EmptyState>Carregando...</EmptyState>
        </Container>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer id="blog">
      <Container>
        <SectionTitle>Novidades</SectionTitle>

        {error ? (
          <EmptyState role="alert">{error}</EmptyState>
        ) : (
          <>
            {tags.length > 0 && (
              <FadeInWhenVisible delay={0.1}>
                <FilterBar>
                  <FilterTag $active={selectedTag === null} onClick={clearTag}>
                    Todos
                  </FilterTag>
                  {tags.map((tag) => (
                    <FilterTag
                      key={tag}
                      $active={selectedTag === tag}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </FilterTag>
                  ))}
                </FilterBar>
              </FadeInWhenVisible>
            )}

            {posts.length === 0 ? (
              <EmptyState>Nenhum post encontrado.</EmptyState>
            ) : (
              <FadeInWhenVisible delay={0.2}>
                <Grid $columns={2}>
                  {posts.map((post) => (
                    <PostCard key={post.id} as={Link} to={`/blog/${post.slug}`} $glass>
                      <PostDate>{formatDate(post.date)}</PostDate>
                      <PostTitle>{post.title}</PostTitle>
                      {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
                      <PostMeta>
                        <PostTags>
                          {post.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </PostTags>
                        <ReadingTime>{post.readingTime} min</ReadingTime>
                      </PostMeta>
                    </PostCard>
                  ))}
                </Grid>
              </FadeInWhenVisible>
            )}
          </>
        )}
      </Container>
    </BlogContainer>
  );
};
