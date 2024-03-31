// HTML email template with personalized greeting
export const createAccountEmail = (user: string) => `<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: "Quicksand", sans-serif;
      font-optical-sizing: auto;
      font-weight: 500;
      font-style: normal;
      background-color: #1d1b1c;
      color: #fff;
    }
  </style>
</head>
<body>
    <table style="width: 100%; padding:1rem; background-color: rgba(0, 0, 0, 0.025);">
      <tr>
        <td style="display: flex; align-items: end; font-size: 1.25rem; padding-block: 1rem; border-bottom: 1px solid hsl(0, 0%, 75%)">
          <img src="https://taskify.sirv.com/logo.svg" alt="Taskify Logo" height="26" />
          <span style="color:#00DB96; font-weight:600;">Taskify</span>
        </td>
      </tr>
      <tr>
        <td style="padding-block: 3rem 0; border-bottom: 1px solid hsl(0, 0%, 75%)">
          <img src="https://taskify.sirv.com/Street%20Life%20-%20Standing.png" height="200">
          <h3>Welcome to Taskify, ${user}!</h3> <!-- Personalized greeting -->
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:1rem; font-size: 0.85rem;">
          <p style="opacity: 0.6;">
            Welcome aboard to <strong>Taskify</strong>, your new destination for streamlined task management! We're thrilled to have you join our community and embark on this journey towards enhanced productivity and efficiency.
          </p>
          <div style="margin-top: 2rem;">
            <a href="#_" style="padding-block: 0.75rem; padding-inline: 1.5rem; font-weight: 500; letter-spacing: 0.025em; color: #1d1b1c; transition-duration: 0.2s; background-color: #00DB96; border-radius: 0.375rem; text-decoration: none; border: none; cursor: pointer; outline: none;">
              Go to Dashboard
            </a>
          </div>
        </td>
      </tr>
    </table>
</body>
</html>`;