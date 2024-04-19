import { Middleware } from '@lixinyang123/plankton'

export class Test extends Middleware {
    constructor() {
        let func = async (req, res, next) => {
            res.write('<p>middleware 3 start</p>')
            await next(req, res)
            res.write('<p>middleware 3 end</p>')
        }

        super(func)
    }
}