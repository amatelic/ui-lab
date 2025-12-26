import { FileExplorer } from "../chat/components/FileExplorer/FileExplorer";
import JojoSnake from "../../assets/jojo/snake.png";
import Jojod4c from "../../assets/jojo/d4c.png";
import JojoKillerQueen from "../../assets/jojo/killer-queen.png";
import JojoMadeInHeaven from "../../assets/jojo/made-in-heaven.png";

export const FilePreviewPresentation = () => {
  return (
    <div className="w-full h-full p-8">
      <FileExplorer files={[Jojod4c, JojoKillerQueen, JojoMadeInHeaven]} />
    </div>
  );
};
