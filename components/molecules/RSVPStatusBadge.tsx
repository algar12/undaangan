import { Badge } from "@/components/atoms/Badge";
import { RSVP_STATUS_LABELS } from "@/lib/constants";
import type { RSVPStatus } from "@/types";

interface RSVPStatusBadgeProps {
  status: RSVPStatus;
}

const variantMap: Record<RSVPStatus, "success" | "danger" | "warning"> = {
  attending: "success",
  not_attending: "danger",
  maybe: "warning",
};

const iconMap: Record<RSVPStatus, string> = {
  attending: "✓",
  not_attending: "✗",
  maybe: "?",
};

export function RSVPStatusBadge({ status }: RSVPStatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      <span aria-hidden="true">{iconMap[status]}</span>
      {RSVP_STATUS_LABELS[status]}
    </Badge>
  );
}
