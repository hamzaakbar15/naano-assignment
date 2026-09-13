import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { avatarColor, initials } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";

export function PersonAvatar({
  name,
  size = "default",
  className,
}: {
  name: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const color = avatarColor(name);
  const sizeClass = size === "sm" ? "size-7 text-xs" : size === "lg" ? "size-12 text-base" : "size-9 text-sm";

  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarFallback className={cn(color.bg, color.text, "font-medium")}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
