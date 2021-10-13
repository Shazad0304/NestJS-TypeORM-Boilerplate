import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    let customResponse : any = {};

    if (
        exception instanceof BadRequestException &&
        exceptionResponse.message &&
        Array.isArray(exceptionResponse.message)
    ){
        customResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: exceptionResponse.message.map((x:any) => Object.values(x.constraints).join(' , ')).join(' , '),
            stack: exceptionResponse
          }
    }
    else{
      customResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exceptionResponse?.message ? exceptionResponse.message : 'SERVER_ERROR',
        stack: exception.stack ? exception.stack : exception,
      };
    }
   
    response
      .status(status)
      .json(customResponse);
  }
}
