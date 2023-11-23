import { FC, useEffect, useState } from 'react';
import { MemoType, fetchAuthorMemos, fetchAuthorsReceivedMemos } from './utils';
import './index.css';

const Sidebar: FC = () => {
  const [authorMemos, setAutherMemos] = useState<MemoType[]>([]);
  const [authorReceivedMemos, setAutherReceivedMemos] = useState<MemoType[]>([]);
  const [authorSentMemos, setAutherSentMemos] = useState<MemoType[]>([]);

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
    const personal: MemoType[] = [];
    const sent: MemoType[] = [];

    memos.forEach((memo: MemoType) => {
      if (!memo.recipients.length) {
        personal.push(memo);
        return;
      }
      sent.push(memo);
    });

    setAutherMemos(personal);
    setAutherSentMemos(sent);
  };

  const updateReceivedMemos = async (): Promise<void> => {
    const received: MemoType[] = await fetchAuthorsReceivedMemos();
    setAutherReceivedMemos(received);
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
      <h4>My Memos
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
      <h4>Received</h4>
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
      <h4>Sent</h4>
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
