export class ApiError extends Error {
  constructor(message, status, name = null, type = null) {
    super(message);
    this.status = status;
    this.name = name;
  }
}
