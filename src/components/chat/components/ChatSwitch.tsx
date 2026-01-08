import { MapContainer, TileLayer } from "react-leaflet";
import { FilePreview } from "./FilePreview";
import type { Message } from "../../../types/message";
import LoadingDots from "./Dots";
import * as motion from "motion/react-client";
import { OptionSection } from "./OptionSection";
import { useState } from "react";
import { ErrorBoundary } from "./ErrorHandling";
import { DocumentIcon } from "../icons/DocumentIcon";
import { MarpMarkdown } from "./Markdown";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { MapMessage } from "./messageType/MapMessage";
import AudioVisualizer from "./messageType/AudioMessage";
import remend from "remend";

function MessageWrapper({
  message,
  direction,
}: {
  message: Message;
  direction: string;
}) {
  const isAssistant = message.role === "assistant";

  let defaultMessage = (
    <div className="message-content bg-gray-100 rounded-md flex flex-col w-fit w-max-[300px] px-3.5 py-1.5 !-mt-1">
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
      >
        {remend(message.content)}
      </Markdown>
    </div>
  );

  // assistant change
  if (isAssistant && message.content === "loading") {
    defaultMessage = (
      <div className="flex flex-row-reverse">
        <div className="">
          <div className="message-content bg-gray-100 rounded-md flex w-fit px-3.5 py-1.5 !-mt-1">
            <LoadingDots />
          </div>
        </div>
      </div>
    );
  }

  return <div className="flex flex-col w-full">{defaultMessage}</div>;
}

function ExtraOption({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return null;
  }

  const chatId = message.id;
  const file =
    message.files.length > 0 ? (
      <FilePreview showDeleteButton={false} files={message.files} />
    ) : null;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const createLayerId = (chatItemIndex: string) => {
    const id = `layer-${chatId}-${chatItemIndex}`;
    return id;
  };

  const items = [];

  if (message.files.length > 0) {
    items.push({
      title: "File 1",
      description: "Description of file 1",
      icon: <DocumentIcon />,
      layoutId: createLayerId("file"),
      onClick: () => console.log("File 1 clicked"),
      content: ({ key }: any) => (
        <motion.div key={key} layoutId={"file1"} className="message-file">
          {file}
        </motion.div>
      ),
    });
  }

  const onItemChange = (value: string) => {
    if (value === selectedOption) {
      setSelectedOption(null);
      return;
    }
    setSelectedOption(value);
  };

  return (
    <ErrorBoundary>
      <OptionSection onChange={onItemChange} options={items}>
        {items.map((item, index) => {
          return (
            item.layoutId === selectedOption && (
              <motion.div
                layout
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.5 }}
                layoutId={item.layoutId}
                className="bg-gray-100 rounded-md p-2 absolute w-full z-10 shadow "
                onClick={() => onItemChange(item.layoutId)}
              >
                {item.content({ key: index })}
              </motion.div>
            )
          );
        })}
      </OptionSection>
    </ErrorBoundary>
  );
}

export const ChatSwitch = ({
  message,
  direction,
}: {
  message: Message;
  direction: string;
}) => {
  // testing
  if (message.content === "geojson") {
    message.type = "map";
  }

  switch (message.type) {
    case "text":
      return (
        <div className="flex flex-col gap-2 pb-2">
          <MessageWrapper message={message} direction={direction} />
          <ExtraOption message={message} />
        </div>
      );
    case "image":
      return (
        <img src={message.content} alt="Chat media" className="message image" />
      );
    case "audio":
      return <AudioVisualizer audioSrc={message.content} />;

    case "canvas":
      return (
        <canvas
          className="message canvas"
          ref={(el) => {
            if (el) {
              const ctx = el.getContext("2d");
              if (ctx) {
                // Example: Draw something simple
                ctx.fillStyle = "lightblue";
                ctx.fillRect(0, 0, el.width, el.height);
                ctx.fillStyle = "black";
                ctx.fillText("Canvas Content", 10, 20);
              }
            }
          }}
          width={200}
          height={100}
        />
      );
    case "map":
      return (
        <div className="flex justify-center">
          <MapMessage message={message.content} />
        </div>
      );
    default:
      return <div>Unsupported message type</div>;
  }
};
