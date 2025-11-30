export class ValidationError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message); // Call the parent Error constructor
    this.name = this.constructor.name; // Set the name to the class name
    this.statusCode = statusCode || 500; // Add a custom status code
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}
