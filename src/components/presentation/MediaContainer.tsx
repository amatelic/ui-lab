import { MediaExtraOption } from "../chat/components/messageType/MediaExtraOption";
import { createTextFile, createTestImageFile } from "../../utils/web";
import { useEffect, useState } from "react";

export const MediaContainer = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    (async function () {
      const files = await Promise.all([
        Promise.resolve(createTextFile()),
        createTestImageFile(),
      ]);
      setFiles([...files, ...files, ...files, ...files]);
    })();
  }, []);

  return (
    <div className="flex justify-centerw w-full h-screen p-4">
      <MediaExtraOption
        message={{
          id: "23312123",
          content: "./paza-moduless.mp3",
          avatar: "bla",
          files,
          role: "assistant",
          type: "audio",
          timestamp: new Date(),
        }}
      />
    </div>
  );
};
