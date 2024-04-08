export class Logger {
    constructor(callback = undefined) {
        this.callback = callback
    }

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