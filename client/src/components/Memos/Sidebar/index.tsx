import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMemoTab, setHighlightMemoId, setAddingMemo, setRemovingMemo } from '../../../store/slices/memoSlice';
import { RootState } from '../../../store/rootReducer';
import { MemoType, sortMemosList, fetchAuthorMemos, fetchAuthorsReceivedMemos } from '../utils';
import { updateSessionStorage, fetchSessionStorage } from '../../../utils';
import './index.css';

const Sidebar: FC = () => {
  const dispatch = useDispatch();
  const memoTab = useSelector((state: RootState) => state.memo.memoTab);
  const addingMemo = useSelector((state: RootState) => state.memo.addingMemo);
  const isRemovingMemo = useSelector((state: RootState) => state.memo.removingMemo);

  const usersMemos: MemoType[] = fetchSessionStorage.memo.usersMemos();
  const receivedMemos: MemoType[] = fetchSessionStorage.memo.receivedMemos();
  const sentMemos: MemoType[] = fetchSessionStorage.memo.sentMemos();

  const recentUsersMemos: MemoType[] = sortMemosList(usersMemos, 'latest-first', 5);
  const recentReceivedMemos: MemoType[] = sortMemosList(receivedMemos, 'latest-first', 5);
  const recentSentMemos: MemoType[] = sortMemosList(sentMemos, 'latest-first', 5);

  const [authorMemos, setAutherMemos] = useState<MemoType[]>(recentUsersMemos);
  const [authorReceivedMemos, setAutherReceivedMemos] = useState<MemoType[]>(recentReceivedMemos);
  const [authorSentMemos, setAutherSentMemos] = useState<MemoType[]>(recentSentMemos);

  const addMemo = (event: React.MouseEvent) => {
    const target = event.currentTarget;
    target.classList.add('adding');
    dispatch(setAddingMemo(true));
  };

  const updateUsersMemos = async (): Promise<void> => {
    const memos: MemoType[] = await fetchAuthorMemos();
    let personal: MemoType[] = [];
    let sent: MemoType[] = [];

    memos.forEach((memo: MemoType) => {
      if (!memo.recipients.length) {
        personal.push(memo);
        return;
      }
      sent.push(memo);
    });

    updateSessionStorage.memo.usersMemos(personal);
    updateSessionStorage.memo.sentMemos(sent);

    personal = sortMemosList(personal, 'latest-first', 5);
    sent = sortMemosList(sent, 'latest-first', 5);

    setAutherMemos(personal);
    setAutherSentMemos(sent);
  };

  const updateReceivedMemos = async (): Promise<void> => {
    let received: MemoType[] = await fetchAuthorsReceivedMemos();
    updateSessionStorage.memo.receivedMemos(received);

    received = sortMemosList(received, 'latest-first', 5);
    setAutherReceivedMemos(received);
  };

  const handleMemoTabSelection = (tab: string) => {
    if (!tab) return;

    if (tab === 'My Memos') {
      dispatch(setMemoTab('personal'));
    } else if (tab === 'Received') {
      dispatch(setMemoTab('received'));
    } else if (tab === 'Sent') {
      dispatch(setMemoTab('sent'));
    }
  };

  const handleMemoHighlight = (memoId: string, tab: string) => {
    handleMemoTabSelection(tab)
    dispatch(setHighlightMemoId(memoId));
    
    setTimeout(() => {
      dispatch(setHighlightMemoId(null));
    }, 250);
  };

  useEffect(() => {
    updateUsersMemos();
    updateReceivedMemos();

    const sidebarReloader = setInterval(() => {
      updateUsersMemos();
      updateReceivedMemos();
    }, 5000);

    return () => {
      clearInterval(sidebarReloader);
    };
  }, []);

  useEffect(() => {
    updateUsersMemos();
    updateReceivedMemos();

    if (isRemovingMemo) dispatch(setRemovingMemo(false));
  }, [dispatch, isRemovingMemo]);

  return (
    <>
      <h4
        className={`memo-tab ${memoTab === 'personal' ? 'selected' : ''}`}
        onClick={() => handleMemoTabSelection ('My Memos')}
      >My Memos
        <span className='icon-spacer'>
          <span className={`material-symbols-outlined icon ${addingMemo ? 'adding': ''}`} onClick={ addMemo }>
            note_stack_add
          </span>
        </span>
      </h4>
      {
        authorMemos.length ? (
          <ul className='memo-list'>
            {
              authorMemos.map((memo) => {
                return (
                  <li
                    key={ memo.id }
                    className='memo'
                    onClick={() => handleMemoHighlight(memo.id, 'My Memos')}
                  >{ memo.name }</li>
                );
              })
            }
          </ul>
        ) : (
          <p className='note'>No memos...</p>
        )
      }
      <span className='header-spacer'></span>
      <h4
        className={`memo-tab ${memoTab === 'received' ? 'selected' : ''}`}
        onClick={() => handleMemoTabSelection ('Received')}
      >Received
      </h4>
      {
        authorReceivedMemos.length ? (
          <ul className='memo-list'>
            {
              authorReceivedMemos.map((memo) => {
                return (
                  <li
                    key={ memo.id }
                    className='memo'
                    onClick={() => handleMemoHighlight(memo.id, 'Received')}
                  >{ memo.name }</li>
                );
              })
            }
          </ul>
        ) : (
          <p className='note'>No memos...</p>
        )
      }
      <span className='header-spacer'></span>
      <h4
        className={`memo-tab ${memoTab === 'sent' ? 'selected' : ''}`}
        onClick={() => handleMemoTabSelection ('Sent')}
      >Sent
      </h4>
      {
        authorSentMemos.length ? (
          <ul className='memo-list'>
            {
              authorSentMemos.map((memo) => {
                return (
                  <li
                    key={ memo.id }
                    className='memo'
                    onClick={() => handleMemoHighlight(memo.id, 'Sent')}
                  >{ memo.name }</li>
                );
              })
            }
          </ul>
        ) : (
          <p className='note'>No memos...</p>
        )
      }
    </>
  );
};

export default Sidebar;
