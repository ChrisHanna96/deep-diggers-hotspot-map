import ClientHomeSupabase from "./components/ClientHomeSupabase";
import { getLocations } from "./lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locations = await getLocations();

  return <ClientHomeSupabase locations={locations} />;
}