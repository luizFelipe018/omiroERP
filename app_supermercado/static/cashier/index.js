import {assert} from "../toolbox.js";
import {executorUse, execute} from "./executor.js";
import ProductList, {Product} from "./productList.js";

(function() {
    const form = document.getElementById("form");
    const input = document.getElementById("input");

    const codeInput = document.getElementById("code-input");
    const nameInput = document.getElementById("name-input");

    const priceInput = document.getElementById("price-input");
    const totalInput = document.getElementById("total-input");

    const productList = new ProductList();
    const productTableBody = document.getElementById("product-table-body");

    function createProductTableRow(id, product) {
        const tr = document.createElement("tr");

        const tdCount = document.createElement("td");
        const tdName = document.createElement("td");
        const tdCode = document.createElement("td");
        const tdPrice = document.createElement("td");

        tdCount.innerHTML = "#" + id;

        tdName.innerHTML = product.name;
        tdCode.innerHTML = product.code;
        tdPrice.innerHTML = product.price;

        tr.appendChild(tdCount);
        tr.appendChild(tdName);
        tr.appendChild(tdCode);
        tr.appendChild(tdPrice);

        return tr;
    }

    function updateProductTable() {
        const table = productTableBody;
        table.innerHTML = '';
        for (const [id, product] of productList.values()) {
            const row = createProductTableRow(id, product);
            table.appendChild(row);
        }
        totalInput.value = productList.price();
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
            const product = new Product(await getProduct(code));

            productList.add(product);

            codeInput.value = product.code;
            nameInput.value = product.name;
            priceInput.value = product.price;

            updateProductTable()
            return true;
        } catch (e) {
            alert(e);
            return false;
        }
    }

    function remProduct(expectedId) {
        const removed = productList.remove(expectedId);
        updateProductTable();
        return removed;
    }

    executorUse.addProduct = addProduct;
    executorUse.remProduct = remProduct;

    document.addEventListener('keydown', async (e) => {
        switch (e.key) {
            case 'Enter': {
                execute(input.value);
                input.value = "";
            } break;
            case 'Backspace': {
                input.value = input.value.slice(0, -1);
            } break;
            case 'Escape': {
                input.value = "";
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
    totalInput.value = '';
})();
