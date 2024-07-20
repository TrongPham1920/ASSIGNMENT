const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const verifyUser = require("../utils/verifyUser");
const authToken = require("../utils/authToken");

/**
 * @swagger
 * /product/find:
 *   get:
 *     summary: Filter products by price, category, and date
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         description: Minimum price of the product (must be an even number)
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: maxPrice
 *         description: Maximum price of the product (must be an even number)
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: category
 *         description: ID of the category to filter products
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sortByDate
 *         description: Sort products by date, either "newest" or "oldest"
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of filtered products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được lọc thành công"
 *       400:
 *         description: Error filtering products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 mess:
 *                   type: string
 *                   example: "Giá tối thiểu phải là số chẵn"
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 mess:
 *                   type: string
 *                   example: "Không tìm thấy sản phẩm"
 */
router.get("/find", verifyUser, authToken(1), ProductController.filterProducts);

/**
 * @swagger
 * /product/all:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được lấy thành công"
 *       400:
 *         description: Error retrieving products
 */
router.get("/all", verifyUser, authToken(1), ProductController.getAllProduct);

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve paginated products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *       - name: limit
 *         in: query
 *         description: The number of products per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 total:
 *                   type: integer
 *                   description: Total number of products
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       description: Number of products per page
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                       example: 10
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được lấy thành công"
 *       400:
 *         description: Error retrieving products
 */
router.get("/", verifyUser, authToken(1), ProductController.getProduct);

/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Search products by name or keywords with pagination
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: The search term to find products
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: limit
 *         description: The number of results per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được tìm thấy"
 *       400:
 *         description: Error searching products
 */
router.get(
  "/search",
  verifyUser,
  authToken(1),
  ProductController.searchProducts
);

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               price:
 *                 type: number
 *                 example: 29.99
 *               shortDescription:
 *                 type: string
 *                 example: "This is a short description."
 *               categories:
 *                 type: string
 *                 example: "669b84dc9bbab51c306e128a"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "image1.jpg"
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "sample"
 *               stock:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: "This is a detailed description of the product."
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   width:
 *                     type: number
 *                     example: 10
 *                   height:
 *                     type: number
 *                     example: 20
 *               type:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được tạo thành công"
 *       400:
 *         description: Invalid input
 */
router.post(
  "/create",
  verifyUser,
  authToken(0),
  ProductController.createProduct
);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product"
 *               price:
 *                 type: number
 *                 example: 39.99
 *               shortDescription:
 *                 type: string
 *                 example: "Updated short description."
 *               categories:
 *                 type: string
 *                 example: "60d4b5f67a4b2c001f9d6a5d"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "updatedImage.jpg"
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "updated"
 *               stock:
 *                 type: number
 *                 example: 150
 *               description:
 *                 type: string
 *                 example: "Updated detailed description of the product."
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   width:
 *                     type: number
 *                     example: 15
 *                   height:
 *                     type: number
 *                     example: 25
 *               type:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được cập nhật thành công"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put("/:id", verifyUser, authToken(0), ProductController.updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Sản phẩm đã được tìm thấy"
 *       400:
 *         description: Error retrieving product
 *       404:
 *         description: Product not found
 */
router.get("/:id", verifyUser, authToken(1), ProductController.getProductById);

/**
 * @swagger
 * /product/status/{id}:
 *   patch:
 *     summary: Change the status of a product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Trạng thái sản phẩm đã được cập nhật thành công"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.patch(
  "/status/:id",
  verifyUser,
  authToken(0),
  ProductController.changeStatus
);

module.exports = router;
