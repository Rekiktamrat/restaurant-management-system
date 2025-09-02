const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { table, items, customerNotes, orderType } = req.body;
        
        // Calculate total amount and validate items
        let totalAmount = 0;
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem || !menuItem.available) {
                return res.status(400).json({ error: `Item ${item.menuItem} not available` });
            }
            item.price = menuItem.price;
            totalAmount += menuItem.price * item.quantity;
            
            // Update inventory (optional - can be made more sophisticated)
            await updateInventoryForOrder(menuItem, item.quantity);
        }
        
        const order = new Order({
            table,
            items,
            totalAmount,
            customerNotes,
            orderType
        });
        
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Helper function to update inventory
async function updateInventoryForOrder(menuItem, quantity) {
    // This is a simplified version - you'd need to map ingredients to inventory items
    console.log(`Order placed for ${quantity} ${menuItem.name}`);
    // Implement actual inventory deduction logic here
}

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, date } = req.query;
        let filter = {};
        
        if (status) filter.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.createdAt = { $gte: startDate, $lt: endDate };
        }
        
        const orders = await Order.find(filter)
            .populate('table')
            .populate('items.menuItem')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('table').populate('items.menuItem');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stats = {
            totalOrders: await Order.countDocuments(),
            todayOrders: await Order.countDocuments({ createdAt: { $gte: today } }),
            pendingOrders: await Order.countDocuments({ status: 'pending' }),
            revenue: await Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        };
        
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};