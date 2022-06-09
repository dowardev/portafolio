<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h1>Restauración de contraseña</h1>

@if(App::environment('production'))
   <a href="https://dowar.xyz/restore-password/{{$email}}/{{$code}}" target="_blank">Restaurar contraseña</a> 

    @else
   <a href="http://localhost:8100/restore-password/{{$email}}/{{$code}}" target="_blank">Restaurar contraseña</a> 

@endif

<p>Si tú no solicitaste la restauración de contraseña, no te preocupes y solamente ignora este correo.</p>
<p>
Excelente día te desea <a href="https://dowar.xyz">dowar</a> 
</p>   
   
</body>
</html>
