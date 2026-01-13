<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
 <h1>Bienvenido  </h1>

<p>Este es un correo para verificar tu nuevo corro electrónico.</p>
<a href="{{ route('user.new_email', ['token'=>$token,'email'=> $email]) }}">Verificar correo electrónico</a>
<p>Si tú no solicitaste el cambio de correo electrónico no te preocupes y solamente ignora este correo.</p>
<p>
Excelente día te desea <a href="https://dowar.xyz">dowar</a> 
</p>   
</body>
</html>
