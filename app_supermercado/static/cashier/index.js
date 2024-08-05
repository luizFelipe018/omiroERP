import {assert} from "../toolbox.js";
import {executorUse, execute} from "./executor.js";

(function() {
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const codeInput = document.getElementById("code-input");
    const nameInput = document.getElementById("name-input");
    const priceInput = document.getElementById("price-input");
    const productTableBody = document.getElementById("product-table-body");

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

    executorUse.addProduct = addProduct;

    document.addEventListener('keydown', async (e) => {
        switch (e.key) {
            case 'Enter': {
                execute(input.value);
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
