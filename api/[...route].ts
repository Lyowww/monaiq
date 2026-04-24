import 'reflect-metadata';
import type { Request, Response } from 'express';
import express, { type Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../backend/src/app.module';
import { configureApp } from '../backend/src/bootstrap/configure-app';

let cachedServer: Express | null = null;

async function createServer(): Promise<Express> {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      bufferLogs: true
    }
  );

  await configureApp(app, { useGlobalPrefix: true });
  await app.init();

  cachedServer = expressApp;
  return expressApp;
}

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const server = await createServer();
  server(request, response);
}
