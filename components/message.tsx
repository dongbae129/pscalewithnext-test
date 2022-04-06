import { cls } from "../libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      <div className="w-8 h-8 rounded-full mx-2 bg-slate-400" />
      <div className="w-1/2 text-sm break-all text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
    </div>
  );
}
