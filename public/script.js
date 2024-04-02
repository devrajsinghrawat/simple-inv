// JavaScript code for handling client-side interactions

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');

    // Event listener for search button click
    searchButton.addEventListener('click', () => {
        const searchValue = searchBox.value.trim();
        const categoryFilter = document.getElementById('categoryFilter').value;

        // Call loadItems function with search value and category filter
        loadItems(searchValue, categoryFilter);
    });

    // Function to load items from server
    async function loadItems(searchValue = '', categoryFilter = '') {
        let url = '/api/items';

        // Add query parameters for search and category filter if provided
        if (searchValue !== '') {
            url += `?search=${encodeURIComponent(searchValue)}`;
        }
        if (categoryFilter !== '') {
            url += `${searchValue === '' ? '?' : '&'}category=${encodeURIComponent(categoryFilter)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }

            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to display items in the UI
    function displayItems(items) {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = ''; // Clear previous items
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                <div>
                    <span>${item.id}: ${item.name} - ${item.category}</span>
                    <button onclick="openEditModal(${item.id})">Edit</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </div>`;
            itemsList.appendChild(itemDiv);
        });
    }

    // Function to open edit modal with item data
    window.openEditModal = async function(itemId) {
        // Fetch item details by itemId and populate edit form
        try {
            const response = await fetch(`/api/items/${itemId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch item');
            }

            const item = await response.json();
            // Populate edit form fields with item data
            // Example:
            // document.getElementById('editName').value = item.name;
            // document.getElementById('editCategory').value = item.category;
            // Show the edit modal
            // document.getElementById('editModal').style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to delete item
    window.deleteItem = async function(itemId) {
        // Confirm deletion
        const confirmDelete = confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        // Send delete request to server
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            const data = await response.json();
            console.log(data.message);
            // Reload items list
            loadItems();
        } catch (error) {
            console.error('Error:', error);
        }
    };
});
