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

  const containsLineBreak = (children: React.ReactNode): boolean => {
    if (typeof children === 'string') {
      return /\r|\n/.test(children)
    }
    if (Array.isArray(children)) {
      return children.some(child => containsLineBreak(child))
    }
    return false
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
    code: ({ node, className, children, ...props }) => {
      const hasLineBreak = containsLineBreak(children)
      const code = String(children).replace(/\n$/, '')
      return hasLineBreak ? (
        <div className='relative'>
          <code>{code}</code>
          <button
            onClick={() => handleCopy(code)}
            className='copy-button absolute right-2 px-2 text-white rounded cursor-pointer transition-colors duration-300 hover:bg-gray-700'
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
      className='note-content mt-2 prose max-w-none p-2'
      components={renderers}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
