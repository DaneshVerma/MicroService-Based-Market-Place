const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(async ({ query, token }) => {
    const response = await axios.get(`http://localhost:3001/api/products/search?q=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return JSON.stringify(response.data);


}, {
    name: "searchProduct",
    description: "Search for products based on a query .",
    schema: z.object({
        query: z.string().describe("The search query for the product."),
        token: z.string().optional().describe("Auth token"),
    }),

})

const addProductToCart = tool(async ({ productId, quantity, token }) => {
    const response = await axios.post(`http://localhost:3002/api/cart/items`, {
        productId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return `Added product with id ${productId} and quantity ${quantity} to the cart.`;

}, {
    name: "addProductToCart",

    description: "Add a product to the shopping cart.",
    schema: z.object({
        productId: z.string().describe("The ID of the product to add to the cart."),
        quantity: z.number().describe("The quantity of the product to add.").default(1),
        token: z.string().optional().describe("Auth token"),
    }),
})
module.exports = {
    searchProduct,
    addProductToCart
}
