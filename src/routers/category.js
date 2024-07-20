const express = require("express");
const router = express.Router();
const CategoryModel = require("../controllers/CategoryModel");
const verifyUser = require("../utils/verifyUser");
const authToken = require("../utils/authToken");

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       400:
 *         description: Error retrieving categories
 */
router.get("/", verifyUser, authToken(1), CategoryModel.getCategory);

/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *                 example: "Category for electronic devices"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 mess:
 *                   type: string
 *                   example: "Danh mục đã được tạo thành công"
 *       400:
 *         description: Invalid input
 */
router.post("/create", verifyUser, authToken(0), CategoryModel.createCategory);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Home Appliances"
 *               description:
 *                 type: string
 *                 example: "Category for home appliances"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 mess:
 *                   type: string
 *                   example: "Danh mục đã được cập nhật thành công"
 *       400:
 *         description: Invalid input or category not found
 *       404:
 *         description: Category not found
 */
router.put(
  "/update/:id",
  verifyUser,
  authToken(0),
  CategoryModel.updateCategory
);

/**
 * @swagger
 * /category/changeStatus/{id}:
 *   patch:
 *     summary: Toggle the status of a category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to change status
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 mess:
 *                   type: string
 *                   example: "Trạng thái danh mục đã được cập nhật thành công"
 *       404:
 *         description: Category not found
 */
router.patch(
  "/changeStatus/:id",
  verifyUser,
  authToken(0),
  CategoryModel.changeStatus
);

module.exports = router;
