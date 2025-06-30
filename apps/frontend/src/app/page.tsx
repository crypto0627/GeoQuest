import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-cyan-200 to-cyan-300">
      <div className="w-[390px] h-[844px] mx-auto my-8 relative shadow-2xl rounded-2xl overflow-hidden border border-neutral-800">
        <HomeClient />
      </div>
    </div>
  );
}