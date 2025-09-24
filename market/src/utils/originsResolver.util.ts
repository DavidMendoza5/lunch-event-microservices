export const getAllowedOrigins = (origins: string = 'localhost'): string[] => {
  return origins.replace(/[\n\r\s]/g, '').split(',');
};
