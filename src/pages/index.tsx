import type { NextPage } from "next";
import dynamic from "next/dynamic";
const TreeStage = dynamic(() => import("../components/Tree/TreeStage"), { ssr: false });

const Home: NextPage = () => {
  return <TreeStage />;
};

export default Home;
