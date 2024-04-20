export class Logger {
    /**
     * Create a new Logger
     * @param {Function} callback (msg, level) => { }
     * 
     * @example
     * export class FileLogger extends Logger {
     *     constructor() {
     *         super((msg, level) => {
     *             // handler...
     *         })
     *     }
     * }
     */
    constructor(callback = undefined) {
        this.callback = callback
    }

    /**
     * Log info
     * @param {string} msg log info
     * @param {string} level log level
     */
    log(msg, level = 'info') {
        msg += '\n'

        if (this.callback) {
            this.callback(msg, level)
            return
        }

        switch (level) {
            case 'error':
                console.error(`${level}: ${msg}`)
                break

            case 'warn':
                console.warn(`${level}: ${msg}`)
                break

            case 'debug':
                console.debug(`${level}: ${msg}`)
                break

            case 'info':
                console.info(`${level}: ${msg}`)
                break

            default:
                console.log(`${level}: ${msg}`)
                break
        }
    }
}