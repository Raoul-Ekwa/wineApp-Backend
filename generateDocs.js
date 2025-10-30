import fs from "fs";
import path from "path";
import { execSync } from "child_process";

//  Modèle Ollama à utiliser
const OLLAMA_MODEL = "llama3"; // ou "codellama" si tu l’as installé

//  Extensions de fichiers à inclure
const INCLUDED_EXT = [".js", ".ts"];

//  Lecture d’un fichier .ollamaignore (si présent)
function loadIgnoreList() {
  const defaultIgnores = [
    "node_modules",
    ".git",
    ".env",
    "logs",
    "uploads",
    "coverage",
    "package-lock.json",
  ];

  if (fs.existsSync(".ollamaignore")) {
    const lines = fs
      .readFileSync(".ollamaignore", "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    return [...new Set([...defaultIgnores, ...lines])];
  }

  return defaultIgnores;
}

//  Lecture récursive du projet
function readFilesRecursively(dir, ignores) {
  let filesContent = "";
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignores.includes(item)) {
        filesContent += readFilesRecursively(fullPath, ignores);
      }
    } else if (INCLUDED_EXT.some((ext) => item.endsWith(ext))) {
      const content = fs.readFileSync(fullPath, "utf-8");
      filesContent += `\n\n### ${fullPath}\n\`\`\`js\n${content}\n\`\`\`\n`;
    }
  }
  return filesContent;
}

//  Fonction principale
function generateDocs() {
  console.log(" Lecture du projet Express...");
  const ignoreList = loadIgnoreList();

  const srcDir = fs.existsSync("./src") ? "./src" : ".";
  const projectContent = readFilesRecursively(srcDir, ignoreList);

  console.log(" Génération de la documentation avec Ollama...");
  const section7 = `7. Explication des fichiers \`config/\` et \`utils/\``;

  const prompt = `
Tu es un assistant technique spécialisé en Node.js et Express.

Analyse le code suivant du projet **WineApp Backend** et rédige une documentation complète en Markdown.

La documentation doit comporter les sections suivantes :
1. Description générale du projet (objectif, technologies utilisées)
2. Structure des dossiers (routes, controllers, models, middlewares, utils, config)
3. Liste des routes (méthodes, endpoints, fichiers sources)
4. Description des contrôleurs et de leurs rôles
5. Description des middlewares (authentification, logs, erreurs, etc.)
6. Description des modèles de données (schémas Mongoose ou autres)
8. Explication du fichier server.js (démarrage du serveur)
9. Liste des dépendances clés (ex: express, mongoose, dotenv, etc.)

Code du projet :
${projectContent}
`;

  const safePrompt = prompt.replace(/"/g, '\\"');

  // Créer un fichier temporaire pour stocker le prompt
  const tempFilePath = "./tempPrompt.txt";
  fs.writeFileSync(tempFilePath, safePrompt);

  try {
    const command = `ollama run ${OLLAMA_MODEL} < ${tempFilePath}`;

    const result = execSync(command, {
      encoding: "utf-8",
      maxBuffer: 1024 * 1024 * 20, // gros buffer pour les grands projets
    });

    // Supprimer le fichier temporaire après l'exécution
    fs.unlinkSync(tempFilePath);

    // Écrire la documentation générée
    fs.writeFileSync("DOCUMENTATION.md", result);
    console.log(" Documentation générée : DOCUMENTATION.md");
  } catch (err) {
    console.error(" Erreur pendant la génération :", err.message);
  }
}

generateDocs();
