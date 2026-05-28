import { nunito, playWriteEnglandSemiJoined } from "@/lib/font";
import { validateLoginUsertoken } from "@/lib/functions";
import Link from "next/link";

export default async function page() {
  const userData = await validateLoginUsertoken();

  const data = userData.data;

  return (
    <div className={`min-h-screen min-w-screen flex flex-col items-center justify-center gap-[30px] px-[10%] text-white ${playWriteEnglandSemiJoined.className}`}>
      <h1 className="text-5xl font-bold">Hello, {data.name}</h1>

      <h3 className="text-2xl text-center font-[300]">Welcome to your Tier Maker</h3>

      <p className="text-justify text-lg">
        Tier Maker is a platform where you can create and share custom tier
        lists with people around the world. Every tier you create can be shared
        through a unique link, allowing your friends and community to vote and
        participate easily. You can manage your tiers anytime by activating or
        deactivating them, while also keeping track of your previously created
        and newly published tiers all in one place.
      </p>

      <div className={`flex flex-col items-center justify-center gap-[10px] ${nunito.className}`}>
        <Link className="button" href="/create">Create new Tier</Link>
        <button className="button">View Tier</button>
      </div>
    </div>
  );
}
