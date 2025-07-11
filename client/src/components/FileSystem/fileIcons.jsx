// src/utils/fileIcons.js

// VSC
import { VscFile, VscFilePdf, VscFileMedia, VscFileZip } from "react-icons/vsc";

// Si (Simple Icons)
import {
  SiJavascript, SiTypescript, SiPython, SiHtml5, SiCss3,
  SiJson, SiMarkdown, SiCplusplus, SiGo, SiRust, SiKotlin,
  SiPhp, SiRuby, SiSwift, SiMysql, SiDocker, SiGit, SiYaml
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
// Fa
import { FaFileAlt, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileCsv,FaJava,FaReact } from "react-icons/fa";

// Md
import { MdImage, MdAudiotrack } from "react-icons/md";

// Tb (Tabler)
import { TbBrandCpp, TbBrandVscode } from "react-icons/tb";

export const fileIconMap = {
  js: <SiJavascript className="text-yellow-400" />,
  jsx: <FaReact className="text-blue-500" />,
  ts: <SiTypescript className="text-blue-500" />,
  tsx: <FaReact className="text-blue-500" />,
  py: <SiPython className="text-blue-600" />,
  java: <FaJava className="text-red-500" />,
  cpp: <TbBrandCpp className="text-blue-400" />,
  c: <SiCplusplus className="text-blue-400" />,
  cs: <TbBrandCSharp className="text-green-600" />,
  php: <SiPhp className="text-indigo-600" />,
  go: <SiGo className="text-blue-400" />,
  rs: <SiRust className="text-orange-500" />,
  kt: <SiKotlin className="text-orange-400" />,
  rb: <SiRuby className="text-pink-500" />,
  swift: <SiSwift className="text-orange-500" />,
  html: <SiHtml5 className="text-orange-600" />,
  css: <SiCss3 className="text-blue-600" />,
  json: <SiJson className="text-yellow-500" />,
  yaml: <SiYaml className="text-blue-500" />,
  yml: <SiYaml className="text-blue-500" />,
  md: <SiMarkdown className="text-gray-400" />,
  txt: <FaFileAlt className="text-gray-400" />,
  pdf: <VscFilePdf className="text-red-500" />,
  csv: <FaFileCsv className="text-green-600" />,
  doc: <FaFileWord className="text-blue-700" />,
  docx: <FaFileWord className="text-blue-700" />,
  xls: <FaFileExcel className="text-green-700" />,
  xlsx: <FaFileExcel className="text-green-700" />,
  ppt: <FaFilePowerpoint className="text-orange-600" />,
  pptx: <FaFilePowerpoint className="text-orange-600" />,
  mp4: <VscFileMedia className="text-pink-500" />,
  mp3: <MdAudiotrack className="text-purple-400" />,
  png: <MdImage className="text-cyan-500" />,
  jpg: <MdImage className="text-cyan-500" />,
  jpeg: <MdImage className="text-cyan-500" />,
  svg: <MdImage className="text-cyan-500" />,
  gif: <MdImage className="text-cyan-500" />,
  zip: <VscFileZip className="text-yellow-500" />,
  rar: <VscFileZip className="text-yellow-500" />,
  tar: <VscFileZip className="text-yellow-500" />,
  sql: <SiMysql className="text-blue-600" />,
  env: <VscFile className="text-green-500" />,
  gitignore: <SiGit className="text-red-600" />,
  dockerfile: <SiDocker className="text-blue-500" />,
  vscode: <TbBrandVscode className="text-indigo-500" />,
};
