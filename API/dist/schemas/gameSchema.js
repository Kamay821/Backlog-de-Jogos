"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawgSearchQuerySchema = exports.searchQuerySchema = exports.idParamSchema = exports.gameSchema = exports.bodySchema = exports.gameStatus = void 0;
const zod_1 = require("zod");
exports.gameStatus = zod_1.z.enum(['Jogando', 'Zerado', 'Dropado', 'Planejado']);
exports.bodySchema = zod_1.z.object({
    title: zod_1.z.string(),
    genre: zod_1.z.string(),
    status: exports.gameStatus,
    rating: zod_1.z.number().min(0).max(10),
    coverUrl: zod_1.z.string().optional(),
    metacritic: zod_1.z.number().optional(),
    platform: zod_1.z.string().optional(),
    timePlayed: zod_1.z.number().optional(),
});
exports.gameSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    genre: zod_1.z.string(),
    status: exports.gameStatus,
    rating: zod_1.z.number(),
    coverUrl: zod_1.z.string().nullable().optional(),
    metacritic: zod_1.z.number().nullable().optional(),
    platform: zod_1.z.string().nullable().optional(),
    timePlayed: zod_1.z.number().nullable().optional(),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.searchQuerySchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    status: exports.gameStatus.optional(),
    genre: zod_1.z.string().optional(),
});
exports.rawgSearchQuerySchema = zod_1.z.object({
    q: zod_1.z.string().min(1),
});
