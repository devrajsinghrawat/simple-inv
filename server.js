const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./inventory.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the inventory database.');
        // Create items table if not exists
        db.run(`CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT,
                name TEXT,
                image TEXT,
                location TEXT,
                price REAL,
                price_range_min REAL,
                price_range_max REAL,
                discount REAL,
                count INTEGER,
                last_update TEXT,
                supplier1_name TEXT,
                supplier1_phone TEXT,
                supplier2_name TEXT,
                supplier2_phone TEXT
            )`);
    }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// API to add an item
app.post('/api/items', (req, res) => {
    const { category, name, image, location, price, price_range_min, price_range_max, discount, count, last_update, supplier1_name, supplier1_phone, supplier2_name, supplier2_phone } = req.body;
    db.run(`INSERT INTO items (category, name, image, location, price, price_range_min, price_range_max, discount, count, last_update, supplier1_name, supplier1_phone, supplier2_name, supplier2_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [category, name, image, location, price, price_range_min, price_range_max, discount, count, last_update, supplier1_name, supplier1_phone, supplier2_name, supplier2_phone],
            function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log(`A new item has been added with ID ${this.lastID}`);
                    res.status(201).json({ message: 'Item added successfully', itemId: this.lastID });
                }
            });
});

// API to get all items
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// API to update an item
app.put('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const { category, name, image, location, price, price_range_min, price_range_max, discount, count, last_update, supplier1_name, supplier1_phone, supplier2_name, supplier2_phone } = req.body;
    db.run(`UPDATE items
            SET category = ?, name = ?, image = ?, location = ?, price = ?, price_range_min = ?, price_range_max = ?, discount = ?, count = ?, last_update = ?, supplier1_name = ?, supplier1_phone = ?, supplier2_name = ?, supplier2_phone = ?
            WHERE id = ?`,
            [category, name, image, location, price, price_range_min, price_range_max, discount, count, last_update, supplier1_name, supplier1_phone, supplier2_name, supplier2_phone, itemId],
            function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log(`Item with ID ${itemId} has been updated`);
                    res.json({ message: 'Item updated successfully' });
                }
            });
});

// API to delete an item
app.delete('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    db.run(`DELETE FROM items WHERE id = ?`, [itemId], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log(`Item with ID ${itemId} has been deleted`);
            res.json({ message: 'Item deleted successfully' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
