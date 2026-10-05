const fs = require("fs");
const path = require("path");
const strip = require("strip-comments");

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".git") && !fullPath.includes("dist") && !fullPath.includes("build")) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx") || fullPath.endsWith(".ts") || fullPath.endsWith(".tsx") || fullPath.endsWith(".css") || fullPath.endsWith(".html")) {
      let original = fs.readFileSync(fullPath, "utf8");
      let content = original;
      
      try {
        content = strip(content);
        
        
        content = content.replace(/\r?\n{3,}/g, "\n\n");
        
        if (content !== original) {
          fs.writeFileSync(fullPath, content, "utf8");
          console.log("Cleaned: " + fullPath);
        }
      } catch (e) {
        console.error("Error processing: " + fullPath, e.message);
      }
    }
  }
}

processDir(__dirname);
console.log("Done");
