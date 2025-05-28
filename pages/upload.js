
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file || !title) return setMessage('Title and file required');
    setLoading(true);
    setMessage('');

    const user = await supabase.auth.getUser();
    const filename = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('beats').upload(filename, file);

    if (error) {
      setMessage('Upload failed');
      setLoading(false);
      return;
    }

    const file_url = supabase.storage.from('beats').getPublicUrl(filename).data.publicUrl;

    await fetch('/api/fingerprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, file_url, user_id: user.data.user.id })
    });

    setMessage('Beat uploaded and fingerprinted');
    setLoading(false);
    setTitle('');
    setFile(null);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Beat</h1>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="file"
        accept="audio/*"
        onChange={e => setFile(e.target.files[0])}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
        onClick={handleUpload}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
    </div>
  );
}
