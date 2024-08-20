import React, { useEffect } from "react";
import {
  getColorFromUsername,
  getEmojiFromUsername,
  randomUser,
} from "@/app/utils/random";

interface EmojiPickerProps {
  username: string;
  setEmojiname: (username: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  username,
  setEmojiname,
}) => {
  const handleEmojiClick = () => {
    const randomUsername = randomUser();
    setEmojiname(randomUsername);
  };

  return (
    <div
      onClick={handleEmojiClick}
      className="mt-4 w-32 h-32 flex items-center justify-center rounded-full cursor-pointer text-7xl"
      style={{ backgroundColor: getColorFromUsername(username) }}
    >
      {getEmojiFromUsername(username)}
    </div>
  );
};

export default EmojiPicker;
