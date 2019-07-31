<?php
/**
 * index.php
 *
 * UI endpoint for SerbianCloud
 */
?>
<html>
    <head>
        <title>SerbianCloud</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="stylesheet" href="css/main.css" type="text/css" />
        <link rel="shortcut icon" href="img/favicon.png" type="image/png" />
        <script src="js/main.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="wrapper">
            <header id="header">SerbianCloud</header>
            <article id="content">
                <form action="image.php" method="POST" id="form">
                    <textarea id="input" name="text" placeholder="Unesite svoj tekst ovde" rows="15"></textarea>
                    <input type="submit" id="submit" value="Unesi"></input>
                </form>
                <img id="result" />
            </article>
            <footer id="footer">
                Copyright &copy; 2017. Nevermore Inc. All rights reserved.
            </footer>
        </div>
    </body>
</html>
