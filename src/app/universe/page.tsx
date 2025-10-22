"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ProjectUniverse = dynamic(() => import("@/components/3d/ProjectUniverse").then((m) => m.ProjectUniverse), {
  ssr: false,
  loading: () => null,
});

export default function UniversePage() {
  return (
    <div className="relative">
      <motion.section className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <ProjectUniverse renderBelowDetails />
      </motion.section>
    </div>
  );
}

