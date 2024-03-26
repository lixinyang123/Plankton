import { Middleware } from "../../lib/middleware.js"

export class Test extends Middleware {
    constructor() {
        let func = async (req, res, next) => {
            console.log('middleware 3 start')
            await next(req, res)
            console.log('middleware 3 end')
        }

        super(func)
    }
}