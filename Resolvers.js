const Order = require("./src/models/orderModel");
const User = require("./src/models/userModel");
const Product = require("./src/models/productModel");

const resolvers = {
  Query: {
    orders: async () => await Order.find(),
    order: async (parent, args) => await Order.findById(args.id),
  },
  Mutation: {
    addOrder: async (parent, args) => {
      const { userId, products, shippingAddress } = args;

      let totalAmount = 0;
      const productIds = products.map((product) => product.product);

      const existingProducts = await Product.find({ _id: { $in: productIds } });
      const existingProductIds = existingProducts.map((product) =>
        product._id.toString()
      );
      const allProductsExist = productIds.every((productId) =>
        existingProductIds.includes(productId)
      );

      if (!allProductsExist) {
        throw new Error("One or more products do not exist");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const order = new Order({
        user: user,
        products: products,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
      });

      return await order.save();
    },

    updateOrder: async (parent, args) => {
      const { id, userId, products, shippingAddress } = args;

      const order = await Order.findById(id);
      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      let updatedUser;
      if (userId) {
        updatedUser = await User.findById(userId);
        if (!updatedUser) {
          throw new Error(`User with ID ${userId} not found`);
        }
      }

      if (products) {
        const productIds = products.map((product) => product.product);
        const existingProducts = await Product.find({
          _id: { $in: productIds },
        });
        const existingProductIds = existingProducts.map((product) =>
          product._id.toString()
        );
        const allProductsExist = productIds.every((productId) =>
          existingProductIds.includes(productId)
        );

        if (!allProductsExist) {
          throw new Error("One or more products do not exist");
        }
      }

      let totalAmount = 0;
      if (products) {
        products.forEach((product) => {
          totalAmount += product.price * product.quantity;
        });
      }

      return await Order.findByIdAndUpdate(
        id,
        {
          user: updatedUser ? updatedUser._id : order.user,
          products: products,
          totalAmount: totalAmount,
          shippingAddress: shippingAddress,
        },
        { new: true }
      ).populate("user");
    },

    deleteOrder: async (parent, args) => {
      const { id } = args;

      const order = await Order.findById(id);
      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      await Order.findByIdAndDelete(id);
      return { id };
    },

    changeOrderStatus: async (parent, args) => {
      const { id, status } = args;

      const order = await Order.findById(id);
      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      return await Order.findByIdAndUpdate(id, { status }, { new: true });
    },
  },
};

module.exports = resolvers;
