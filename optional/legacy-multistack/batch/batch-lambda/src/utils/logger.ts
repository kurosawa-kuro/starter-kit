type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context }),
  }
  return JSON.stringify(entry)
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    console.debug(formatLog('debug', message, context))
  },

  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatLog('info', message, context))
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatLog('warn', message, context))
  },

  error: (message: string, context?: Record<string, unknown>) => {
    console.error(formatLog('error', message, context))
  },
}
