<?php
$signup_error = '';
$signup_success = '';

if (isset($_POST['signup_submit'])) {
    include 'connect.php';
    
    $email = trim($_POST['su_email']);
    $password = $_POST['su_password'];
    $password2 = $_POST['su_password2'];

    // Validation
    if ($password !== $password2) {
        $signup_error = "Passwords do not match.";
    } elseif (strlen($password) < 6) {
        $signup_error = "Password must be at least 6 characters.";
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $hash);

        if ($stmt->execute()) {
            // Signup successful
            $signup_success = "Signup successful! Please login to continue.";
        } else {
            $signup_error = "Email already exists or database error.";
        }

        $stmt->close();
    }

    $conn->close();
}
?>
