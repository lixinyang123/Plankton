import 'zx/globals'

let passed = []
let failed = []

async function invoke(callback) {
    switch (Object.prototype.toString.call(callback)) {
        case '[object AsyncFunction]':
            await callback()
            break

        case '[object Function]':
            await new Promise((resolve, reject) => {
                try {
                    callback()
                    resolve()
                } 
                catch (error) {
                    reject(error)
                }
            })
            break
    }
}

export default {
    async test(name, callback) {
        console.log(`\n========== Test <${name}> ==========`)
        try {
            await invoke(callback)
            passed.push(name)
        } 
        catch (err) {
            console.error(err)
            failed.push(name)
        }
    },

    async testExample(path, callback) {
        let cwd = process.cwd()

        await this.test(path, async () => {
            cd(path)
            $`node src/main.js & echo $! > .pid`
            await sleep(1000)
            await callback()
        }).catch(err => {
            throw err
        }).finally(async () => {
            await $`kill $(cat .pid) && rm .pid`
            cd(cwd)
        })
    },

    report() {
        console.log('\n========== Report ==========')
        console.log(`Passed: ${passed.length}`)
        console.log(`Failed: ${failed.length}`)

        if (failed.length > 0) {
            console.table(failed)
            process.exit(1)
        }

        process.exit(0)
    },

    sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time)
        })
    }
}