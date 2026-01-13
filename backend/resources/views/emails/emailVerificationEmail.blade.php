<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        h1 {
            color: #333333;
        }
        p {
            color: #555555;
        }
        a {
            color: #1a73e8;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenido</h1>
        <p>Antes que nada quiero darte la bienvenida y agradecerte por haberte registrado.</p>
        <p>Por último solamente debes activar tu cuenta y basta con hacer clic en el siguiente enlace.</p>
        <a href="{{ route('user.verify', $token) }}">Verificar correo electrónico</a>
        <p>Si tú no realizaste el registro no te preocupes y solamente ignora este correo.</p>
    </div>
</body>
</html>
