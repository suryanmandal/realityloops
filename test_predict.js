const { client } = require("@gradio/client");
const fs = require("fs");

async function run() {
  try {
    const app = await client("stabilityai/stable-fast-3d");
    console.log("Connected to Gradio. Submitting prediction...");
    
    // Check if food image exists
    let imagePath = "public/foods/margherita-pizza.jpg";
    if (!fs.existsSync(imagePath)) {
      imagePath = "public/favicon.ico"; // fallback
    }
    
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });

    // Calling endpoint #5 (run_button)
    // input index mapping:
    // 0: button (null)
    // 1: input image (Blob)
    // 2: state (null)
    // 3: foreground ratio (0.85)
    // 4: remeshing ("None")
    // 5: vertex count (-1)
    // 6: texture size (1024)
    
    const result = await app.predict(5, [
      null,
      imageBlob,
      null,
      0.85,
      "None",
      -1,
      1024
    ]);
    
    console.log("SUCCESS! Result keys:", Object.keys(result));
    console.log("Result data array length:", result.data ? result.data.length : "undefined");
    if (result.data) {
      result.data.forEach((item, idx) => {
        console.log(`Item #${idx}: type:`, typeof item, item ? (item.orig_name || item.name || typeof item) : "null");
      });
    }
  } catch (err) {
    console.error("ERROR running model:", err);
  }
}

run();
