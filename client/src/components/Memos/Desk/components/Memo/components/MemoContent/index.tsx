import { FC, useEffect, useState } from 'react';
import { FloatingMenu, BubbleMenu, Content, Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight';
import events from '../../../../../events';
import './index.css';
import { updateMemo } from '../../../../../utils';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

interface MemoContentPropsType {
  memoId: string;
  content: string;
}

interface EditorMenuPropsType {
  editor: Editor | null;
};

const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  TaskList,
  TaskItem,
];

const EditorMenu: FC<EditorMenuPropsType> = ({ editor }: EditorMenuPropsType) => {
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
        editor.chain().focus().toggleTaskList().run();
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
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
        className={`material-symbols-outlined menu-item ${editor.isActive('taskList') ? 'active' : ''}`}
        onClick={ handleMenuClick }
      >
        checklist
      </span>
    </section>
  );
};

const MemoContent: FC<MemoContentPropsType> = ({ memoId, content }: MemoContentPropsType) => {
  const editor = useEditor({
    extensions,
    content: JSON.parse(content) as Content,
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);

  useEffect(() => {
    if (!editor) return;

    editor.on('focus', () => {
      setIsEditing(true);
    });

    editor.on('blur', () => {
      setIsEditing(false);
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    if (isEditing) return;

    const memoUpdateTimeout = setTimeout(async () => {
      if (content === JSON.stringify(editor.getJSON())) return;

      const isUpdated: boolean = await updateMemo({ memoId, content: JSON.stringify(editor.getJSON()) });
      if (!isUpdated) return;

      events.emit('memosUpdate', memoId);
    }, 1000);

    return () => {
      clearTimeout(memoUpdateTimeout);
    }
  }, [content, editor, isEditing, memoId]);

  return (
    <span className='tiptap-container'>
      <EditorContent editor={ editor }></EditorContent>
      <FloatingMenu editor={ editor ?? undefined }>{ <EditorMenu editor={ editor } /> }</FloatingMenu>
      <BubbleMenu editor={ editor ?? undefined }>{ <EditorMenu editor={ editor } /> }</BubbleMenu>
    </span>
  );
};

export default MemoContent;
