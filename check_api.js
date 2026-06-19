const { client } = require("@gradio/client");

async function run() {
  try {
    const app = await client("stabilityai/stable-fast-3d");
    console.log("SUCCESSFULLY CONNECTED");
    
    const config = app.config;
    console.log("COMPONENTS:");
    config.components.forEach((c) => {
      console.log(`ID: ${c.id}, Type: ${c.type}, Props:`, c.props);
    });
    console.log("DEPENDENCIES:");
    config.dependencies.forEach((d, idx) => {
      console.log(`Endpoint #${idx}: api_name: ${d.api_name}, inputs:`, d.inputs);
    });
  } catch (err) {
    console.error("ERROR CONNECTING TO SPACE:", err);
  }
}

run();
