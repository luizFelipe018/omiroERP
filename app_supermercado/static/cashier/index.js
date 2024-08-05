(function() {
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const codeInput = document.getElementById("code-input");
    const nameInput = document.getElementById("name-input");
    const priceInput = document.getElementById("price-input");
    const productTableBody = document.getElementById("product-table-body");

    function OpNumber(value) {
        return {
            type: "number",
            value,
        };
    }

    function OpMultiply(value) {
        return {
            type: "multiply",
            value,
        };
    }

    async function computeCommand(cmd) {
        const stack = [];
        /** parse the command */
        for (const ch of cmd) {
            const number = Number(ch);
            if (!isNaN(number)) {
                const op = stack.pop();
                switch (op?.type) {
                    case undefined: {
                        stack.push(OpNumber(number));
                    } break;
                    case 'number': {
                        stack.push(OpNumber(op.value * 10 + number));
                    } break;
                    case 'multiply': {
                        stack.push(op);
                        stack.push(OpNumber(number));
                    } break;
                    default: {
                        return console.error(`computeCommand: unhandled type: ${op?.type}`);
                    } break;
                }
            } else {
                switch (ch) {
                    case 'x': {
                        const op = stack.pop();
                        switch (op?.type) {
                            case undefined: {
                                return console.error(`computeCommand: x (multiply) expected number but got an empty stack`);
                            } break;
                            case 'number': {
                                stack.push(OpMultiply(op.value));
                            } break;
                            default: {
                                return console.error(`computeCommand: x (multiply) expected number but got operator: ${op?.type}`);
                            } break;
                        }
                    } break;
                    default: {
                        return console.error(`computeCommand: unexpected symbol: '${ch}'`)
                    } break;
                }
            }
        }
        /** compute parsed operations */
        while (stack.length > 0) {
            const op = stack.pop();
            switch (op?.type) {
                case undefined: {
                    return console.error(`computeCommand: got undefined operator`);
                } break;
                case 'number': {
                    const modifier = stack.pop();
                    switch (modifier?.type) {
                        case undefined: {
                            addProduct(op.value);
                        } break;
                        case 'number': {
                            return console.error(`computeCommand: got consectives number`);
                        } break;
                        case 'multiply': {
                            for (let i = 0; i < modifier.value; i++) {
                                const found = await addProduct(op.value);
                                if (!found) break;
                            }
                        } break;
                        default: {
                            return console.error(`computeCommand: unhandled operator type: ${op?.type}`);
                        } break;
                    }
                } break;
                case 'multiply': {
                    return console.error(`computeCommand: unexpected operator type: ${op?.type}`);
                } break;
            }
        }
    }

    function createProductTableRow(product) {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        const tdCode = document.createElement("td");
        const tdPrice = document.createElement("td");

        tdName.innerHTML = product.name;
        tdCode.innerHTML = product.code;
        tdPrice.innerHTML = product.price;

        tr.appendChild(tdName);
        tr.appendChild(tdCode);
        tr.appendChild(tdPrice);

        return tr;
    }

    function addProductIntoList(product, table) {
        const tableRow = createProductTableRow(product);
        table.appendChild(tableRow);
    }

    async function getProduct(code) {
        const origin = window.location.origin;
        const path = origin + '/api/get-product/' + code;
        const response = await fetch(path);
        const data = await response.json();
        if (data.error !== '') {
            throw data.error;
        }
        return data.value;
    }

    async function addProduct(code) {
        try {
            const product = await getProduct(code);
            codeInput.value = product.code;
            nameInput.value = product.name;
            priceInput.value = product.price;
            addProductIntoList(product, productTableBody);
            return true;
        } catch (e) {
            alert(e);
            return false;
        }
    }

    document.addEventListener('keydown', async (e) => {
        switch (e.key) {
            case 'Enter': {
                computeCommand(input.value);
                input.value = "";
            } break;
            case 'Backspace': {
                input.value = input.value.slice(0, -1);
            } break;
            default: {
                input.value += e.key;
            } break;
        }
    });

    input.value = '';
    codeInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
})();
