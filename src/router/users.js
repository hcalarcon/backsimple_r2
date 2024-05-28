//archivo para manejar las rutas de usuarios

import { Router } from "express";
import { createUsers, logIn } from "../controller/users";

//objeto para manejo de url
const routerUsers = Router();

//Enpoint para loguear usuario
/**
 * @swagger
 * /user/login:
 *  post:
 *      sumary: loguear usuario
 */
routerUsers.post("/user/login", logIn);

/**
 * @swagger
 * /usersp:
 *   post:
 *     summary: Crea usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Usuario creado con éxito
 *       '400':
 *         description: Error al crear el usuario
 */
routerUsers.post("/user/usersp", createUsers);

export default routerUsers;
