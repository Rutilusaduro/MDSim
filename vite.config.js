import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const CONTENT_MODULES = [
  '/src/content/',
  '/src/patientDialogue.js',
  '/src/patientVisitDialogue.js',
  '/src/visitDialogueBeats.js',
  '/src/interactionDialogue.js',
  '/src/staffDialogue.js',
  '/src/staffCheckInDialogue.js',
  '/src/bodyProse.js',
  '/src/patientAppearance.js',
  '/src/weeklyContent.js',
  '/src/v3WeeklyContent.js',
  '/src/scenes/',
  '/src/staffArcs/',
  '/src/groupScenes.js',
  '/src/v4GroupScenes.js',
];

export default defineConfig({
  base: '/MDSim/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (CONTENT_MODULES.some((m) => id.includes(m))) return 'content';
          return undefined;
        },
      },
    },
  },
});
