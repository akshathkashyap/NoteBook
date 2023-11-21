import { FC } from 'react';
import './index.css';

const Sidebar: FC = () => {
  return (
    <>
      <h4>My Memos
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon'>
            note_stack_add
          </span>
        </span>
      </h4>
      <span className='header-spacer'></span>
      <h4>Sent</h4>
    </>
  );
};

export default Sidebar;
