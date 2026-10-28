export const paginadoActivo = (): boolean =>
  process.env.ACEPTA_PAGINADO !== 'false'
