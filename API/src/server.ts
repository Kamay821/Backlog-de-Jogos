import fastify from 'fastify'
import {serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import { gamecontroller } from './routes/gamecontroller'
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { usercontroller } from './routes/usercontroller';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

const app = fastify({
  logger: process.env.VERCEL ? true : {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  }
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)

app.setValidatorCompiler(validatorCompiler)

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret_key_change_in_production'
});

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Não autorizado. Token inválido.' });
  }
});

app.get('/', async (request, reply) => {
  return { status: 'ok', message: 'Backlog de Jogos API is running' };
});

app.get('/favicon.ico', async (request, reply) => {
  reply.code(204).send();
});

app.register(usercontroller);
app.register(gamecontroller);

if (!process.env.VERCEL) {
  app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Servidor rodando em ${address}`);
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}