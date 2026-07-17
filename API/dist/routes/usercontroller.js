"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usercontroller = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema_1 = require("../schemas/userSchema");
const usercontroller = async (app) => {
    app.withTypeProvider();
    app.post('/users/register', {
        schema: {
            body: userSchema_1.registerSchema,
            response: {
                201: userSchema_1.userResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }),
                409: zod_1.z.object({ error: zod_1.z.string() }),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { name, email, password } = request.body;
            const userExists = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return reply.status(409).send({ error: 'Este e-mail já está em uso.' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await prisma_1.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            reply.status(201).send(user);
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao registrar usuário');
            reply.status(500).send({ error: 'Erro interno ao criar usuário.' });
        }
    });
    app.post('/users/login', {
        schema: {
            body: userSchema_1.loginSchema,
            response: {
                200: zod_1.z.object({ token: zod_1.z.string(), user: userSchema_1.userResponseSchema }),
                401: zod_1.z.object({ error: zod_1.z.string() }),
                500: zod_1.z.object({ error: zod_1.z.string() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { email, password } = request.body;
            const user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return reply.status(401).send({ error: 'Credenciais inválidas.' });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({ error: 'Credenciais inválidas.' });
            }
            const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '7d' });
            reply.send({
                token,
                user: { id: user.id, name: user.name, email: user.email },
            });
        }
        catch (error) {
            request.log.error({ error }, 'Erro ao realizar login');
            reply.status(500).send({ error: 'Erro interno ao realizar login.' });
        }
    });
};
exports.usercontroller = usercontroller;
