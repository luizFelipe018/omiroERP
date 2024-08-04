(function() {
    const form = document.getElementById("form");
    const codeInput = document.getElementById("code-input");
    const nameInput = document.getElementById("name-input");
    const priceInput = document.getElementById("price-input");
    const productTableBody = document.getElementById("product-table-body");

    codeInput.value = "";
    nameInput.value = "";
    priceInput.value = "";

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

    async function getProduct() {
        const data = new FormData(form);
        const code = data.get('code');

        const origin = window.location.origin;
        const path = origin + '/api/get-product/' + code;

        const response = await fetch(path);
        const jsonData = await response.json();

        if (jsonData.error) {
            window.alert(jsonData.error);
            return;
        }

        const product = jsonData.value;

        nameInput.value = product.name;
        priceInput.value = product.price;

        addProductIntoList(product, productTableBody);
    }

    codeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            getProduct();
        }
    });
})();
