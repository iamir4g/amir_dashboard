// import { Problem } from "../types/http-errors.interface";

import { Problem } from '@/types/global/http-errors.interface';

export class ApiError extends Error {
  problem: Problem;

  constructor(problem: Problem) {
    super(problem.detail || 'An error occurred');
    this.problem = problem;
    Object.setPrototypeOf(this, ApiError.prototype); // Ensure correct prototype chain
  }
}

// export class ApiError extends Error implements Problem {
//   title: string;
//   statusCode: number;
//   detail?: string;
//   errors?: { title: string; description: string }[];
//   success?: boolean;
//   errorType: string;

//   constructor(problem: Problem & { errorType: string }) {
//     super(problem.title);
//     this.title = problem.title;
//     this.statusCode = problem.statusCode;
//     this.detail = problem.detail;
//     this.errors = problem.errors;
//     this.success = problem.success;
//     this.errorType = problem.errorType;
//   }
// }
