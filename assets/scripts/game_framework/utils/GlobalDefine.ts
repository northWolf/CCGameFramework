export function isNull(obj: any) {
    return obj == undefined || obj == null;
}

/**
 * Mixin，组合可重用组件来创建类
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}