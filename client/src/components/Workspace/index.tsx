import { FC, useEffect, useRef } from 'react';
import Sidebar from '../Sidebar';
import './index.css';

const Workspace: FC = () => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const deskRef = useRef<HTMLElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  const handleWindowResize:EventListener = () => {
    const sidebar = sidebarRef.current;
    const desk = deskRef.current;
    if (!sidebar || !desk) return;

    desk.style.width = `${window.innerWidth - sidebar.clientWidth - 10}px`;
  };

  const handleMouseResize = (event: MouseEvent) => {
    const sidebar = sidebarRef.current;
    const desk = deskRef.current;
    const divider = dividerRef.current;

    if (!sidebar || !desk || !divider) return;

    sidebar.style.width = `${event.clientX}px`;
    desk.style.width = `${window.innerWidth - sidebar.clientWidth - 10}px`;
  };

  const clearEvents = () => {
    const divider = dividerRef.current;
    if (!divider) return;
    
    document.removeEventListener('mousemove', handleMouseResize);
    document.removeEventListener('mouseup', clearEvents);
  };

  const setDividerPos = () => {
    const divider = dividerRef.current;
    if (!divider) return;

    document.addEventListener('mousemove', handleMouseResize);
    document.addEventListener('mouseup', clearEvents)
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <section className='workspace'>
      <section ref={ sidebarRef } id='sidebar'>
        <Sidebar />
      </section>
      <div
        ref={ dividerRef }
        id='workspaceDivider'
        onMouseDown={ setDividerPos }
      ></div>
      <section ref={ deskRef } id='desk'></section>
    </section>
  );
};

export default Workspace;
