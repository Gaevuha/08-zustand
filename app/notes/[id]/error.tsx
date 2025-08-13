'use client';

type Props = {
  error: Error;
};

export default function Error({ error }: Props) {
  console.error('Error object:', error);

  return (
    <div className="center">
      <p className="error">
        Could not fetch the list of notes. {error.message}
      </p>
    </div>
  );
}
