import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section } from '../../shared/components/Layout';
import { Button, Tag } from '../../shared/components/Card';
import { formatDate } from '../../shared/utils/formatDate';
import { useAuth } from '../../features/auth/hooks';
import * as adminPostsService from '../../services/postsApiService';
import type { AdminPostSummary } from '../../entities/post/types';

const DashboardSection = styled(Section)`
  align-items: flex-start;
  min-height: auto;
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const RowTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RowTitleText = styled.span`
  font-weight: 600;
`;

const RowMeta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled(Tag)<{ $published: boolean }>`
  background: ${({ $published }) => ($published ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
  border-color: ${({ $published }) => ($published ? '#2ecc71' : 'rgba(255, 255, 255, 0.3)')};
  color: ${({ $published }) => ($published ? '#2ecc71' : 'inherit')};
`;

const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<AdminPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPosts(await adminPostsService.getAllPostsAdmin());
    } catch {
      setError('Não foi possível carregar os posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleTogglePublish = async (post: AdminPostSummary) => {
    setPendingId(post.id);
    try {
      if (post.status === 'Published') {
        await adminPostsService.unpublishPost(post.id);
      } else {
        await adminPostsService.publishPost(post.id);
      }
      await loadPosts();
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (post: AdminPostSummary) => {
    if (!window.confirm(`Excluir "${post.title}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setPendingId(post.id);
    try {
      await adminPostsService.deletePost(post.id);
      await loadPosts();
    } finally {
      setPendingId(null);
    }
  };

  return (
    <DashboardSection>
      <Container $maxWidth="1000px">
        <Header>
          <div>
            <Title>Posts</Title>
            {user && <RowMeta>Logado como {user.name} ({user.email})</RowMeta>}
          </div>
          <HeaderActions>
            <Button as={Link} to="/admin/posts/new">
              Novo post
            </Button>
            <Button $variant="secondary" onClick={() => logout()}>
              Sair
            </Button>
          </HeaderActions>
        </Header>

        {isLoading ? (
          <EmptyState>Carregando...</EmptyState>
        ) : error ? (
          <EmptyState role="alert">{error}</EmptyState>
        ) : posts.length === 0 ? (
          <EmptyState>Nenhum post ainda. Crie o primeiro.</EmptyState>
        ) : (
          <Table>
            {posts.map((post) => (
              <Row key={post.id}>
                <RowTitle>
                  <RowTitleText>{post.title}</RowTitleText>
                  <RowMeta>
                    /{post.slug} · atualizado em {formatDate(post.updatedAt)}
                  </RowMeta>
                </RowTitle>
                <StatusBadge $published={post.status === 'Published'}>
                  {post.status === 'Published' ? 'Publicado' : 'Rascunho'}
                </StatusBadge>
                <RowActions>
                  <Button
                    as={Link}
                    to={`/admin/posts/${post.id}/edit`}
                    $variant="secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Editar
                  </Button>
                  <Button
                    $variant="secondary"
                    disabled={pendingId === post.id}
                    onClick={() => handleTogglePublish(post)}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    {post.status === 'Published' ? 'Despublicar' : 'Publicar'}
                  </Button>
                  <Button
                    $variant="secondary"
                    disabled={pendingId === post.id}
                    onClick={() => handleDelete(post)}
                    style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#ff6b6b' }}
                  >
                    Excluir
                  </Button>
                </RowActions>
              </Row>
            ))}
          </Table>
        )}
      </Container>
    </DashboardSection>
  );
};
