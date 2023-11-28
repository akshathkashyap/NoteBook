import React, { FC } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight';
import { MemoType } from '../../../utils';
import './index.css';

interface MemoPropsType {
  memo: MemoType
  setEditState: React.Dispatch<React.SetStateAction<boolean>>
}

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

const MemoEditor: FC<MemoPropsType> = ({ memo, setEditState }) => {
  const extensions = [
    StarterKit,
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
  
  const editor: Editor | null = useEditor({
    extensions,
    content: memo.content,
  });
  if (!editor) return null;

  const handleMenuClick = (event: React.MouseEvent) => {
    const menuItem: string = event.currentTarget.innerHTML;

    switch (menuItem) {
      case 'format_h1': {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      }
      case 'format_h2': {
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      }
      case 'format_bold': {
        editor.chain().focus().toggleBold().run();
        break;
      }
      case 'format_italic': {
        editor.chain().focus().toggleItalic().run();
        break;
      }
      case 'format_strikethrough': {
        editor.chain().focus().toggleStrike().run();
        break;
      }
      case 'format_quote': {
        editor.chain().focus().toggleBlockquote().run();
        break;
      }
      case 'code': {
        editor.chain().focus().toggleCodeBlock().run();
        break;
      }
      case 'format_list_bulleted': {
        editor.chain().focus().toggleBulletList().run();
        break;
      }
      case 'format_list_numbered': {
        editor.chain().focus().toggleOrderedList().run();
        break;
      }
      case 'checklist': {
        editor.chain().focus().toggleOrderedList().run();
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <>
      <section className='memo-menu'>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_h1
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_h2
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('bold') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_bold
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('italic') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_italic
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('strikethrough') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_strikethrough
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('blockquote') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_quote
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('codeBlock') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          code
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('bulletList') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_list_bulleted
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('orderedList') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          format_list_numbered
        </span>
        <span
          className={`material-symbols-outlined menu-item ${editor.isActive('orderedList') ? 'active' : ''}`}
          onClick={ handleMenuClick }
        >
          checklist
        </span>
      </section>
      <EditorContent editor={ editor } />
    </>
  );
};

export default MemoEditor;
