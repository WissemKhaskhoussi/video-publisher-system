/**
 * Simple logging utility for the video publisher system
 */
export class Logger {
  private productId: string;
  private logFilePath: string;

  /**
   * Creates a new Logger instance
   * @param productId Product identifier
   * @param logFilePath Path to the log file
   */
  constructor(productId: string, logFilePath: string) {
    this.productId = productId;
    this.logFilePath = logFilePath;
  }

  /**
   * Logs an informational message
   * @param message Message to log
   */
  info(message: string): void {
    this.log('INFO', message);
  }

  /**
   * Logs an error message
   * @param message Message to log
   * @param error Optional error object
   */
  error(message: string, error?: any): void {
    let errorMessage = message;
    if (error) {
      errorMessage += `: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
    }
    this.log('ERROR', errorMessage);
  }

  /**
   * Logs a warning message
   * @param message Message to log
   */
  warn(message: string): void {
    this.log('WARN', message);
  }

  /**
   * Logs a debug message
   * @param message Message to log
   */
  debug(message: string): void {
    this.log('DEBUG', message);
  }

  /**
   * Logs a message with the specified level
   * @param level Log level
   * @param message Message to log
   */
  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] [${this.productId}] ${message}\n`;
    
    // Log to console
    console.log(logEntry);
    
    // Log to file (asynchronously)
    const fs = require('fs');
    fs.appendFile(this.logFilePath, logEntry, (err: any) => {
      if (err) {
        console.error(`Failed to write to log file: ${err.message}`);
      }
    });
  }
}
