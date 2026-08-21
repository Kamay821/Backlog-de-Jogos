import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema, userResponseSchema } from '../schemas/userSchema';

export const usercontroller: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>();

  app.post('/users/register', {
    schema: {
      body: registerSchema,
      response: {
        201: userResponseSchema,
        400: z.object({ error: z.string() }),
        409: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>,
    reply
  ) => {
    try {
      const { name, email, password } = request.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return reply.status(409).send({ error: 'Este e-mail já está em uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      reply.status(201).send(user);
    } catch (error) {
      request.log.error({ error }, 'Erro ao registrar usuário');
      reply.status(500).send({ error: 'Erro interno ao criar usuário.', details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post('/users/login', {
    schema: {
      body: loginSchema,
      response: {
        200: z.object({ token: z.string(), user: userResponseSchema }),
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }, async (
    request: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>,
    reply
  ) => {
    try {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Credenciais inválidas.' });
      }

      const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '7d' });

      reply.send({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      request.log.error({ error }, 'Erro ao realizar login');
      reply.status(500).send({ error: 'Erro interno ao realizar login.', details: error instanceof Error ? error.message : String(error) });
    }
  });
};
