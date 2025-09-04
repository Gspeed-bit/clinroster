import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, CheckCircle2, Info } from "lucide-react";

type AlertType = "success" | "error" | "info";

type AlertBannerProps = {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
};

const Icon = ({ type }: { type: AlertType }) => {
  if (type === "success") return <CheckCircle2 className="h-5 w-5" />;
  if (type === "error") return <TriangleAlert className="h-5 w-5" />;
  return <Info className="h-5 w-5" />;
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = "info",
  title,
  message,
  onClose,
}) => {
  const variant = type === "error" ? "destructive" : "default";
  return (
    <div className="relative">
      <Alert variant={variant} className="pr-10">
        <Icon type={type} />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {onClose && (
        <button
          aria-label="Dismiss alert"
          onClick={onClose}
          className="absolute right-2 top-2 text-muted-foreground hover:opacity-80"
        >
          ×
        </button>
      )}
    </div>
  );
};
