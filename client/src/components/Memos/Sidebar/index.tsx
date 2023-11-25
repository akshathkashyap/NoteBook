import { FC, useEffect, useState } from 'react';
import { MemoType, sortMemosList, fetchAuthorMemos, fetchAuthorsReceivedMemos } from '../utils';
import { updateSessionStorage, fetchSessionStorage } from '../../../utils';
import './index.css';

const Sidebar: FC = () => {
  const usersMemos: MemoType[] = fetchSessionStorage.memo.usersMemos();
  const receivedMemos: MemoType[] = fetchSessionStorage.memo.receivedMemos();
  const sentMemos: MemoType[] = fetchSessionStorage.memo.sentMemos();

  const recentUsersMemos: MemoType[] = sortMemosList(usersMemos, 5);
  const recentReceivedMemos: MemoType[] = sortMemosList(receivedMemos, 5);
  const recentSentMemos: MemoType[] = sortMemosList(sentMemos, 5);

  const [authorMemos, setAutherMemos] = useState<MemoType[]>(recentUsersMemos);
  const [authorReceivedMemos, setAutherReceivedMemos] = useState<MemoType[]>(recentReceivedMemos);
  const [authorSentMemos, setAutherSentMemos] = useState<MemoType[]>(recentSentMemos);

  const addMemo = (event: React.MouseEvent) => {
    console.log('adding')
    const target = event.currentTarget;
    target.classList.add('adding');
    setTimeout(() => {
      target.classList.remove('adding')
    }, 5000)
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

    personal = sortMemosList(personal, 5);
    sent = sortMemosList(sent, 5);

    setAutherMemos(personal);
    setAutherSentMemos(sent);
  };

  const updateReceivedMemos = async (): Promise<void> => {
    let received: MemoType[] = await fetchAuthorsReceivedMemos();
    updateSessionStorage.memo.receivedMemos(received);

    received = sortMemosList(received, 5);
    setAutherReceivedMemos(received);
  };

  const handleMemoTabSelection = (event: React.MouseEvent) => {
    const memoTabs: NodeListOf<Element> = document.querySelectorAll(
      'section.sidebar > div.sidebar-center-align > h4.memo-tab.selected'
    );
    memoTabs.forEach((memoTab: Element) => {
      memoTab.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
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

  return (
    <>
      <h4 className='memo-tab' onClick={ handleMemoTabSelection }>My Memos
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon' onClick={ addMemo }>
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
                  <li key={ memo.id } className='memo'>{ memo.name }</li>
                );
              })
            }
          </ul>
        ) : (
          <p className='note'>No memos...</p>
        )
      }
      <span className='header-spacer'></span>
      <h4 className='memo-tab' onClick={ handleMemoTabSelection }>Received</h4>
      {
        authorReceivedMemos.length ? (
          <ul className='memo-list'>
            {
              authorReceivedMemos.map((memo) => {
                return (
                  <li key={ memo.id } className='memo'>{ memo.name }</li>
                );
              })
            }
          </ul>
        ) : (
          <p className='note'>No memos...</p>
        )
      }
      <span className='header-spacer'></span>
      <h4 className='memo-tab' onClick={ handleMemoTabSelection }>Sent</h4>
      {
        authorSentMemos.length ? (
          <ul className='memo-list'>
            {
              authorSentMemos.map((memo) => {
                return (
                  <li key={ memo.id } className='memo'>{ memo.name }</li>
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
