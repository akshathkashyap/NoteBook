import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { setRemovingMemo } from '../../../../../store/slices/memoSlice';
import { MemoType, deleteMemo } from '../../../utils';
import './index.css';
import { fetchSessionStorage, updateSessionStorage } from '../../../../../utils';

interface MemoPropsType {
  memo: MemoType
}

const memoPriority = ['high', 'medium', 'low'];

const Memo: FC<MemoPropsType> = ({ memo }) => {
  const dispatch = useDispatch();
  const memoTab = useSelector((state: RootState) => state.memo.memoTab);
  const highlightedMemoId = useSelector((state: RootState) => state.memo.highlightMemoId)

  const memoCardRef = useRef<HTMLElement | null>(null);

  const priority: string = memoPriority[memo.priority - 1];

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

    const memocard = memoCardRef.current.parentElement;
    if (!memocard) return;

    memocard.scrollIntoView({ behavior: 'smooth', block: "center" });
    memocard.classList.add('highlighted');

    setTimeout(() => {
      memocard.classList.remove('highlighted');
    }, 1000);
  }, [memo, highlightedMemoId]);

  return (
    <section ref={ memoCardRef } className='memo-card'>
      <h1 className='memo-name'>{ memo.name }</h1>
      <span className='memo-content'>{ memo.content }</span>
      <span className={`memo-priority ${priority}`}>{ new Date(memo.updatedAt).toDateString()}
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon'>
            edit
          </span>
          <span className='material-symbols-outlined icon' onClick={ removeMemo }>
            delete
          </span>
        </span>
      </span>
    </section>
  );
};

export default Memo;