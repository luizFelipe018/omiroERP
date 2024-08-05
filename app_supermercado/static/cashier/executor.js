import {assert} from "../toolbox.js";

export const executorUse = {
    addProduct: undefined,
};

function num(value) {
    return {
        type: "number",
        value,
    };
}

function mul(value) {
    return {
        type: "multiply",
        value,
        async callback(arg) {
            assert(arg?.type === 'number', 'mul: unexpected type: ' + arg?.type);
            for (let i = 0; i < value; i++) {
                assert(executorUse.addProduct, "missing use.addProduct callback");
                let result = executorUse.addProduct(arg.value);
                if (result instanceof Promise) {
                    result = await result;
                }
                if (!result) break;
            }
        },
    };
}

function parse(stack, string) {
    const c = string[0];
    if (c === undefined) return true;
    switch (c) {
        case '1': case '2': case '3':
        case '4': case '5': case '6':
        case '7': case '8': case '9':
        case '0': {
            const n = Number(c);
            const pop = stack.pop();
            if (pop?.type === 'number') {
                stack.push(num(pop.value * 10 + n));
                break;
            } else if (pop) {
                stack.push(pop);
            }
            stack.push(num(n));
        } break;
        case 'x': {
            const pop = stack.pop();
            if (pop?.type !== 'number') {
                console.error('(x) operator got unexpected type: ' + pop?.type);
                return false;
            }
            stack.push(mul(pop.value));
        } break;
        default: {
            console.error("unknown operator (" + c + ")");
            return false;
        } break;
    }
    return parse(stack, string.slice(1));
}

function execute_(stack) {
    const op = stack.pop();
    if (op === undefined) return true;
    assert(op?.type, 'execute_: got unknown operator type: ' + op?.type);
    switch (op.type) {
        case 'number': {
            const modifier = stack.pop();
            if (modifier?.callback) {
                modifier.callback(op);
            } else {
                assert(executorUse.addProduct, "missing use.addProduct callback");
                const _ = executorUse.addProduct(op.value);
            }
        } break;
        default: {
            console.error('evaluating unexpected operator type: ' + op?.type)
            return false;
        } break;
    }
    return execute_(stack);
}

export function execute(cmd) {
    let ok;
    const stack = [];
    ok = parse(stack, cmd);
    if (!ok) return false;
    ok = execute_(stack);
    return ok;
}

export default undefined;
