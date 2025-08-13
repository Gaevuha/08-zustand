'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import css from './NoteForm.module.css';
import { useNoteStore, initialDraft } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api';
import type { NewNoteData } from '@/types/note';
import type { ISchema } from 'yup';

interface Props {
  categories?: string[];
}

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  content: yup
    .string()
    .required('Content is required')
    .max(500, 'Content is too long'),
  tag: yup.string().required('Tag is required'),
});

export default function NoteForm({ categories }: Props) {
  const router = useRouter();
  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const [formData, setFormData] = useState<NewNoteData>(draft || initialDraft);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewNoteData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(draft || initialDraft);
  }, [draft]);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setDraft(updated);

    try {
      const fieldSchema = yup.reach(schema, name) as ISchema<unknown>;
      await fieldSchema.validate(value);
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await schema.validate(formData, { abortEarly: false });
      await createNote(formData);
      clearDraft();

      if (typeof window !== 'undefined') {
        iziToast.success({
          title: 'Success',
          message: 'Note created successfully!',
          position: 'topRight',
        });
      }

      router.back();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof NewNoteData, string>> = {};
        err.inner.forEach(e => {
          if (e.path) fieldErrors[e.path as keyof NewNoteData] = e.message;
        });
        setErrors(fieldErrors);
      } else if (err instanceof Error && typeof window !== 'undefined') {
        iziToast.error({
          title: 'Error',
          message: err.message,
          position: 'topRight',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.title && <p className={css.error}>{errors.title}</p>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          placeholder="Enter content"
          value={formData.content}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.content && <p className={css.error}>{errors.content}</p>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formData.tag}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="">Select a tag</option>
          {categories?.length
            ? categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            : ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
        </select>
        {errors.tag && <p className={css.error}>{errors.tag}</p>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
