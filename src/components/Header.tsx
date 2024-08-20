import { getEmojiFromUsername } from "@/app/utils/random";

export default function Header({ className }: { className: string }) {
  return (
    <div className={`px-5 sm:px-20 py-5 ${className}`}>
      <div className="text-5xl">
        {getEmojiFromUsername("128075-ffffff")}
        {getEmojiFromUsername("127827-ffffff")}
        {getEmojiFromUsername("128640-ffffff")}
      </div>
    </div>
  );
}
