export class AppError extends Error {
  constructor (public statusCode: number, public message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor (message = 'bad_request') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor (message = 'unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor (message = 'not_found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor (message = 'conflict') {
    super(409, message);
  }
}
