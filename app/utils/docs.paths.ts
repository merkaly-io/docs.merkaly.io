import type { Domain } from '#shared/utils/docs';

export const getTermPath = (stem: string) => `/glosario/${stem}`;

export const getFlowPath = (stem: string) => `/flujos/${stem}`;

export const getLifecyclePath = (stem: string) => `/ciclos/${stem}`;

export const getDomainPath = (domain: Domain) => `/${domain}`;
