// components/Avatar.jsx

import { getColorFromId, getInitials } from "../../utils/avatar";



export default function Avatar({username,senderId}) {

  const bgColor = getColorFromId(senderId);
  const initials = getInitials(username);

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
      style={{ backgroundColor: bgColor }}
      title={username}
    >
      {initials}
    </div>
  );
}
