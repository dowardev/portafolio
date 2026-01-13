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
        .code {
            font-size: 1.5em;
            color: #333333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Restauración de contraseña</h1>
        <p>Tu código es: <strong class="code">{{ $code }}</strong></p>
        <p>Si tú no solicitaste la restauración de contraseña, no te preocupes y solamente ignora este correo.</p>
    </div>
</body>
</html>
