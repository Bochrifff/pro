document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCart() {
        cartItemsContainer.innerHTML = ''; // Clear the container
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
            return;
        }

        cart.forEach((product, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>${product.price}</p>
                </div>
                <button class="delete-icon" data-index="${index}">Supprimer</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        addDeleteEventListeners();
    }

    function addDeleteEventListeners() {
        const deleteIcons = document.querySelectorAll('.delete-icon');
        deleteIcons.forEach(icon => {
            icon.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1); // Remove the item from the array
                localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
                displayCart(); // Re-display the cart
            });
        });
    }

    displayCart();

    const modal = document.getElementById('order-form-modal');
    const checkoutButton = document.getElementById('checkout-button');
    const closeButton = document.querySelector('.close-button');
    const orderForm = document.getElementById('order-form');

    checkoutButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(orderForm);
        const name = formData.get('nom');
        const prenom = formData.get('prenom');
        const email = formData.get('email');
        const address = formData.get('adresse');
        const phone = formData.get('tel');

        let emailBody = `Bonjour,\n\nVoici les détails de la réservation de ${prenom} ${name}:\n\n`;
        emailBody += `Email: ${email}\n`;
        emailBody += `Adresse: ${address}\n`;
        emailBody += `Téléphone: ${phone}\n\n`;
        emailBody += `Produits commandés :\n`;

        cart.forEach(product => {
            emailBody += `- ${product.name} (${product.price})\n`;
        });

        const mailtoLink = `mailto:bochriff.21@gmail.com?subject=Nouvelle réservation de ${prenom} ${name}&body=${encodeURIComponent(emailBody)}`;

        window.location.href = mailtoLink;

        alert('Votre réservation a été confirmée !');
        modal.style.display = 'none';
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    });
});