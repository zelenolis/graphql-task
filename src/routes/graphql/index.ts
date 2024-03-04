import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {

      const err = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (err) { return { data: err, errors: err } }

      const val = await graphql({
        schema,
        source: req.body.query,
        contextValue: { prisma },
        variableValues: req.body.variables,
      });
      
      return val;

    }
  });
};

export default plugin;
