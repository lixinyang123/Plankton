import { Plankton } from './lib/plankton.js'
import { Middleware } from './lib/middleware.js'
import { Logger } from './lib/logger.js'

export {
    Plankton,
    Middleware,
    Logger
}

export default function() {
    return new Plankton()
}
