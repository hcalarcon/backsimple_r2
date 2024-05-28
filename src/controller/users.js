import { connect } from "../databases";
import jwt from "jsonwebtoken";
const secreto = process.env.SECRET_KEY;

export const logIn = async (req, res) => {
  try {
    const { dni, password } = req.body; //petición
    //cadena de conexión
    const cnn = await connect();

    const q = "SELECT pass FROM alumno WHERE dni=?";
    const parametros = [dni];

    const [row] = await cnn.query(q, parametros);
    console.log("resultado de la consulta login", row);

    //si no existe el dni, el arreglo viene vacio, por lo cual su longitud sera 0
    if (row.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "usuario no existe" });

    //contraseña encriptada desde el front
    //manejar encriptacion
    //comprobar la contraseña de la petición con la contraseña de la bd
    if (password === row[0].pass) {
      //exito en el login
      //crear y enviar un token
      const token = getToken({ sub: dni });
      return res
        .status(200)
        .json({ success: true, message: "login ok", token: token });
    } else {
      //no coincide
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.log("error de login ", error.message);
    return res.status(400).json({ message: "error" });
  }
};

//funcion para validar cualquier tabla y cualquier fila
const userExist = async (cnn, tabla, atributo, valor) => {
  try {
    const [row] = await cnn.query(
      `SELECT * FROM ${tabla} WHERE ${atributo}=?`,
      [valor]
    );

    return row.length > 0;
  } catch (error) {
    console.log("userExist", error);
  }
};

//crear usuarios desde el sigup
export const createUsers = async (req, res) => {
  try {
    //establecer la conexion
    const cnn = await connect();
    //desestructurar el cuerpo de mi peticion http
    const { nombre, dni, correo, password } = req.body; //esto viene de la peticion

    //validar con mi funcion
    const dniExist = await userExist(cnn, "alumno", "dni", dni);
    const correoExist = await userExist(cnn, "alumno", "correo", correo);

    if (dniExist || correoExist) {
      //existe el usaurio en la bd
      return res.json({ message: "ya existe el usuario" });
    } else {
      //creamos el query, usanmos ? para prevenir inyeccion sql
      const [row] = await cnn.query(
        "INSERT INTO alumno ( nombre, dni, correo, pass) VALUES ( ?, ?, ?, ?)",
        [nombre, dni, correo, password]
      );

      //comprobar si se inserto en la bd
      if (row.affectedRows === 1) {
        //si se inserto
        return res.json({
          message: "se creo el alumno con exito",
          success: true,
        });
      } else {
        return res.status(500).json({ message: "no se creo el usuario" });
      }
    }
  } catch (error) {
    console.log("create user", error.message);
    res.json({
      message: "no se pudo conectar con la base de datos",
      success: false,
    });
  }
};

//privada
//generar el token
const getToken = (payload) => {
  //generar el token
  try {
    const token = jwt.sign(payload, secreto, { expiresIn: "5m" });
    return token;
  } catch (error) {
    console.log(error);
    return error;
  }
};
