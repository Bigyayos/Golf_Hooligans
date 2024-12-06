import bcrypt from 'bcrypt';

const secret = 'your_jwt_secret'; // Cambia esto por una clave secreta segura

// Credenciales del superusuario
const adminUser = {
  username: 'admin',
  password: bcrypt.hashSync('adminpassword', 10) // Cambia esto por una contraseña segura
};

export { adminUser, secret };