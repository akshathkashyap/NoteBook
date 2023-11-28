import { FC , useRef, useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { MemoType, sortMemosList, getRem, fetchDeskMemos } from '../utils';
import Memo from '../Memo';
import './index.css';
import { setRemovingMemo } from '../../../store/slices/memoSlice';

const Desk: FC = () => {
  const dispatch = useDispatch();
  const memoTab = useSelector((state: RootState) => state.memo.memoTab);
  const isRemovingMemo = useSelector((state: RootState) => state.memo.removingMemo);

  const deskMemosRef = useRef<MemoType[]>(fetchDeskMemos(memoTab));
  const sortedDeskMemosRef = useRef<MemoType[]>(sortMemosList(deskMemosRef.current, 'latest-last'));

  const [numCols, setNumCols] = useState<number>(1);
  const [colsMemos, setColsMemos] = useState<MemoType[][]>([]);
  const [memos, setMemos] = useState<MemoType[]>(sortedDeskMemosRef.current);
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

  useEffect(() => {
    if (!memoTab) return;
    
    deskMemosRef.current = fetchDeskMemos(memoTab);
    sortedDeskMemosRef.current = sortMemosList(deskMemosRef.current, 'latest-last');

    setMemos(sortedDeskMemosRef.current);
    
    const deskReloader = setInterval(() => {
      const updatedDeskMemos: MemoType[] = fetchDeskMemos(memoTab);
      const updatedDeskMemosString: string = JSON.stringify(updatedDeskMemos);
      const currentDeskMemosString: string = JSON.stringify(deskMemosRef.current);

      if (currentDeskMemosString === updatedDeskMemosString) return;

      deskMemosRef.current = updatedDeskMemos;
      sortedDeskMemosRef.current = sortMemosList(deskMemosRef.current, 'latest-last');
      
      setMemos(sortedDeskMemosRef.current);
    }, 5000);

    if (isRemovingMemo) dispatch(setRemovingMemo(false));

    return () => {
      clearInterval(deskReloader);
    };
  }, [dispatch, memoTab, isRemovingMemo]);

  return (
    <section className='memos-desk'>
      <div ref={ colsContainerRef } className='cols-container' onResize={ updateNumCols }>
        {
          memos.length ? Array.from(Array(numCols)).map((_, index: number) => {
            return (
              <section key={`memoDeskCol${index}`} className='col'>
                {
                  colsMemos.length === numCols && colsMemos[index].map((memo: MemoType) => {
                    return (
                      <Fragment key={ memo.id }>
                        <Memo memo={ memo } setMemo={ setMemos } />
                      </Fragment>
                    );
                  })
                }
              </section>
            );
          }) : (
            <span className='no-memos'>Nothing to show here...</span>
          )
        }
      </div>
    </section>
  );
};

export default Desk;
