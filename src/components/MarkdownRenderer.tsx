import { useNoteContext } from '@/context/NoteContext'
import React from 'react'
import { FaCopy } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

interface Props {
  content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const { setNotification } = useNoteContext()
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setNotification('Code copied to clipboard!')
    })
  }

  const renderers: {
    [key: string]: React.FC<{
      node: React.ReactNode
      inline?: boolean
      className?: string
      children?: React.ReactNode
      href?: string
    }>
  } = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const code = String(children).replace(/\n$/, '')
      return !inline && match ? (
        <div className='relative'>
          <code>{code}</code>
          <button
            onClick={() => handleCopy(code)}
            className='copy-button absolute right-2 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300 hover:bg-blue-700'
          >
            <FaCopy className='inline-block' />
          </button>
        </div>
      ) : (
        <code className={`${className} p-4 rounded`} {...props}>
          {code}
        </code>
      )
    },
    a: ({ href, children }) => {
      return (
        <a href={href} target='_blank' rel='noopener noreferrer'>
          {children}
        </a>
      )
    }
  }

  return (
    <ReactMarkdown
      className='note-content mt-2 prose prose-lg max-w-none p-2'
      components={renderers}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
