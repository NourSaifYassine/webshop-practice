const productElement = document.getElementById("products");
const items = document.getElementById("items");
const cart = document.getElementById("cart");

let initialAmount = 8;
let total = 0;

items.style.display = "none";
function itemClicked() {
    productElement.style.display = 'none';
    items.style.display = "flex";
}

function save(SAVED) {
    localStorage.setItem("T-Shirt", JSON.stringify(SAVED));
}

function saveOrders(SAVED) {
    localStorage.setItem("orders", JSON.stringify(SAVED));
}

async function pull() {
    const pulling = await fetch("data.json");
    const localData = JSON.parse(localStorage.getItem("T-Shirt"));
    return localData || await pulling.json();
}

async function addCard(SRC, TITLE, P, STOCK, AMOUNT) {
    const div = document.createElement("div");
    div.setAttribute("class", "card");

    const img = document.createElement("img");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const amountSpan = document.createElement("span");
    const stockSpan = document.createElement("span");
    const btn = document.createElement("button");

    img.src = SRC;
    img.alt = "T-Shirt";
    title.innerHTML = TITLE;
    price.innerHTML = `$${P}`;
    btn.innerHTML = " + ";
    amountSpan.innerHTML = `Amount: ${AMOUNT}`;
    stockSpan.innerHTML = `Stock: ${STOCK}`;

    btn.addEventListener("click", async () => {
        const data = await pull();

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.title === TITLE) {
                if (item.stock > 0) {
                    item.amount++;
                    item.stock--;

                    console.log(`Updated Amount: ${item.amount}, Updated Stock: ${item.stock}`);

                    amountSpan.innerHTML = `Amount: ${item.amount}`;
                    stockSpan.innerHTML = `Stock: ${item.stock}`;

                    const newPrice = initialAmount * item.amount;
                    price.innerHTML = `Price: $${newPrice}`;
                    console.log(`New Price: $${newPrice}`);

                    updateLi(TITLE, item.amount);
                    updateTotal();

                    cart.style.backgroundColor = "red";
                    save(data);
                }
                break;
            }
        }
    });

    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(price);
    div.appendChild(amountSpan);
    div.appendChild(stockSpan);
    div.appendChild(btn);
    productElement.appendChild(div);
}

async function Li(TITLE, AMOUNT) {
    console.log("Creating LI for:", TITLE, AMOUNT);

    const div = document.createElement('div');
    div.setAttribute('class', 'item');

    const title = document.createElement('h3');
    const price = document.createElement('p');
    const amountSpan = document.createElement('span');
    const initialAmountSpan = document.createElement('pre');

    title.innerHTML = TITLE;
    price.innerHTML = `Price: $${initialAmount * AMOUNT}`;
    amountSpan.innerHTML = `Amount: ${AMOUNT}`;
    initialAmountSpan.innerHTML = `Initial: $${initialAmount}`;

    div.appendChild(title);
    div.appendChild(price);
    div.appendChild(amountSpan);
    div.appendChild(initialAmountSpan);

    console.log("Appending to items:", div);
    items.appendChild(div);
}

function updateLi(TITLE, newAmount) {
    const divs = items.getElementsByClassName('item');
    for (let div of divs) {
        const h3 = div.querySelector('h3');
        if (h3 && h3.innerHTML === TITLE) {
            const amountSpan = div.querySelector('span');
            const price = div.querySelector('p');
            amountSpan.innerHTML = `Amount: ${newAmount}`;

            const newPrice = initialAmount * newAmount;
            price.innerHTML = `Price: $${newPrice}`;

            console.log(`Updated LI Price: $${newPrice}`);
            break;
        }
    }
}

async function updateTotal() {
    const data = await pull();
    total = data.reduce((acc, item) => acc + (item.amount * initialAmount), 0);
    displayTotal();
}

function displayTotal() {
    let totalElement = document.getElementById("total");
    if (!totalElement) {
        totalElement = document.createElement("div");
        totalElement.id = "total";
        totalElement.className = "total-row";
        totalElement.innerHTML = `Total Price: $${total}`;
        items.appendChild(totalElement);
    } else {
        totalElement.innerHTML = `Total Price: $${total}`;
    }

    let button = document.getElementById("checkoutButton");
    if (!button) {
        button = document.createElement("button");
        button.id = "checkoutButton";
        button.className = "total-row";
        button.innerHTML = ` Afrekenen `;
        button.addEventListener('click', handlePayment);
        items.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await pull();
    console.log("Data pulled:", data);

    for (const item of data) {
        console.log("Item:", item);
        if (item.src && item.title) {
            addCard(item.src, item.title, item.price, item.stock, item.amount);
        }
    }

    for (const item of data) {
        if (item.title && item.amount !== undefined) {
            Li(item.title, item.amount);
        }
    }

    updateTotal();
    save(data);
});