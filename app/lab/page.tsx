import { Canvas } from "@/components/experience/Canvas";
import { Unboxing } from "@/components/experience/Unboxing";
import { XRayDetail } from "@/components/experience/XRayDetail";

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-50">
      <Canvas className="h-screen" />
      <XRayDetail />
      <Unboxing className="pb-16" />
    </main>
  );
}
