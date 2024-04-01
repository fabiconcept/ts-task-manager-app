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
    <table style="width: 100%; padding:1rem; background-color: rgba(0, 0, 0, 0.025); text-align: center">
      <tr>
        <td style="display: flex; align-items: end; font-size: 1.25rem; padding-block: 1rem; border-bottom: 1px solid hsl(0, 0%, 75%)">
          <img src="https://taskify.sirv.com/shotgun.png" height="26">
          <span style="color:#00DB96; font-weight:600;">Taskify</span>
        </td>
      </tr>
      <tr>
        <td style="padding-block: 3rem 0; border-bottom: 1px solid hsl(0, 0%, 75%)">
          <br/>
          <br/>
          <img src="https://taskify.sirv.com/Street%20Life%20-%20Standing.png" height="200">
          <h3>Welcome to Taskify, ${user}!</h3> <!-- Personalized greeting -->
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:1rem; font-size: 0.85rem;">
          <p style="opacity: 0.6;">
            Welcome aboard to <strong>Taskify</strong>, your new destination for streamlined task management! We're thrilled to have you join our community and embark on this journey towards enhanced productivity and efficiency.
          </p>
          <br/>
          <div style="margin-top: 2rem;">
            <a href="#_" style="padding: 0.75rem 1.5rem; font-weight: 500; letter-spacing: 0.025em; color: #1d1b1c; transition-duration: 0.2s; background-color: #00DB96; border-radius: 0.375rem; text-decoration: none; border: none; cursor: pointer; outline: none;">
              Go to Dashboard
            </a>
          </div>
        </td>
      </tr>
    </table>
</body>
</html>`;

export const inviteEmail = (profile: string, user?: string) => {
  if (user) {
    return `
    <html>
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
      <table style="width: 100%; padding:1rem; background-color: rgba(0, 0, 0, 0.025); text-align: center;">
        <tr>
          <td style="display: flex; align-items: end; font-size: 1.25rem; padding-block: 1rem; border-bottom: 1px solid hsl(0, 0%, 75%)">
              <img src="https://taskify.sirv.com/shotgun.png" height="26">
            <span style="color:#00DB96; font-weight:600;">Taskify</span>
          </td>
        </tr>
        <tr>
          <td style="border-bottom: 1px solid hsl(0, 0%, 75%)">
            <br/>
            <br/>
            <img src="https://taskify.sirv.com/invited.png" height="200">
            <h3>You've been invited to join ${profile} </h3>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:1rem; font-size: 0.85rem;">
            <p style="opacity: 0.6;">
              Dear ${user},
            </p>
            <p style="opacity: 0.6;">
              You've been invited by ${profile} to join their Taskify account and collaborate on tasks efficiently and seamlessly. </p>
              <br/>
              <div style="margin-top: 2rem;">
                <a href="#_" style="padding: 0.75rem 1.5rem; font-weight: 500; letter-spacing: 0.025em; color: #1d1b1c; transition-duration: 0.2s; background-color: #00DB96; border-radius: 0.375rem; text-decoration: none; border: none; cursor: pointer; outline: none;">
                  Accept Invitation
                </a>
              </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  }

  return `<html>
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
    <table style="width: 100%; padding:1rem; background-color: rgba(0, 0, 0, 0.025); text-align: center;">
      <tr>
        <td style="display: flex; align-items: end; font-size: 1.25rem; padding-block: 1rem; border-bottom: 1px solid hsl(0, 0%, 75%)">
            <img src="https://taskify.sirv.com/shotgun.png" height="26">
          <span style="color:#00DB96; font-weight:600;">Taskify</span>
        </td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid hsl(0, 0%, 75%)">
          <br/>
          <br/>
          <img src="https://taskify.sirv.com/invited.png" height="200">
          <h3>You've been invited to join ${profile} </h3>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:1rem; font-size: 0.85rem;">
          <p style="opacity: 0.6;">
            You've been invited by ${profile} to join their Taskify account and collaborate on tasks efficiently and seamlessly. Taskify is a powerful task management platform designed to streamline team collaboration and boost productivity.
          </p>
          <p style="opacity: 0.6; text-align: left;">
            With Taskify, you can:
          </p>
          <ul style="opacity: 0.6; padding: 0 1.5rem; 0 0; text-align: left;">
            <li>Organize tasks and projects effectively.</li>
            <li>Assign tasks to team members and track progress.</li>
            <li>Set deadlines and receive reminders for upcoming tasks.</li>
            <li>Communicate with team members through comments and updates.</li>
          </ul>
          <br/>
          <div style="margin-top: 2rem;">
            <a href="#_" style="padding: 0.75rem 1.5rem; font-weight: 500; letter-spacing: 0.025em; color: #1d1b1c; transition-duration: 0.2s; background-color: #00DB96; border-radius: 0.375rem; text-decoration: none; border: none; cursor: pointer; outline: none;">
              Accept Invitation
            </a>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`
}