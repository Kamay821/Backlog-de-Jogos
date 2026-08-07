import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

const gameSchema = z.object({
  id: z.string(),
  rating: z.number()
})

app.get('/Games', {
  schema: {
    response: {
      200: z.array(gameSchema)
    }
  }
}, async (request, reply) => {
  // Return something that violates the schema (rating is a string)
  return [{ id: '1', rating: '10' }] as any
})

async function run() {
  await app.listen({ port: 3001 })
  try {
    const res = await fetch('http://localhost:3001/Games')
    console.log('Status:', res.status)
    const data = await res.json()
    console.log('Data:', data)
  } catch (err: any) {
    console.log('Fetch Error:', err)
  }
  await app.close()
}

run()
