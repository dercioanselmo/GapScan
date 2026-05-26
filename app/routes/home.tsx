import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GapScan" },
    { name: "description", content: "Smart feedback for your dram job " },
  ];
}

export default function Home() {
  return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
    <Navbar />
    <section>
      <div className="main-section">
        <h1>Track Your Application & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback</h2>
      </div>
    </section>

  </main>
}
