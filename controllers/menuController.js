const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
    try {
        const { category, available } = req.query;
        let filter = {};
        
        if (category) filter.category = category;
        if (available !== undefined) filter.available = available === 'true';
        
        const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new menu item
exports.createMenuItem = async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        const savedItem = await menuItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};