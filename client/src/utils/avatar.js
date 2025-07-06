// utils/avatar.js

export function getColorFromId(id) {
   if (!id || typeof id !== "string") return "#888";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

export function getInitials(name) {
  if (!name) return "";

  const parts = name.trim().split(/\s+/); // Split by any space
  const initials = parts.slice(0, 2).map(part => part[0]).join(""); // Take first 2 parts
  return initials.toUpperCase();
}

