export type SupportedFileType = "image" | "pdf" | "text" | "unsupported";

// src/utils/fileTypes.ts

export const FILE_TYPE_MAP: Record<string, SupportedFileType> = {
  // Images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  // PDF
  pdf: "pdf",
  // Text-based
  txt: "text",
  md: "text",
  json: "text",
  xml: "text",
  csv: "text",
  js: "text",
  ts: "text",
  html: "text",
  css: "text",
  yaml: "text",
  yml: "text",
  // Add more as needed
};

export const getFileTypeFromUrl = (url: string): SupportedFileType => {
  try {
    // Remove query parameters and fragments
    const path = url.split(/[#?]/)[0];
    // Extract the filename (last part of the path)
    const filename = path.split("/").pop();
    if (!filename || filename.indexOf(".") === -1) {
      return "unsupported";
    }
    // Extract the extension (after the last dot)
    const extension = filename
      .slice(filename.lastIndexOf(".") + 1)
      .toLowerCase();
    return FILE_TYPE_MAP[extension] ?? "unsupported";
  } catch {
    return "unsupported";
  }
};

export function createTextFile(
  content = "Hello, World!",
  fileName = "test.txt",
) {
  return new File([content], fileName, {
    type: "text/plain",
    lastModified: new Date(),
  });
}

export const getFileType = (file: File): SupportedFileType => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type.startsWith("text/") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".json") ||
    file.name.endsWith(".xml") ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".js") ||
    file.name.endsWith(".ts") ||
    file.name.endsWith(".html") ||
    file.name.endsWith(".css")
  )
    return "text";
  return "unsupported";
};

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
