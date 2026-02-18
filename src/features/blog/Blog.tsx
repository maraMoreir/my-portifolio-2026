import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Card, Tag } from '../../shared/components/Card';
import type { PostMetadata } from '../../entities/post/types';
import { getAllPosts, getAllTags } from '../../infrastructure/services/blogService';

// TODO: Extract UI strings to i18n configuration for multi-language support
// Currently using Portuguese (pt-BR) as primary language for Brazilian market


const BlogContainer = styled(Section)``;

const Title = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

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
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostMetadata[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allPosts, allTags] = await Promise.all([
          getAllPosts(),
          getAllTags(),
        ]);
        
        // Sort posts by date (newest first)
        const sortedPosts = allPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
        setTags(allTags);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setFilteredPosts(posts.filter((post) => post.tags.includes(selectedTag)));
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedTag, posts]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <BlogContainer id="blog">
        <Container>
          <Title>Novidades</Title>
          <EmptyState>Carregando...</EmptyState>
        </Container>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer id="blog">
      <Container>
        <Title
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Novidades
        </Title>

        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FilterBar>
              <FilterTag
                $active={selectedTag === null}
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </FilterTag>
              {tags.map((tag) => (
                <FilterTag
                  key={tag}
                  $active={selectedTag === tag}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </FilterTag>
              ))}
            </FilterBar>
          </motion.div>
        )}

        {filteredPosts.length === 0 ? (
          <EmptyState>Nenhum post encontrado.</EmptyState>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid $columns={2}>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} $glass>
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
          </motion.div>
        )}
      </Container>
    </BlogContainer>
  );
};
