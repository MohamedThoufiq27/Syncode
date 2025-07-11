import { useState } from 'react';
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
  SiGo,
  SiPhp,
  SiRust,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const langArray = [
  { id: 'javascript', icon: <SiJavascript className="text-yellow-400 w-6 h-6" />, label: 'JavaScript' },
  { id: 'typescript', icon: <SiTypescript className="text-blue-600 w-6 h-6" />, label: 'TypeScript' },
  { id: 'python', icon: <SiPython className="text-blue-400 w-6 h-6" />, label: 'Python' },
  { id: 'java', icon: <FaJava className="text-red-600 w-6 h-6" />, label: 'Java' },
  { id: 'cpp', icon: <SiCplusplus className="text-blue-500 w-6 h-6" />, label: 'C++' },
  { id: 'html', icon: <SiHtml5 className="text-orange-500 w-6 h-6" />, label: 'HTML' },
  { id: 'css', icon: <SiCss3 className="text-blue-400 w-6 h-6" />, label: 'CSS' },
  { id: 'json', icon: <SiJson className="text-green-400 w-6 h-6" />, label: 'JSON' },
  { id: 'markdown', icon: <SiMarkdown className="text-blue-400 w-6 h-6" />, label: 'Markdown' },
  { id: 'go', icon: <SiGo className="text-sky-400 w-6 h-6" />, label: 'Go' },
  { id: 'php', icon: <SiPhp className="text-indigo-400 w-6 h-6" />, label: 'PHP' },
  { id: 'rust', icon: <SiRust className="text-orange-700 w-6 h-6" />, label: 'Rust' },
];

const Dropdown = ({ language, onLanguageChange }) => {
  const [open, setOpen] = useState(false);
  const selected = langArray.find((lang) => lang.id === language);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex justify-between items-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <span className="flex items-center gap-2">
            {selected?.icon}
            {/* {selected?.label} */}
          </span>
          <ChevronDownIcon className="w-3 h-3 ml-1" />
        </button>
      </div>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute mt-2 max-h-80 overflow-y-auto w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="p-1">
            {langArray.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onLanguageChange(lang.id);
                  setOpen(false);
                  toast.success(`${lang.label} Selected Successfully!`);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
              >
                {lang.icon}
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
