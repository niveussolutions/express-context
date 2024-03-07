
const cls = require('cls-hooked');

const namespaceId = '018e142b-59d3-7222-a397-638b535086e5';


function expressContext({ nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid) || cls.createNamespace(nsid);

    return (req, res, next) => {
        ns.run(() => next());
    };
}

function set(key, value, { nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid);

    if (ns && ns.active) {
        return ns.set(key, value);
    }

    return undefined;
}

function get(key, { nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid);

    if (ns && ns.active) {
        return ns.get(key);
    }

    return undefined;
}

function setMany(map = {}, { nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid);

    if (ns && ns.active) {
        const _temp = {};
        for (const [key, value] of Object.entries(map)) {
            ns.set(key, value);
            _temp[key] = value;
        }

        return _temp;
    }

    return undefined;
}

function getMany(keys = [], { nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid);

    if (ns && ns.active) {
        const _temp = {};
        for (const key of keys) {
            const value = ns.get(key);
            _temp[key] = value;
        }

        return _temp;
    }

    return undefined;
}

function getNs({ nsid = namespaceId } = {}) {
    const ns = cls.getNamespace(nsid);

    if (ns && ns.active) {
        return ns;
    }

    return undefined;
}

module.exports = {
    expressContext: expressContext,
    set: set,
    get: get,
    setMany: setMany,
    getMany: getMany,
    getNs: getNs,
};
