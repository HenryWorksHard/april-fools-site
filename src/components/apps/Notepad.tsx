'use client'

interface NotepadProps {
  content: string
}

export function Notepad({ content }: NotepadProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar */}
      <div className="flex items-center bg-[#ece9d8] border-b border-[#848484] px-1 py-0.5 text-sm">
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">File</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Edit</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Format</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">View</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Help</button>
      </div>

      {/* Text Area */}
      <div className="flex-1 overflow-auto bg-white">
        <pre className="p-2 font-mono text-sm whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  )
}
