export class AppError {
  public readonly message?: string;
  public readonly statusCode?: number;
  public readonly obj?: object;

  constructor(message: string, statusCode?: number, obj?: object) {
    this.message = message;
    this.statusCode = statusCode ?? 400;
    this.obj = obj;
  }
}
