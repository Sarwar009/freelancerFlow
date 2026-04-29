import Login from "@/components/Login"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>
}) {
  const params = await searchParams
  const demo = params.demo === "true"

  return <Login demo={demo} />
}