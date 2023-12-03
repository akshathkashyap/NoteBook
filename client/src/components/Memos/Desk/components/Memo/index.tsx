import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import events from '../../../events';
import { fetchSessionStorage, updateSessionStorage } from '../../../../../utils';
import { MemoType, deleteMemo, updateMemo } from '../../../utils';
import './index.css';

interface MemoPropsType {
  memo: MemoType
}

const memoPriorities = ['high', 'medium', 'low'];

const sessionStorage = {
  to: {
    personal: (memos: MemoType[]) => updateSessionStorage.memo.usersMemos(memos),
    received: (memos: MemoType[]) => updateSessionStorage.memo.receivedMemos(memos),
    sent: (memos: MemoType[]) => updateSessionStorage.memo.sentMemos(memos)
  },
  from: {
    personal: () => fetchSessionStorage.memo.usersMemos({ parse: true }) as MemoType[],
    received: () => fetchSessionStorage.memo.receivedMemos({ parse: true }) as MemoType[],
    sent: () => fetchSessionStorage.memo.sentMemos({ parse: true }) as MemoType[]
  }
};

const Memo: FC<MemoPropsType> = ({ memo }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const memoTab = useSelector((state: RootState) => state.memo.memoTab);

  const memoCardRef = useRef<HTMLSpanElement | null>(null);
  const memoNameRef = useRef<HTMLHeadingElement | null>(null);
  const [memoPriority, setMemoPriority] = useState<string>(memoPriorities[memo.priority - 1]);
  const [memoPriorityShouldSave, setMemoPriorityShouldSave] = useState<boolean>(false);

  const updateMemoName = async () => {
    const memoName = memoNameRef.current;
    if (!memoName) return;

    memoName.setAttribute('contenteditable', 'false');
    if (memoName.innerText.length > 46) {
      memoName.innerText = 'Limits are set for a reason :)';
      return;
    }

    if (memoName.innerText === memo.name) return;

    const updatedResponse: boolean = await updateMemo({ memoId: memo.id, name: memoName.innerText });
    if (!updatedResponse) {
      memoName.innerText = memo.name;
      return;
    }

    events.emit('memosUpdate', memo.id);
  };

  const updateMemoPriority = useCallback( async () => {
    const priority: number = memoPriorities.indexOf(memoPriority) + 1;
    if (priority <= 0) return;

    const updatedResponse: boolean = await updateMemo({ memoId: memo.id, priority });
    if (!updatedResponse) return;

    if (!memoTab) return;
    const memos: MemoType[] = sessionStorage.from[memoTab]();

    const memoIndex: number = memos.findIndex((m: MemoType) => m.id === memo.id);
    if (memoIndex < 0) return;

    memos[memoIndex].priority = priority;

    sessionStorage.to[memoTab](memos);

    events.emit('memosUpdate', memo.id);
  }, [memo, memoTab, memoPriority]);
  const updateMemoPriorityRef = useRef(updateMemoPriority);

  const removeMemo = async () => {
    const deleteResult: boolean = await deleteMemo(memo.id);
    if (!deleteResult) return;
    if (!memoTab) return;

    const memos: MemoType[] = sessionStorage.from[memoTab]();
    if (!memos.length) return;

    const deleteIndex: number = memos.findIndex(autherMemo => autherMemo.id === memo.id);
    if (deleteIndex === -1) return;

    const adjustedMemos: MemoType[] = [...memos];
    adjustedMemos.splice(deleteIndex, 1);

    sessionStorage.to[memoTab](adjustedMemos);
    events.emit('memosUpdate', memo.id);
  };

  const memoNameClickHandler = () => {
    const memoName = memoNameRef.current;
    if (!memoName) return;

    memoName.setAttribute('contenteditable', 'true');
    memoName.focus();
  };

  const memoPriorityClickHandler = () => {
    setMemoPriorityShouldSave(false);

    const priority: number = memoPriorities.indexOf(memoPriority);
    if (priority < 0) return;

    setMemoPriority(memoPriorities[(priority + 1) % 3]);
    setMemoPriorityShouldSave(true);
  };

  const memoContentClickHandler = () => {
    setIsEditing(true);
  };

  const memoNameKeyDownHandler = (event: React.KeyboardEvent) => {
    const memoName = memoNameRef.current;
    if (!memoName) return;
    const validKeys: string[] = [
      'Enter', 'Shift', 'CapsLock', 'Tab',
      'Control', 'ArrowLeft', 'ArrowUp', 'ArrowRight',
      'ArrowDown', 'Alt', 'Backspace', 'Delete'
    ]
    if (memoName.innerText.length >= 46) {
      if (!validKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

    if (event.key === 'Enter') updateMemoName();
  };

  useEffect(() => {
    const removeMemoHighlightEventListener = events.on('memoHighlight', (highlightedMemoId: string) => {
      if (memo.id !== highlightedMemoId || !memoCardRef.current) return;

      const memocard = memoCardRef.current;
      if (!memocard) return;
  
      memocard.scrollIntoView({ behavior: 'smooth', block: "center" });
      memocard.classList.add('highlighted');
  
      setTimeout(() => {
        memocard.classList.remove('highlighted');
      }, 1000);
    });

    return () => {
      removeMemoHighlightEventListener();
    };
  }, [memo]);

  useEffect(() => {
    const prioritySaveTimeout = setTimeout(() => {
      updateMemoPriorityRef.current();
    }, 1000);

    if (!memoPriorityShouldSave) clearTimeout(prioritySaveTimeout);

    return () => {
      clearTimeout(prioritySaveTimeout);
    };
  }, [memoPriorityShouldSave]);

  return (
    <span ref={ memoCardRef } className={`memo ${isEditing ? 'editing' : ''}`}>
      <span className={`memo-priority ${memoPriority}`}>{ new Date(memo.updatedAt).toDateString()}
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon' onClick={ memoPriorityClickHandler }>
            priority_high
          </span>
          <span className='material-symbols-outlined icon'>
            send
          </span>
          <span className='material-symbols-outlined icon' onClick={ memoContentClickHandler }>
            edit
          </span>
          <span className='material-symbols-outlined icon' onClick={ removeMemo }>
            delete
          </span>
        </span>
      </span>
      <h1
        ref={ memoNameRef }
        className='memo-name'
        suppressContentEditableWarning={ true }
        onBlur={ updateMemoName }
        onClick={ memoNameClickHandler }
        onKeyDown={ memoNameKeyDownHandler }
        >{ memo.name }</h1>
      <span className='memo-content'>{ memo.content }</span>
    </span>
  );
};

export default Memo;
