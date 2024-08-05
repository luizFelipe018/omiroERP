export function assert(condition, ...args) {
    if (!condition) {
        for (const i in args) {
            console.error("[" + i + "]", args[i]);
        }
        throw 'assertion failed';
    }
}

export default undefined;
