import type { FastifyReply } from "fastify";
import type { CustomError } from "./core/types";

export const error = (reply: FastifyReply, e: CustomError): FastifyReply =>
  reply.code(e.code || 500).send({ error: e.message || e });

export const check = (elmt: any, message: string, code: number): void => {
  if (!elmt) {
    throw { code: code || 400, message };
  }
};
