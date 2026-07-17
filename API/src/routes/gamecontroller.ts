import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../lib/prisma';

import { bodySchema, gameSchema, idParamSchema, searchQuerySchema, rawgSearchQuerySchema } from '../schemas/gameSchema';

interface JwtPayload {
  id: string;
  email: string;
}

export const gamecontroller: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>();

  // Proteger todas as rotas de jogos
  app.addHook('onRequest', app.authenticate);

  // Criar jogo
  app.post('/Games', {
    schema: {
      body: bodySchema,
      response: {
        201: gameSchema,
        400: z.object({ error: z.string() }),
        409: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{ Body: z.infer<typeof bodySchema> }>,
    reply
  ) => {
    try {
      const data = request.body;
      const user = request.user as JwtPayload;

      const gameExistente = await prisma.game.findFirst({ 
        where: { title: data.title, userId: user.id } 
      });
      if (gameExistente) {
        return reply.status(409).send({ error: 'Você já possui um jogo com este título no seu backlog.' });
      }

      const novoGame = await prisma.game.create({ 
        data: { ...data, userId: user.id } 
      });
      reply.status(201).send(novoGame);
    } catch (error) {
      request.log.error({ error }, 'Erro interno no servidor ao criar jogo.');
      reply.status(500).send({ error: 'Erro interno no servidor.' });
    }
  });

  // Listar todos
  app.get('/Games', {
    schema: {
      response: {
        200: z.array(gameSchema),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (request, reply) => {
    try {
      const user = request.user as JwtPayload;
      const games = await prisma.game.findMany({
        where: { userId: user.id }
      });
      reply.send(games);
    } catch (error) {
      request.log.error({ error }, 'Erro ao buscar os jogos.');
      reply.status(500).send({ error: 'Erro ao buscar os jogos.' });
    }
  });

  // Buscar por título, status ou gênero
  app.get('/Games/search', {
    schema: {
      querystring: searchQuerySchema,
      response: {
        200: z.array(gameSchema),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{ Querystring: z.infer<typeof searchQuerySchema> }>,
    reply
  ) => {
    try {
      const { title, status, genre } = request.query;
      const user = request.user as JwtPayload;

      const games = await prisma.game.findMany({
        where: {
          userId: user.id,
          AND: [
            title ? { title: { contains: title } } : {},
            status ? { status } : {},
            genre ? { genre: { contains: genre } } : {},
          ],
        },
      });

      reply.send(games);
    } catch (error) {
      request.log.error({ error }, 'Erro ao buscar os jogos filtrados.');
      reply.status(500).send({ error: 'Erro ao buscar os jogos.' });
    }
  });

  // Buscar na RAWG
  app.get('/Games/rawg-search', {
    schema: {
      querystring: rawgSearchQuerySchema,
    },
  }, async (
    request: FastifyRequest<{ Querystring: z.infer<typeof rawgSearchQuerySchema> }>,
    reply
  ) => {
    try {
      const { q } = request.query;
      const apiKey = process.env.RAWG_API_KEY;

      if (!apiKey) {
        request.log.warn('RAWG_API_KEY não está configurada no .env');
        return reply.status(500).send({ error: 'Configuração da API ausente no servidor.' });
      }

      const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(q)}&key=${apiKey}&page_size=5`);
      
      if (!response.ok) {
        request.log.error({ status: response.status }, 'Erro na API da RAWG');
        return reply.status(500).send({ error: 'Erro ao buscar jogos externos.' });
      }

      const data = await response.json();
      
      const results = data.results.map((game: any) => ({
        title: game.name,
        coverUrl: game.background_image,
        genre: game.genres?.[0]?.name || 'Desconhecido',
        metacritic: game.metacritic || null,
      }));

      reply.send(results);
    } catch (error) {
      request.log.error({ error }, 'Erro ao buscar jogos na RAWG.');
      reply.status(500).send({ error: 'Erro interno ao buscar jogos externos.' });
    }
  });

  // Atualizar pelo ID
  app.put('/Games/:id', {
    schema: {
      params: idParamSchema,
      body: bodySchema,
      response: {
        200: gameSchema,
        404: z.object({ error: z.string() }),
        409: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{
      Params: z.infer<typeof idParamSchema>;
      Body: z.infer<typeof bodySchema>;
    }>,
    reply
  ) => {
    try {
      const { id } = request.params;
      const data = request.body;
      const user = request.user as JwtPayload;

      const gameExistente = await prisma.game.findUnique({ where: { id } });

      if (!gameExistente || gameExistente.userId !== user.id) {
        return reply.status(404).send({ error: 'Jogo não encontrado.' });
      }

      if (data.title !== gameExistente.title) {
        const titleConflict = await prisma.game.findFirst({ 
          where: { title: data.title, userId: user.id } 
        });
        if (titleConflict) {
          return reply.status(409).send({ error: 'Você já possui um jogo com este título.' });
        }
      }

      const updatedGame = await prisma.game.update({
        where: { id },
        data,
      });

      reply.send(updatedGame);
    } catch (error) {
      request.log.error({ error }, 'Erro ao atualizar o jogo.');
      reply.status(500).send({ error: 'Erro ao atualizar o jogo.' });
    }
  });

  // Deletar pelo ID
  app.delete('/Games/:id', {
    schema: {
      params: idParamSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{ Params: z.infer<typeof idParamSchema> }>,
    reply
  ) => {
    try {
      const { id } = request.params;
      const user = request.user as JwtPayload;
      
      request.log.info({ id }, 'Tentando deletar jogo');

      const game = await prisma.game.findUnique({ where: { id } });

      if (!game || game.userId !== user.id) {
        request.log.warn({ id }, 'Jogo não encontrado para deleção');
        return reply.status(404).send({ error: 'Jogo não encontrado.' });
      }

      await prisma.game.delete({
        where: { id },
      });

      reply.send({ message: 'Jogo deletado com sucesso.' });
    } catch (error) {
      request.log.error({ error }, 'Erro ao deletar jogo');
      reply.status(500).send({ error: 'Erro ao deletar o jogo.' });
    }
  });
};
