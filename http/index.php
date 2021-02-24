<html>
    <head>
        <title>Bezbednost veb aplikacija</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="css/main.css" async />
        <script src="js/main.js" async></script>
    </head>
    <body>
        <?php require_once 'db.php'; ?>
        <header>
            <h1>Bezbednost veb aplikacija</h1>
        </header>
        <main>
            <section id="sql-injection">
                <h2>SQL Injection</h2>
                <?php
                session_start();
                if (empty($_SESSION['username'])) {
                    ?>
                    <form action="login.php" method="POST">
                        <h3>Log In</h3>
                        <p>
                            <input type="text" name="username" id="login-username" placeholder="Username..."></input>
                        </p>
                        <p>
                            <input type="password" name="password" id="login-password" placeholder="Password..."></input>
                        </p>
                        <p>
                            <input type="submit" value="Log In"></input>
                        </p>
                    </form>
                    <form action="register.php" method="POST">
                        <h3>Register</h3>
                        <p>
                            <input type="text" name="username" id="register-username" placeholder="Username..."></input>
                        </p>
                        <p>
                            <input type="password" name="password" id="register-password" placeholder="Password..."></input>
                        </p>
                        <p>
                            <input type="submit" value="Register"></input>
                        </p>
                    </form>
                    <?php
                } else {
                    ?>
                    <p>Logged in as <?php echo htmlentities($_SESSION['username']); ?>.</p>
                    <?php
                }
                ?>
            </section>
            <section id="xss">
                <h2>Cross Site Scripting (XSS)</h2>
                <p>List of all site users:</p>
                <ul>
                    <?php
                    if ($result = $db->query('SELECT username FROM users')) {
                        while ($row = $result->fetch_assoc()) {
                            ?><li><?php echo htmlentities($row['username']); ?></li><?php
                        }
                        $result->free();
                    } else {
                        ?><li>No users.</li><?php
                    }
                    ?>
                </ul>
            </section>
            <section id="csrf">
                <h2>Cross Site Request Forgery (CSRF)</h2>
                <?php
                if (empty($_SESSION['username'])) {
                ?>
                <p>Log in to view this section.</p>
                <?php
                } else {
                ?>
                <p>
                    Your current description is:
                    <?php
                        if (empty($_SESSION['description'])) {
                            ?><em>Not set.</em><?php
                        } else {
                            echo htmlentities($_SESSION['description']);
                        }
                    ?>
                </p>
                <form action="description.php" method="GET">
                    <textarea name="description" placeholder="Your new description..."></textarea>
                    <input type="submit" value="Change description"></input>
                </form>
                <?php } ?>
            </section>
            <section id="auth">
                <h2>Nedostatak autentikacije</h2>
                <?php
                if (!empty($_SESSION['username']) && $_SESSION['username'] == 'admin') {
                ?>
                <form action="admin.php" method="GET">
                    <input type="submit" value="Do admin action"></input>
                </form>
                <?php
                } else {
                ?>
                <p>Insufficient permissions.</p>
                <?php } ?>
            </section>
        </main>
        <?php $db->close(); ?>
    </body>
</html>
