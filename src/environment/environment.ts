/**
 * environment.ts
 */

const isProduction = true;
const urlDEV = 'http://localhost:8000';
const urlHML = 'http://localhost:8000';
const urlPRD = 'https://api.condohelpdf.com.br';

const environmentDEV = {
  production: isProduction,
  apiUrl: (isProduction ? `${urlHML}/api` : `${urlDEV}/api`),
  baseUrl: (isProduction ? `${urlHML}` : `${urlDEV}`),
};

const environmentPRD = {
  production: isProduction,
  apiUrl: (isProduction ? `${urlPRD}/api` : `${urlDEV}/api`),
  baseUrl: (isProduction ? `${urlPRD}` : `${urlDEV}`),
};

export const environment = environmentDEV;