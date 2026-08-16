import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Button } from '../../shared/components/Card';
import { FormGroup, Label, Input, TextArea, ErrorText } from '../../shared/components/Form';
import * as adminPostsService from '../../services/postsApiService';
import { ApiError } from '../../services/http/httpClient';

const EditorSection = styled(Section)`
  align-items: flex-start;
  min-height: auto;
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PreviewPanel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  min-height: 240px;
  color: ${({ theme }) => theme.colors.textSecondary};

  h1, h2, h3 {
    color: ${({ theme }) => theme.colors.glow};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PostEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    adminPostsService
      .getPostByIdAdmin(id)
      .then((post) => {
        if (cancelled) return;
        setTitle(post.title);
        setExcerpt(post.excerpt ?? '');
        setTagsInput(post.tags.join(', '));
        setContent(post.content);
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar este post.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const input = { title, content, excerpt: excerpt || undefined, tags };
      if (id) {
        await adminPostsService.updatePost(id, input);
      } else {
        await adminPostsService.createPost(input);
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? (err.detail ?? err.message) : 'Não foi possível salvar o post.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <EditorSection>
        <Container $maxWidth="1000px">
          <EmptyState>Carregando...</EmptyState>
        </Container>
      </EditorSection>
    );
  }

  return (
    <EditorSection>
      <Container $maxWidth="1000px">
        <Title>{isEditing ? 'Editar post' : 'Novo post'}</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Título</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="excerpt">Resumo</Label>
            <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </FormGroup>

          <Grid $columns={2} $gap="24px">
            <FormGroup>
              <Label htmlFor="content">Conteúdo (Markdown)</Label>
              <TextArea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Pré-visualização</Label>
              <PreviewPanel>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '_Nada para mostrar ainda._'}</ReactMarkdown>
              </PreviewPanel>
            </FormGroup>
          </Grid>

          {error && <ErrorText role="alert">{error}</ErrorText>}

          <Actions>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/admin')}>
              Cancelar
            </Button>
          </Actions>
        </form>
      </Container>
    </EditorSection>
  );
};
