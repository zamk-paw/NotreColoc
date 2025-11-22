"use client";

import { useState } from "react";
import { CopyCheck, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  value: string;
  label: string;
};

export function CopyButton({ value, label }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Copié ✅");
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <CopyCheck className="mr-2 h-4 w-4" /> : <CopyIcon className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
