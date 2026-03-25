import { Canvas } from "@/components/experience/canvas";
import { Unboxing } from "@/components/experience/unboxing";
import { XRayDetail } from "@/components/experience/x-ray-detail";

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-50">
      <Canvas className="h-screen" />
      <XRayDetail />
      <Unboxing className="pb-16" />
    </main>
  );
}
