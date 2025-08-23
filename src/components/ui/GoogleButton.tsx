import { Button } from "./Button";
import Image from "next/image";

export function GoogleButton({ text = "Continue with Google" }: { text?: string }) {
  return (
    <Button variant="ghost" className="flex items-center justify-center gap-2">
      <Image src="/google.svg" alt="Google" width={20} height={20} />
      {text}
    </Button>
  );
}


