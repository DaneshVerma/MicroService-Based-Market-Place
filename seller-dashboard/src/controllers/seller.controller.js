const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');



async function getMetrics(req, res) {
    try {

        const seller = req.user

        //Get all products of the seller
        const products = await productModel.find({ sellerId: seller.id });
        const productIds = products.map(p => p._id);

        //Get all orders for the seller's products
        const orders = await orderModel.find({ productId: { $in: productIds }, status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } });

        // Sales: Total number of item s    old
        let sales = 0;
        let revenue = 0;
        const productSales = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (productIds.includes(item.product)) {
                    sales += item.quantity;
                    revenue += item.totalPrice;
                    productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
                }
            });
        });

        // Top Selling Products
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => p._id.toString() === productId);
                return {
                    productId,
                    name: product ? product.name : 'Unknown',
                    quantity
                };
            }).filter(Boolean);

        res.json({
            sales,
            revenue,
            topProducts
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

async function getOrders(req, res) {

    try {
        const seller = req.user;

        //Get all products of the seller
        const products = await productModel.find({ sellerId: seller.id });
        const productIds = products.map(p => p._id);

        //Get all orders for the seller's products
        const orders = await orderModel.find({
            "items.product": { $in: productIds }
        }).populate("userId", "name email").sort({ createdAt: -1 });

        // Filter order items to include only those related to the seller's products

        const filteredOrders = orders.map(order => {
            const filteredItems = order.items.filter(item => productIds.includes(item.product));
            return {
                ...order.toObject(),
                items: filteredItems
            };
        }).filter(order => order.items.length > 0);

        res.json({ orders: filteredOrders });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }

}

async function getProducts(req, res) {
    try {
        const seller = req.user;
        const products = await productModel.find({ sellerId: seller.id });
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports = {
    getMetrics,
    getOrders,
    getProducts
};