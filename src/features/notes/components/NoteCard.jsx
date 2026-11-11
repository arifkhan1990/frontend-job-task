import { CalendarDays, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import { formatDate, formatRelativeDate } from '../../../utils/date.js';

export function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="ui-note-card">
      <div className="ui-note-card__head">
        <span className="ui-note-card__icon" aria-hidden="true">
          <NotebookPen size={17} />
        </span>
        <div className="ui-note-card__heading">
          <h2 title={note.title}>{note.title}</h2>
          <span className="ui-note-card__label">Private note</span>
        </div>
      </div>

      <p className="ui-note-card__content">{note.content}</p>

      <div className="ui-note-card__meta">
        <time
          className="ui-note-card__date"
          dateTime={note.createdAt}
          title={formatDate(note.createdAt)}
        >
          <CalendarDays size={14} aria-hidden="true" />
          {formatRelativeDate(note.createdAt)}
        </time>

        <div className="ui-note-card__actions">
          <button
            type="button"
            className="ui-note-action"
            onClick={() => onEdit(note)}
            aria-label={`Edit ${note.title}`}
            title="Edit note"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ui-note-action ui-note-action--danger"
            onClick={() => onDelete(note)}
            aria-label={`Delete ${note.title}`}
            title="Delete note"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
