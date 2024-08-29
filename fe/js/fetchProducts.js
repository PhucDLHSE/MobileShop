document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token'); // Get token from localStorage or another secure location
    const productTableBody = document.getElementById('productTableBody');

    try {
        const response = await fetch('http://localhost:5000/api/products', {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token // Use the stored token for authentication
            }
        });

        if (response.ok) {
            const products = await response.json();
            products.forEach(product => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${product._id}</td>
                    <td>${product.name}</td>
                    <td>${product.category.name}</td>
                    <td>${product.brand.name}</td>
                    <td>${product.price}</td>
                    <td>${product.status}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;

                productTableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
