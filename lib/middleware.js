export class Middleware {
    /**
     * Create a new Middleware
     * @param {Function} callback (req, res, next) => { }
     * 
     * @example
     * export class TestMiddleware extends Middleware {
     *     constructor() {
     *         super(async (req, res, next) => {
     *             await next(req, res)
     *         })
     *     }
     * }
     */
    constructor(callback) {
        this.handler = callback
        this.next = undefined
    }

    async invoke(req, res, middleware) {
        await middleware.handler(req, res, async (req, res) =>
            await this.invoke(req, res, middleware.next)
        )
    }
}