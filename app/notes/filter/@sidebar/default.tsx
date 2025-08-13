// app/notes/filter/@sidebar/default.tsx

import css from './SidebarNotes.module.css';
import Link from 'next/link';

const STATIC_TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const NotesSidebar = () => {
  return (
    <div>
      <ul className={css.menuList}>
        {STATIC_TAGS.map(tag => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              className={css.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesSidebar;
