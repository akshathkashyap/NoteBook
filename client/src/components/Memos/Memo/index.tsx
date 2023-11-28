import React, { FC } from 'react';
import MemoCard from './components/MemoCard';
import { MemoType } from '../utils';
import './index.css';

interface MemoPropsType {
  memo: MemoType
  setMemo: React.Dispatch<React.SetStateAction<MemoType[]>>
}

const Memo: FC<MemoPropsType> = ({ memo, setMemo }) => {
  return (
    <span className='memo'>
      <MemoCard memo={ memo }/>
    </span>
  );
};

export default Memo;
