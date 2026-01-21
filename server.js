const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// load environment variables from .env file
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const PORT = 3000;
const VERIFICATION_API_BASE_URL = process.env.VERIFICATION_API_BASE_URL || "verification.didit.me";
const API_KEY = process.env.API_KEY;
const WORKFLOW_ID = process.env.WORKFLOW_ID;

const server = http.createServer((req, res) => {
  // cors headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // config endpoint - returns workflow_id for api-session demo
  if (req.url === "/api/config" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ workflow_id: WORKFLOW_ID }));
    return;
  }

  // proxy api requests - api_key stays server-side
  if (req.url === "/api/session" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const parsed = JSON.parse(body);
      const postData = JSON.stringify({ workflow_id: parsed.workflow_id || WORKFLOW_ID });

      const options = {
        hostname: VERIFICATION_API_BASE_URL,
        path: "/v3/session/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const apiReq = https.request(options, (apiRes) => {
        let data = "";
        apiRes.on("data", (chunk) => (data += chunk));
        apiRes.on("end", () => {
          res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
          res.end(data);
        });
      });

      apiReq.on("error", (e) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      });

      apiReq.write(postData);
      apiReq.end();
    });
    return;
  }

  // serve static files
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentTypes[ext] || "text/plain" });
      res.end(content);
    }
  });
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
