import { useRef, useEffect, useCallback, forwardRef, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link,
  Unlink,
  Code,
} from 'lucide-react'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  error?: boolean
  disabled?: boolean
  className?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  title: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, title, active, disabled, children }: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => {
      e.preventDefault()
      onClick()
    }}
    className={`
      p-1.5 rounded transition-all duration-150 flex items-center justify-center
      ${active
        ? 'bg-brand-500 text-white shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {children}
  </button>
)

const Divider = () => (
  <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-0.5 self-center" />
)

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder = 'Enter content...', rows = 10, error, disabled, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
    const [isFocused, setIsFocused] = useState(false)
    const isInternalChange = useRef(false)

    // Sync external value → editor (only if different, to avoid cursor reset)
    useEffect(() => {
      const el = editorRef.current
      if (!el || isInternalChange.current) return
      if (el.innerHTML !== (value ?? '')) {
        el.innerHTML = value ?? ''
      }
    }, [value])

    // Update active format states on selection change
    const updateActiveFormats = useCallback(() => {
      const formats = new Set<string>()
      const checks = ['bold', 'italic', 'underline', 'strikeThrough', 'insertOrderedList', 'insertUnorderedList']
      checks.forEach((cmd) => {
        try {
          if (document.queryCommandState(cmd)) formats.add(cmd)
        // eslint-disable-next-line no-empty
        } catch {}
      })
      setActiveFormats(formats)
    }, [])

    useEffect(() => {
      document.addEventListener('selectionchange', updateActiveFormats)
      return () => document.removeEventListener('selectionchange', updateActiveFormats)
    }, [updateActiveFormats])

    const exec = useCallback((command: string, value?: string) => {
      if (disabled) return
      editorRef.current?.focus()
      document.execCommand(command, false, value)
      updateActiveFormats()
      // Trigger onChange after exec
      const el = editorRef.current
      if (el && onChange) {
        isInternalChange.current = true
        onChange(el.innerHTML)
        setTimeout(() => { isInternalChange.current = false }, 0)
      }
    }, [disabled, onChange, updateActiveFormats])

    const handleInput = useCallback(() => {
      const el = editorRef.current
      if (!el || !onChange) return
      isInternalChange.current = true
      onChange(el.innerHTML)
      setTimeout(() => { isInternalChange.current = false }, 0)
    }, [onChange])

    const handleLinkInsert = useCallback(() => {
      const url = window.prompt('Enter URL:', 'https://')
      if (url) exec('createLink', url)
    }, [exec])

    // Approximate min height from rows
    const minHeight = `${rows * 1.6}rem`

    return (
      <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        error
          ? 'border-red-400 dark:border-red-500'
          : isFocused
            ? 'border-brand-500 ring-3 ring-brand-500/20'
            : 'border-gray-300 dark:border-gray-700'
      } ${disabled ? 'opacity-60' : ''} ${className ?? ''}`}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">

          {/* Undo / Redo */}
          <ToolbarButton onClick={() => exec('undo')} title="Undo" disabled={disabled}>
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('redo')} title="Redo" disabled={disabled}>
            <Redo size={15} />
          </ToolbarButton>

          <Divider />

          {/* Headings */}
          <ToolbarButton onClick={() => exec('formatBlock', '<h1>')} title="Heading 1" disabled={disabled}>
            <Heading1 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('formatBlock', '<h2>')} title="Heading 2" disabled={disabled}>
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('formatBlock', '<h3>')} title="Heading 3" disabled={disabled}>
            <Heading3 size={15} />
          </ToolbarButton>

          <Divider />

          {/* Text Formatting */}
          <ToolbarButton onClick={() => exec('bold')} title="Bold" active={activeFormats.has('bold')} disabled={disabled}>
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('italic')} title="Italic" active={activeFormats.has('italic')} disabled={disabled}>
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('underline')} title="Underline" active={activeFormats.has('underline')} disabled={disabled}>
            <Underline size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('strikeThrough')} title="Strikethrough" active={activeFormats.has('strikeThrough')} disabled={disabled}>
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('formatBlock', '<pre>')} title="Code Block" disabled={disabled}>
            <Code size={15} />
          </ToolbarButton>

          <Divider />

          {/* Alignment */}
          <ToolbarButton onClick={() => exec('justifyLeft')} title="Align Left" disabled={disabled}>
            <AlignLeft size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('justifyCenter')} title="Align Center" disabled={disabled}>
            <AlignCenter size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('justifyRight')} title="Align Right" disabled={disabled}>
            <AlignRight size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('justifyFull')} title="Justify" disabled={disabled}>
            <AlignJustify size={15} />
          </ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => exec('insertUnorderedList')}
            title="Bullet List"
            active={activeFormats.has('insertUnorderedList')}
            disabled={disabled}
          >
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => exec('insertOrderedList')}
            title="Numbered List"
            active={activeFormats.has('insertOrderedList')}
            disabled={disabled}
          >
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('formatBlock', '<blockquote>')} title="Blockquote" disabled={disabled}>
            <Quote size={15} />
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <ToolbarButton onClick={handleLinkInsert} title="Insert Link" disabled={disabled}>
            <Link size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('unlink')} title="Remove Link" disabled={disabled}>
            <Unlink size={15} />
          </ToolbarButton>
        </div>

        {/* Editable Area */}
        <div className="relative bg-white dark:bg-gray-900">
          {/* Placeholder */}
          {!value && !isFocused && (
            <div
              className="absolute top-3 left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none text-sm select-none"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}

          <div
            ref={(node) => {
              // Merge forwarded ref + internal ref
              editorRef.current = node!
              if (typeof ref === 'function') ref(node)
              else if (ref) ref.current = node
            }}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ minHeight }}
            className={`
              px-3.5 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none
              leading-relaxed
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-1
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-1
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-1
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5
              [&_li]:my-0.5
              [&_blockquote]:border-l-4 [&_blockquote]:border-brand-400 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-gray-500 [&_blockquote]:italic
              [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-800 [&_pre]:rounded [&_pre]:p-2 [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
              [&_a]:text-brand-500 [&_a]:underline [&_a]:cursor-pointer
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          />
        </div>
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor