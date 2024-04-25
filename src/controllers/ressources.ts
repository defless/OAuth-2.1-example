import type { FastifyReply } from 'fastify';

export const getUnrestrictedContent = async (reply: FastifyReply) => {
  reply.code(200).send({ content: 'This is an unrestricted content 🎉' });
}

export const getRestrictedContent = async (reply: FastifyReply) => {
  reply.code(200).send({ content: 'This is a restricted content 🔒' });
}