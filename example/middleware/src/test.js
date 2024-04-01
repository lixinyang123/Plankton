import { Middleware } from '@lixinyang123/plankton'

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