"use server"
import { validateLoginUsertoken } from "@/lib/functions"

export default async function page() {

  const userData = await validateLoginUsertoken();

  const data = userData.data;

  return (
    <div className="bg-red-500">
      <h1>{data.name}</h1>
    </div>
  )
}
