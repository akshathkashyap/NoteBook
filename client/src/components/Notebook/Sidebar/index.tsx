import React, { FC, useEffect, useState } from 'react';
import { TopicType, createTopic, fetchAuthorTopics, deleteTopic } from './utils';
import './index.css';

const Sidebar: FC = () => {
  const [authorTopics, setAutherTopics] = useState<TopicType[]>([]);

  const updateTopics = async (): Promise<void> => {
    const topics: TopicType[] = await fetchAuthorTopics();
    setAutherTopics(topics);
  };

  const addTopic = async (): Promise<void> => {
    const topic: TopicType | null = await createTopic();
    if (!topic) return;

    const topics: TopicType[] = [...authorTopics];
    topics.push(topic);

    setAutherTopics(topics);
  };

  const removeTopic = async ( topicId: string ): Promise<void> => {
    const deleteResult: boolean = await deleteTopic(topicId);
    if (!deleteResult) return;

    const deleteIndex: number = authorTopics.findIndex(topic => topic.id === topicId);
    const topics: TopicType[] = [...authorTopics];
    topics.splice(deleteIndex, 1);

    setAutherTopics(topics);
  };

  const addPage = async (): Promise<void> => {
    console.log('creating a page');
  };

  const toggleDl = (event: React.MouseEvent) => {
    if (
      event.target.toString().includes('HTMLSpanElement') ||
      event.currentTarget.classList.contains('collapsed')
    ) {
      event.currentTarget.classList.replace('collapsed', 'expanded');
    } else if (
      !event.target.toString().includes('HTMLSpanElement') &&
      event.currentTarget.classList.contains('expanded')
    ) {
      event.currentTarget.classList.replace('expanded', 'collapsed');
    }
  };

  const pageSelectHandlder = (event: React.MouseEvent) => {
    const activePages: NodeListOf<Element> = document.querySelectorAll(
      'section.sidebar > div.sidebar-center-align > dl > dd.selected'
    );

    activePages.forEach((activePage: Element) => {
      activePage.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');
  };

  useEffect(() => {
    updateTopics();

    const sidebarReloader = setInterval(() => {
      updateTopics();
    }, 5000);

    return () => {
      clearInterval(sidebarReloader);
    };
  }, []);

  return (
    <>
      <h4>My Topics
        <span className='icon-spacer'>
          <span className='material-symbols-outlined icon' onClick={ addTopic }>
            docs_add_on
          </span>
        </span>
      </h4>
      {
        authorTopics.map((topic) => {
          return (
            <dl key={ topic.id }>
              <dt className='collapsed' onClick={ toggleDl }>{ topic.name }
                <span className='icon-spacer'>
                  <span className='material-symbols-outlined icon' onClick={ addPage }>
                    note_add
                  </span>
                  <span className='material-symbols-outlined icon' onClick={ () => removeTopic(topic.id) }>
                    delete
                  </span>
                </span>
              </dt>
              {
                topic.pages.map((pageId: string) => {
                  return (
                    <dd key={ pageId } onClick={ pageSelectHandlder }>{ pageId }</dd>
                  );
                })
              }
            </dl>
          );
        })
      }
      <span className='header-spacer'></span>
      <h4>Shared</h4>
      <dl draggable>
        <dt className='collapsed' onClick={ toggleDl }>Topic4</dt>
        <dd onClick={ pageSelectHandlder }>Page1</dd>
        <dd onClick={ pageSelectHandlder }>Page2</dd>
        <dd onClick={ pageSelectHandlder }>Page3</dd>
        <dd onClick={ pageSelectHandlder }>Page4</dd>
        <dd onClick={ pageSelectHandlder }>Page5</dd>
      </dl>
    </>
  );
};

export default Sidebar;
