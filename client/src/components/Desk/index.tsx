import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
// import { default as NotebookDesk} from '../Notebook/Desk';
import { default as MemosDesk} from '../Memos/Desk';
import './index.css';

const Desk: FC = () => {
  const tab = useSelector((state: RootState) => state.tab.tab);
  const [currentTab, setCurrentTab] = useState<string>(tab);

  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);
  
  return (
    <section className='desk'>
      {/* {
        currentTab === 'notebook' ? <NotebookDesk /> : null
      } */}
      {
        currentTab === 'memos' ? <MemosDesk /> : null
      }
    </section>
  );
};

export default Desk;
