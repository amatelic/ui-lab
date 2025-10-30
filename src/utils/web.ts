export function createTextFile(
  content = "Hello, World!",
  fileName = "test.txt",
) {
  return new File([content], fileName, {
    type: "text/plain",
    lastModified: new Date(),
  });
}

export function createTestImageFile(
  width = 200,
  height = 200,
  fileName = "test.png",
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.5, "#00ff00");
    gradient.addColorStop(1, "#0000ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add some text
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Test Image", width / 2, height / 2);

    // Convert to blob and then to file
    canvas.toBlob((blob) => {
      const file = new File([blob], fileName, {
        type: "image/png",
        lastModified: new Date(),
      });
      resolve(file);
    }, "image/png");
  });
}
