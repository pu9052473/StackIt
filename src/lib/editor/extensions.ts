import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Emoji from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'

export const editorExtensions = [
  StarterKit,
  Underline,
  Link.configure({
    openOnClick: true,
  }),
  Image,
  Emoji,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]
