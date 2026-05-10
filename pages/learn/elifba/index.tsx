import { useEffect } from "react";
import { useRouter } from "next/router";

/** /learn/elifba → müfredat sekmesiyle /learn?tab=elif */
export default function ElifbaIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    void router.replace("/learn?tab=elif");
  }, [router]);
  return (
    <div className="flex min-h-[30vh] items-center justify-center text-sm text-zinc-500" />
  );
}
