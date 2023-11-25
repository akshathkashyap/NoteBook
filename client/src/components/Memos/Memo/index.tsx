import { FC } from 'react';
import { MemoType } from '../utils';
import './index.css';

interface MemoPropsType {
  memo: MemoType
}

const Memo: FC<MemoPropsType> = ({ memo }) => {
  return (
    <span key={ memo.id } className='memo'>
      <h1>{ memo.name }</h1>
    </span>
  );
};

export default Memo;
