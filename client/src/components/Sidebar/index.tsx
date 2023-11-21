import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { default as NotebookSidebar} from '../Notebook/Sidebar';
import { default as MemosSidebar} from '../Memos/Sidebar';
import './index.css';

const Sidebar: FC = () => {
  const tab = useSelector((state: RootState) => state.tab.tab);
  const [currentTab, setCurrentTab] = useState<string>(tab);

  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);
  
  return (
    <section className='sidebar'>
      <div className='sidebar-center-align'>
        {
          currentTab === 'notebook' ? <NotebookSidebar /> : null
        }
        {
          currentTab === 'memos' ? <MemosSidebar /> : null
        }
      </div>
    </section>
  );
};

export default Sidebar;
