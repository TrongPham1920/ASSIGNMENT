const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyUser = require("../utils/verifyUser");
const authToken = require("../utils/authToken");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 *         avatar:
 *           type: string
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *       required:
 *         - userName
 *         - email
 *         - password
 */
router.put("/update-user", verifyUser, authToken(1), UserController.updateUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.get("/", verifyUser, authToken(1), UserController.getAllUsers);

/**
 * @swagger
 * /user/find-user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.get("/find-user/:id", verifyUser, authToken(1), UserController.readUser);

/**
 * @swagger
 * /user/update-user:
 *   post:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               avatar:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input or user not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */

/**
 * @swagger
 * /user/delete-user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.delete(
  "/delete-user/:id",
  verifyUser,
  authToken(1),
  UserController.deleteUser
);

/**
 * @swagger
 * /users/status:
 *   patch:
 *     summary: "Thay đổi trạng thái của người dùng"
 *     description: "Cập nhật trạng thái của người dùng theo ID."
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "60d5f7b3f1b2c0a1b4d2e3f4"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: "Cập nhật trạng thái người dùng thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f7b3f1b2c0a1b4d2e3f4"
 *                     email:
 *                       type: string
 *                       example: "example@example.com"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     # Thêm các thuộc tính khác nếu cần
 *                 mess:
 *                   type: string
 *                   example: "Cập nhật trạng thái người dùng thành công"
 *       400:
 *         description: "Yêu cầu không hợp lệ"
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
 *                   example: "Thiếu thông tin id người dùng"
 *       404:
 *         description: "Không tìm thấy người dùng"
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
 *                   example: "Không tìm thấy UserID 60d5f7b3f1b2c0a1b4d2e3f4"
 */
router.patch("/status", verifyUser, authToken(1), UserController.changeStatus);

module.exports = router;
