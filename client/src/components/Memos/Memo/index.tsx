import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { setRemovingMemo } from '../../../store/slices/memoSlice';
import { fetchSessionStorage, updateSessionStorage } from '../../../utils';
import { MemoType, deleteMemo, updateMemo } from '../utils';
import './index.css';

interface MemoPropsType {
  memo: MemoType
}

const memoPriority = ['high', 'medium', 'low'];

const Memo: FC<MemoPropsType> = ({ memo }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const dispatch = useDispatch();
  const memoTab = useSelector((state: RootState) => state.memo.memoTab);
  const highlightedMemoId = useSelector((state: RootState) => state.memo.highlightMemoId)

  const memoCardRef = useRef<HTMLSpanElement | null>(null);
  const memoNameRef = useRef<HTMLHeadingElement | null>(null);

  const priority: string = memoPriority[memo.priority - 1];

  const memoNameUpdateHandler = () => {
    const memoName = memoNameRef.current;
    if (!memoName) return;

    memoName.setAttribute('contenteditable', 'true');
    memoName.focus();
  };

  const updateMemoName = async () => {
    const memoName = memoNameRef.current;
    if (!memoName) return;

    memoName.setAttribute('contenteditable', 'false');

    if (memoName.innerText === memo.name) return;

    const updatedResponse: boolean = await updateMemo({ memoId: memo.id, name: memoName.innerText });
    if (!updatedResponse) {
      memoName.innerText = memo.name;
      return;
    }
  };

  const editMemoContent = () => {
    setIsEditing(true);
  };

  const removeMemo = async () => {
    const deleteResult: boolean = await deleteMemo(memo.id);
    if (!deleteResult) return;

    let memos: MemoType[];
    switch (memoTab) {
      case 'personal': {
        memos = fetchSessionStorage.memo.usersMemos();
        break;
      }
      case 'received': {
        memos = fetchSessionStorage.memo.receivedMemos();
        break;
      }
      case 'sent': {
        memos = fetchSessionStorage.memo.sentMemos();
        break;
      }
      default: {
        memos = [];
      }
    }
    if (!memos.length) return;

    const deleteIndex: number = memos.findIndex(autherMemo => autherMemo.id === memo.id);
    if (deleteIndex === -1) return;

    const adjustedMemos: MemoType[] = [...memos];
    adjustedMemos.splice(deleteIndex, 1);

    switch (memoTab) {
      case 'personal': {
        updateSessionStorage.memo.usersMemos(adjustedMemos);
        break;
      }
      case 'received': {
        updateSessionStorage.memo.receivedMemos(adjustedMemos);
        break;
      }
      case 'sent': {
        updateSessionStorage.memo.sentMemos(adjustedMemos);
        break;
      }
    }
    dispatch(setRemovingMemo(true));
  };

  useEffect(() => {
    if (memo.id !== highlightedMemoId || !memoCardRef.current) return;

    const memocard = memoCardRef.current;
    if (!memocard) return;

    memocard.scrollIntoView({ behavior: 'smooth', block: "center" });
    memocard.classList.add('highlighted');

    setTimeout(() => {
      memocard.classList.remove('highlighted');
    }, 1000);
  }, [memo, highlightedMemoId]);

  return (
    <span ref={ memoCardRef } className={`memo ${isEditing ? 'editing' : ''}`}>
      <span className={`memo-priority ${priority}`}>{ new Date(memo.updatedAt).toDateString()}
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon' onClick={ editMemoContent }>
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
        onBlur={ updateMemoName }
        onClick={ memoNameUpdateHandler }
        >{ memo.name }</h1>
      <span className='memo-content'>{ memo.content }</span>
    </span>
  );
};

export default Memo;
