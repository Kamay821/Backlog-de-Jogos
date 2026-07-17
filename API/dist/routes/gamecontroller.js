"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamecontroller = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const gameSchema_1 = require("../schemas/gameSchema");
const gamecontroller = async (app) => {
    app.withTypeProvider();
    // Proteger todas as rotas de jogos
    app.addHook('onRequest', app.authenticate);
    // Criar jogo
    app.post('/Games', {
        schema: {
            body: gameSchema_1.bodySchema,
            response: {
                201: gameSchema_1.gameSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }),
                409: zod_1.z.object({ error: zod_1.z.string() }),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const data = request.body;
            const user = request.user;
            const gameExistente = await prisma_1.prisma.game.findFirst({
                where: { title: data.title, userId: user.id }
            });
            if (gameExistente) {
                return reply.status(409).send({ error: 'Você já possui um jogo com este título no seu backlog.' });
            }
            const novoGame = await prisma_1.prisma.game.create({
                data: { ...data, userId: user.id }
            });
            reply.status(201).send(novoGame);
        }
        catch (error) {
            request.log.error({ error }, 'Erro interno no servidor ao criar jogo.');
            reply.status(500).send({ error: 'Erro interno no servidor.' });
        }
    });
    // Listar todos
    app.get('/Games', {
        schema: {
            response: {
                200: zod_1.z.array(gameSchema_1.gameSchema),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const user = request.user;
            const games = await prisma_1.prisma.game.findMany({
                where: { userId: user.id }
            });
            reply.send(games);
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao buscar os jogos.');
            reply.status(500).send({ error: 'Erro ao buscar os jogos.' });
        }
    });
    // Buscar por título, status ou gênero
    app.get('/Games/search', {
        schema: {
            querystring: gameSchema_1.searchQuerySchema,
            response: {
                200: zod_1.z.array(gameSchema_1.gameSchema),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { title, status, genre } = request.query;
            const user = request.user;
            const games = await prisma_1.prisma.game.findMany({
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
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao buscar os jogos filtrados.');
            reply.status(500).send({ error: 'Erro ao buscar os jogos.' });
        }
    });
    // Buscar na RAWG
    app.get('/Games/rawg-search', {
        schema: {
            querystring: gameSchema_1.rawgSearchQuerySchema,
        },
    }, async (request, reply) => {
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
            const results = data.results.map((game) => ({
                title: game.name,
                coverUrl: game.background_image,
                genre: game.genres?.[0]?.name || 'Desconhecido',
                metacritic: game.metacritic || null,
            }));
            reply.send(results);
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao buscar jogos na RAWG.');
            reply.status(500).send({ error: 'Erro interno ao buscar jogos externos.' });
        }
    });
    // Atualizar pelo ID
    app.put('/Games/:id', {
        schema: {
            params: gameSchema_1.idParamSchema,
            body: gameSchema_1.bodySchema,
            response: {
                200: gameSchema_1.gameSchema,
                404: zod_1.z.object({ error: zod_1.z.string() }),
                409: zod_1.z.object({ error: zod_1.z.string() }),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const data = request.body;
            const user = request.user;
            const gameExistente = await prisma_1.prisma.game.findUnique({ where: { id } });
            if (!gameExistente || gameExistente.userId !== user.id) {
                return reply.status(404).send({ error: 'Jogo não encontrado.' });
            }
            if (data.title !== gameExistente.title) {
                const titleConflict = await prisma_1.prisma.game.findFirst({
                    where: { title: data.title, userId: user.id }
                });
                if (titleConflict) {
                    return reply.status(409).send({ error: 'Você já possui um jogo com este título.' });
                }
            }
            const updatedGame = await prisma_1.prisma.game.update({
                where: { id },
                data,
            });
            reply.send(updatedGame);
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao atualizar o jogo.');
            reply.status(500).send({ error: 'Erro ao atualizar o jogo.' });
        }
    });
    // Deletar pelo ID
    app.delete('/Games/:id', {
        schema: {
            params: gameSchema_1.idParamSchema,
            response: {
                200: zod_1.z.object({ message: zod_1.z.string() }),
                404: zod_1.z.object({ error: zod_1.z.string() }),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const user = request.user;
            request.log.info({ id }, 'Tentando deletar jogo');
            const game = await prisma_1.prisma.game.findUnique({ where: { id } });
            if (!game || game.userId !== user.id) {
                request.log.warn({ id }, 'Jogo não encontrado para deleção');
                return reply.status(404).send({ error: 'Jogo não encontrado.' });
            }
            await prisma_1.prisma.game.delete({
                where: { id },
            });
            reply.send({ message: 'Jogo deletado com sucesso.' });
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao deletar jogo');
            reply.status(500).send({ error: 'Erro ao deletar o jogo.' });
        }
    });
};
exports.gamecontroller = gamecontroller;
