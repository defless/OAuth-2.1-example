import type { FastifyReply } from 'fastify';

/**
 * Returns public content.
 */
export const getUnrestrictedResources = async (reply: FastifyReply) =>
  reply.code(200).send({
    content: 'This is an unrestricted content 🎉',
  });

/**
 * Returns restricted content.
 */
export const getRestrictedResources = async (reply: FastifyReply) =>
  reply.code(200).send({
    content: 'This is a restricted content 🔒',
  });
