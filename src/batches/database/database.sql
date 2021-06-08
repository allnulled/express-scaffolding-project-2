/* AUTHENTICATION */

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(40) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    token_recuperacion VARCHAR(255) DEFAULT NULL UNIQUE,
    momento_recuperacion DATETIME DEFAULT NULL
);
CREATE TABLE usuarios_no_registrados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(40) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    token_confirmacion VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE sesiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    momento_creacion DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
CREATE TABLE grupos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL UNIQUE
);
CREATE TABLE privilegios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL UNIQUE
);
CREATE TABLE usuarios_y_grupos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_grupo) REFERENCES grupos (id)
);
CREATE TABLE grupos_y_privilegios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_grupo INT NOT NULL,
    id_privilegio INT NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos (id),
    FOREIGN KEY (id_privilegio) REFERENCES privilegios (id)
);
INSERT INTO usuarios (nombre, contrasenia, correo_electronico, token_recuperacion, momento_recuperacion)
VALUES
	('administrador', /*'admin123'*/ '$2b$12$NlUObs1HlsSS704oW7mZeu.qL5JqWsHelodr1lqnXhKDo3GnXUol6', 'carlosjimenohernandez@gmail.com', NULL, '2021-05-01'),
    ('propietario', /*'propietario123'*/ '$2b$12$MJUe6ewPyzFqSgY8XevOAepdwlzxRBZ/MqN56lqJRe9d2RIvIx9Ma', 'propietario@dominio.com', NULL, '2021-05-01');

INSERT INTO grupos (nombre)
VALUES
	('administradores'),
	('propietarios');

INSERT INTO privilegios (nombre)
VALUES
	('administrar sitio web sin restricciones'),
    ('administrar sitio web');

INSERT INTO usuarios_y_grupos(id_usuario, id_grupo)
VALUES
	(1, 1),
	(2, 2);

INSERT INTO grupos_y_privilegios(id_grupo, id_privilegio)
VALUES
	(1, 1),
	(1, 2),
	(2, 2);

INSERT INTO sesiones (id_usuario, token, momento_creacion)
VALUES (1, 'CAFfPGpwTf3EsWVplatpUXAWYhkLvcJ2DwONs6ny8ObA6SbhwZ6lbTSUwgoUVRatDji1aaxFNgfI8izc0qb8MkkXy4fdXdw1xzHxPRPqvPClVPabVtTcPHUUa9yPNiig37lTBRytSh7JCdUHGn5ybkhc1K1tvz7XuWLEgMo3zF2SLit2GWNk6RjGqXHebyWEfo4DpJU2', '2021-05-01');

