import { FC , useRef, useEffect, useState } from 'react';
import Memo from '../Memo';
import { MemoType, sortMemosList, getRem } from '../utils';
import './index.css';

const tempMemos: MemoType[] = [
  {
      id: '655fc954f7331937ccb1022e',
      recipients: [],
      name: 'Final Memo',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:51:16.705Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655fbf4bf7331937ccb0fe00',
      recipients: [],
      name: 'Actually this one should',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:08:27.638Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655fbf3bf7331937ccb0fdf6',
      recipients: [],
      name: 'This should show up last',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:08:11.774Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655fbf1ef7331937ccb0fdea',
      recipients: [],
      name: 'Might delete this one later',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:07:42.803Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655fbf12f7331937ccb0fde2',
      recipients: [],
      name: 'This also a memo',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:07:30.507Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655fbf02f7331937ccb0fdda',
      recipients: [],
      name: 'This a memo',
      priority: 3,
      updatedAt: new Date('2023-11-23T21:07:14.253Z'),
      content: 'This is the content of the memo'
  },
  {
      id: '655c93eb0dc6ed41348311b5',
      recipients: [],
      name: 'This is the third memo',
      priority: 3,
      updatedAt: new Date('2023-11-21T11:53:13.621Z'),
      content: 'This is actually the content of the third memo'
  }
]

const Desk: FC = () => {
  const [numCols, setNumCols] = useState<number>(0);
  const [colsMemos, setColsMemos] = useState<MemoType[][]>([]);
  const [memos, setMemos] = useState<MemoType[]>(sortMemosList(tempMemos));
  const colsContainerRef = useRef<HTMLDivElement>(null);


  const updateNumCols = () => {
    const colsCont = colsContainerRef.current;
    if (!colsCont) return;

    const colsContWidthPx: number = colsCont.clientWidth;
    const remDiv: number = getRem();
    const colsContWidthRem: number = colsContWidthPx / remDiv;

    const fittableCols: number = Math.floor((colsContWidthRem) / 20);
    const newNumCols: number = colsContWidthRem >= ((20 * fittableCols) + (fittableCols - 1)) ?
      fittableCols :
      fittableCols - 1;

    if (newNumCols === 0) {
      setNumCols(1);
      return;
    }

    setNumCols(newNumCols);
  };

  useEffect(() => {
    const colsCont = colsContainerRef.current;
    if (!colsCont) return;

    const resizeObserver = new ResizeObserver(updateNumCols);
    resizeObserver.observe(colsCont);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!numCols || !memos.length) return;

    const newColsMemos: MemoType[][] = [];

    let colIndex: number = 0;
    let memoIndex: number = colIndex;

    while (colIndex < numCols) {
      if (colIndex === memoIndex) newColsMemos.push([]);;

      if (memoIndex >= memos.length) {
        colIndex++;
        memoIndex = colIndex;
        continue;
      }

      newColsMemos[colIndex].push(memos[memoIndex]);

      memoIndex += numCols;
    }

    setColsMemos(newColsMemos);
  }, [memos, numCols]);

  return (
    <section className='memos-desk'>
      <div ref={ colsContainerRef } className='cols-container' onResize={ updateNumCols }>
        {
          Array.from(Array(numCols)).map((_, index: number) => {
            return (
              <section key={`memoDeskCol${index}`} className='col'>
                {
                  colsMemos.length === numCols && colsMemos[index].map((memo: MemoType) => {
                    return (
                      <Memo memo={ memo } />
                    );
                  })
                }
              </section>
            );
          })
        }
      </div>
    </section>
  );
};

export default Desk;
