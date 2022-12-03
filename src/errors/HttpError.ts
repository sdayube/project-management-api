export class HttpError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
