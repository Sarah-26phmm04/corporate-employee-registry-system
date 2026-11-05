const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");
let users;

// HELPER: SERVES FILES FROM THE PUBLIC FOLDER
async function sendFile(res, fileName, contentType) {
    const filePath = path.join(__dirname, "public", fileName);

    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, {
            "Content-Type": `${contentType}; charset=utf-8`
        });
        res.end(data);
    } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
    }
}

// HELPER: READS FORM DATA
function readFormData(req) {
    return new Promise((resolve) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            resolve(new URLSearchParams(body));
        });
    });
}

// MAIN SERVER LOGIC
const server = http.createServer(async (req, res) => {
    try {

        // A. SERVING STATIC PAGES
        if (req.method === "GET" && req.url === "/") {
            return await sendFile(res, "index.html", "text/html");
        }

        if (req.method === "GET" && req.url === "/register.html") {
            return await sendFile(res, "register.html", "text/html");
        }

        if (req.method === "GET" && req.url === "/login.html") {
            return await sendFile(res, "login.html", "text/html");
        }

        if (req.method === "GET" && req.url === "/style.css") {
            return await sendFile(res, "style.css", "text/css");
        }

        // SERVING SEPARATE JAVASCRIPT FILE
        if (req.method === "GET" && req.url === "/script.js") {
            return await sendFile(res, "script.js", "application/javascript");
        }

        // B. CREATE - USER REGISTRATION
        if (req.method === "POST" && req.url === "/register") {
            const form = await readFormData(req);

            const name = form.get("name")?.trim();
            const email = form.get("email")?.trim().toLowerCase();
            const password = form.get("password");

            if (!name || !email || !password || password.length < 4) {
                res.writeHead(400, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                return res.end(
                    "<h2>Invalid fields filled out. Minimum password length is 4.</h2>"
                );
            }

            const existing = await users.findOne({ email });

            if (existing) {
                res.writeHead(400, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                return res.end("<h2>Email address already exists.</h2>");
            }

            await users.insertOne({
                name,
                email,
                password,
                phone: "+91 98765 43210"
            });

            res.writeHead(302, { Location: "/login.html" });
            return res.end();
        }

        // C. READ - USER LOGIN AND DASHBOARD
        if (req.method === "POST" && req.url === "/login") {
            const form = await readFormData(req);

            const email = form.get("email")?.trim().toLowerCase();
            const password = form.get("password");

            const user = await users.findOne({ email, password });

            if (!user) {
                res.writeHead(401, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                return res.end("<h2>Invalid login credentials.</h2>");
            }

            try {
                let data = await fs.readFile(
                    path.join(__dirname, "public", "dashboard.html"),
                    "utf8"
                );

                data = data.replaceAll("{{name}}", user.name);
                data = data.replaceAll("{{email}}", user.email);
                data = data.replaceAll(
                    "{{course}}",
                    "Creative Technology & Engineering"
                );
                data = data.replaceAll(
                    "{{phone}}",
                    user.phone || "+91 98765 43210"
                );

                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });

                return res.end(data);

            } catch (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                return res.end(
                    "Error loading system dashboard template file."
                );
            }
        }

        // D. READ - DISPLAY DATABASE USERS
        if (req.method === "GET" && req.url === "/users") {
            const list = await users.find({}).toArray();

            const rows = list.map(u =>
                `<tr><td>${u.name}</td><td>${u.email}</td></tr>`
            ).join("");

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            return res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Internal Directory</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="container" style="margin-top:40px;">
                        <h1>Internal Team Registry</h1>
                        <table border="1"
                            style="width:100%; border-collapse:collapse; margin-top:20px; background:white;">
                            <tr style="background:#7c6a9f; color:white;">
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                            ${rows}
                        </table>
                        <br>
                        <a href="/" class="btn btn-logout"
                            style="width:auto; display:inline-block;">
                            ← Back to Home
                        </a>
                    </div>
                </body>
                </html>
            `);
        }

        // E. UPDATE - PROFILE MODIFICATION
        if (req.method === "POST" && req.url === "/update-profile") {
            const form = await readFormData(req);

            const userEmail = form.get("email");
            const newName = form.get("newName")?.trim();
            const newPhone = form.get("newPhone")?.trim();

            if (!newName || !newPhone) {
                res.writeHead(400, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                return res.end("<h2>Invalid parameters provided.</h2>");
            }

            await users.updateOne(
                { email: userEmail },
                { $set: { name: newName, phone: newPhone } }
            );

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            return res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                        content="width=device-width, initial-scale=1.0">
                    <title>Profile Updated</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="login-body-wrapper">
                        <div class="card success-card">
                            <h2>Profile Updated Successfully!</h2>
                            <p>Your employee profile has been updated successfully.</p>
                            <a href="/login.html" class="btn btn-submit">
                                ← Click Here to Log In
                            </a>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }

        // F. DELETE - ACCOUNT DEACTIVATION
        if (req.method === "POST" && req.url === "/delete-account") {
            const form = await readFormData(req);
            const userEmail = form.get("email");

            await users.deleteOne({ email: userEmail });

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            return res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                        content="width=device-width, initial-scale=1.0">
                    <title>Account Deactivated</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="login-body-wrapper">
                        <div class="card success-card">
                            <h2>Account Deactivated Successfully!</h2>
                            <p>Your employee account has been successfully deleted from the registry.</p>
                            <a href="/" class="btn btn-submit">
                                ← Return to Main Page
                            </a>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }

        // UNKNOWN ROUTE
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found");

    } catch (globalErr) {
        console.error("Global Server Exception Caught:", globalErr);

        res.writeHead(500, {
            "Content-Type": "text/plain"
        });

        res.end("Internal Server Error");
    }
});

// SERVER INITIALIZATION AND DATABASE CONNECTION
const PORT = 3000;

async function startServer() {
    try {
        await client.connect();

        users = client.db("project_db").collection("users");

        console.log("MongoDB Connected Successfully");

        server.listen(PORT, () => {
            console.log(
                `Web server online running at http://localhost:${PORT}`
            );
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB server:", err);
        process.exit(1);
    }
}

startServer();

