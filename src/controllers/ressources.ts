export const getUnrestrictedContent = async (request, reply) => {
  reply.code(200).send({ content: 'This is an unrestricted content 🎉' });
}

export const getRestrictedContent = async (request, reply) => {
  reply.code(200).send({ content: 'This is a restricted content 🔒' });
}