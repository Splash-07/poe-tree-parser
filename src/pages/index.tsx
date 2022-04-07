import type { NextPage } from "next";
import dynamic from "next/dynamic";
const AtlasVisualizer = dynamic(() => import("../components/AtlasVisualizer/AtlasVisualizer"), { ssr: false });

const Home: NextPage = () => {
  return <AtlasVisualizer />;
};

export default Home;
