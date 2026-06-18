export default class Route {
    constructor() {
        this.root = this.#createNode()
    }

    #createNode() {
        return {
            children: new Map(),
            routes: []
        }
    }

    #normalizeRoutePath(routePath) {
        routePath = routePath.replaceAll('\\', '/')

        if (routePath.endsWith('/?')) {
            routePath = routePath.slice(0, -2)
            if (!routePath) routePath = '/'
        }

        if (routePath.endsWith('/') && routePath.length > 1) {
            routePath = routePath.slice(0, -1)
        }

        return routePath
    }

    #normalizeRequestPath(routePath) {
        if (routePath.endsWith('/') && routePath.length > 1) {
            routePath = routePath.slice(0, -1)
        }

        return routePath
    }

    #splitPath(routePath) {
        if (!routePath || routePath === '/') return []

        let segments = routePath.split('/')

        if (segments.at(0) === '') segments.shift()

        return segments
    }

    register(routePath, invoke, method = '') {
        let normalizedPath = this.#normalizeRoutePath(routePath)
        let action = {
            path: normalizedPath,
            invoke: invoke,
            method: method.toLowerCase()
        }

        let current = this.root

        this.#splitPath(normalizedPath.toLowerCase()).forEach(segment => {
            if (!current.children.has(segment)) {
                current.children.set(segment, this.#createNode())
            }

            current = current.children.get(segment)
        })

        current.routes.push(action)
        return action
    }

    find(routePath) {
        let current = this.root
        let normalizedPath = this.#normalizeRequestPath(routePath.toLowerCase())

        for (let segment of this.#splitPath(normalizedPath)) {
            current = current.children.get(segment)

            if (!current) return undefined
        }

        return current.routes.at(0)
    }

    reset() {
        this.root = this.#createNode()
    }
}
