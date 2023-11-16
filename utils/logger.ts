import pino from 'pino'
import pretty from 'pino-pretty'

const stream = pretty({
  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss:ms',
  colorize: true,
  ignore: 'hostname,pid',
})

const p = pino({}, stream)

const logger = {
  debug: (message: string, source = 'Unknown Source') => {
    p.debug(`[${source}] ${message}`)
  },

  info: (message: string, source = 'Unknown Source') => {
    p.info(`[${source}] ${message}`)
  },

  warn: (message: string, source = 'Unknown Source') => {
    p.warn(`[${source}] ${message}`)
  },

  error: (message: string, source = 'Unknown Source') => {
    p.error(`[${source}] ${message}`)
  },
}

export default logger
