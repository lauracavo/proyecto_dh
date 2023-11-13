const { validationResult, body } = require("express-validator");
const session = require("express-session");
const db = require("../../database/models");
const bcrypt = require('bcryptjs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersControllerVersionLaura = {
  register: (req, res) => {
    res.render("register");
  },

  store: (req, res) => {
    let errors = validationResult(req);
    console.log(errors)
    if (errors.isEmpty()) {
      // Si la foto de perfil se cargó correctamente, accedemos a ella
      const profile_image = req.file ? req.file.filename : null;

      const {
        fullName,
        image,
        password,
        email,
        rol
      } = req.body;
      const hashPassword = bcrypt.hashSync(password, 10);


      // Almacenamos los datos del usuario en un objeto
      const user = {
        fullname: fullName,
        password: hashPassword,
        email: email,
        image: req.file.filename,
        rol: (req.body?.teacher == 'on') ? 'profesor' : 'cliente'

      };

      // Guardamos el usuario en la base de datos
      db.User.create(user);
      res.redirect("/users/login")

    }
  },

  login: (req, res) => {
    res.render("login");
  },

  processLogin: async (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email } = req.body;

      // Busca el usuario en la base de datos por correo electrónico
      const userLogin = await db.User.findOne({ where: { email: email } });


      if (userLogin) {
        const correctPassword = bcrypt.compareSync(req.body.password, userLogin.password);
        if (correctPassword) {
          // Almacena el usuario en la sesión
          req.session.successLoginUser = userLogin;

          // Almacena el correo en una cookie
          res.cookie("email", email, { maxAge: ((1000 * 60) * 60) * 24 });

          // Redirige a la página de perfil y pasa los datos del usuario
          res.redirect("/users/userProfile")

        } else {
          res.render("login", { errors: [{ msg: "CORREO O CONTRASEÑA INCORRECTOS" }] });
        }
      } else {
        res.render("login", { errors: [{ msg: "CORREO O CONTRASEÑA INCORRECTOS" }] });
      }
    } else {
      res.render("login", { errors: errors.mapped() });
    }
  },

  userProfile: async (req, res) => {
    const enteredUser = req.cookies.email; // Correo ingresado por el usuario (session / coockies)

    // Busca el usuario en la base de datos por correo electrónico
    const foundUser = await db.User.findOne({ where: { email: enteredUser } });

    if (foundUser) {
      // Usuario encontrado, pasa sus datos a la vista de perfil
      res.render('userProfile', { userInfo: foundUser });
    } else {
      // Usuario no encontrado
      res.status(404).send('Usuario no encontrado');
    }
  },

  viewEdit: async (req, res) => {
    const enteredUser = req.cookies.email; // Correo ingresado por el usuario (session / cookies)
    try {
      let foundUser = await db.User.findOne({ where: { email: enteredUser } })

      if (foundUser) {
        // Usuario encontrado, pasa sus datos a la vista de edición
        /* console.log(JSON.stringify(foundUser)); */
        let userDetail = await db.Personal.findOne({ where: { idUser: foundUser.idUser } })
        /*  console.log(JSON.stringify(userDetail)); */
        let userInfo = {
          ...JSON.parse(JSON.stringify(foundUser))
        }
        if (userDetail) {
          userInfo = {
            ...userInfo,
            dni: userDetail.DNI,
            address: userDetail.adress,
            city: userDetail.city,
            province: userDetail.province,
            cp: userDetail.cp,
            cellphone: userDetail.cellphone,
          }
        }

        /* console.log(JSON.stringify(userInfo)); */
        res.render('../views/editUser.ejs', { userInfo: userInfo });
      } else {
        // Usuario no encontrado
        res.status(404).send('Usuario no encontrado');
      }

    } catch (error) {
      res.status(500).send('Error interno del servidor');
    }
  },


  actualizar: async (req, res) => {

    try {
      let idUser = req.params.id

      let datosUsuario = {
        fullname: req.body.fullname,
        email: req.body.email,
      };

      /* console.log("datos de usuario:", datosUsuario); */

      await db.User.update({ ...datosUsuario }, { where: { idUser: idUser } })

      /* console.log("actualizando usuario"); */

      let userDetail = await db.Personal.findOne({ where: { idUser: idUser } });

      let datosFacturacion = {
        DNI: req.body.dni,
        adress: req.body.address,
        city: req.body.city,
        province: req.body.province,
        cp: req.body.cp,
        cellphone: req.body.cellphone,
      }

      /*  console.log("datos de facturación:", datosFacturacion);
 
       console.log("detalle de usuario:", userDetail); */

      if (userDetail) {
        await db.Personal.update({ ...datosFacturacion }, { where: { idUser: idUser } })
      } else {
        await db.Personal.create({ ...datosFacturacion, idUser: idUser })
      }

      // Almacena el correo que cambió el usuario en una cookie
      res.cookie("email", datosUsuario.email, { maxAge: ((1000 * 60) * 60) * 24 });

      res.redirect("/users/userProfile");

    } catch (error) {
      console.log(error);
      res.status(500).send('Error interno del servidor');
    }
  },

  viewPassword: (req, res) => {
    res.render("editPassword")
  },

  editPassword: async (req, res) => {
    const enteredUser = req.cookies.email; // Correo ingresado por el usuario (session / coockies)

    console.log("campos del cuerpo:", req.body);
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      // Busca el usuario en la base de datos por correo electrónico
      const foundUser = await db.User.findOne({ where: { email: enteredUser } });
      const correctPassword = bcrypt.compareSync(req.body.oldPassword, foundUser.password);

      if (correctPassword) {
        let newPassword = req.body.password;
        const hashPassword = bcrypt.hashSync(newPassword, 10);

        await db.User.update({ password: hashPassword }, { where: { idUser: foundUser.idUser } })

      } else {
        res.render("editPassword", { errors: [{ msg: "LA CONTRASEÑA ES INCORRECTA" }] });
      }

    } else {
      res.render("editPassword", { errors: errors.mapped() });
    }

  },

  eliminar: async (req, res) => {
    const enteredUser = req.cookies.email;
    const foundUser = await db.User.findOne({ where: { email: enteredUser } });

    try {
      await db.User.destroy({ where: { idUser: foundUser.idUser } });
      res.json({ success: true, message: "Usuario eliminado con éxito." });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ success: false, message: "Error al eliminar usuario." });
    }
  }


}


module.exports = usersControllerVersionLaura;