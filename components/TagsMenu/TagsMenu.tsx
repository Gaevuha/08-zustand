'use client';

import Link from 'next/link';
import { useState } from 'react';
import css from './TagsMenu.module.css';

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tags = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={css.menuContainer}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={css.menuButton}
      >
        Notes ▾
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {tags.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink}
                onClick={handleLinkClick}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
