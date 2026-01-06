'use client';

import { useEffect, useRef, memo } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function RichTextEditor({
  value,
  onChange,
  placeholder = 'İçeriğinizi yazın...'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    let quill: any = null;

    // Dynamically import Quill
    const initQuill = async () => {
      const Quill = await import('quill');

      if (!editorRef.current) return;

      // Force cleanup any existing Quill instances
      const existingToolbar = editorRef.current.querySelector('.ql-toolbar');
      const existingContainer = editorRef.current.querySelector('.ql-container');

      if (existingToolbar) existingToolbar.remove();
      if (existingContainer) existingContainer.remove();

      // Clear the div completely
      editorRef.current.innerHTML = '';

      // Create a new div for Quill
      const editorDiv = document.createElement('div');
      editorRef.current.appendChild(editorDiv);

      // Initialize Quill on the new div
      quill = new Quill.default(editorDiv, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ],
        },
      });

      quillRef.current = quill;

      // Set initial value
      if (value) {
        quill.root.innerHTML = value;
      }

      // Listen for changes
      quill.on('text-change', () => {
        if (!isUpdatingRef.current) {
          onChange(quill.root.innerHTML);
        }
      });

      // Custom image handler
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append('image', file);

          try {
            const response = await fetch('/api/admin/blog/upload-image', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
              throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();

            if (data.url) {
              const range = quill.getSelection(true);
              if (range) {
                quill.insertEmbed(range.index, 'image', data.url);
                quill.setSelection(range.index + 1);
              } else {
                const length = quill.getLength();
                quill.insertEmbed(length - 1, 'image', data.url);
                quill.setSelection(length);
              }
            } else {
              console.error('URL missing');
              alert('Resim eklenirken bir hata oluştu');
            }
          } catch (error: any) {
            console.error('Upload error:', error);
            alert(error.message || 'Resim yüklenirken bir hata oluştu');
          }
        };
      });
    };

    // Import Quill CSS and initialize
    Promise.all([
      import('quill/dist/quill.snow.css'),
      initQuill()
    ]);

    return () => {
      // Properly cleanup Quill instance
      if (quill) {
        quill.off('text-change');
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      // Clear the editor div content completely
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update editor when value changes externally
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdatingRef.current = true;
      quillRef.current.root.innerHTML = value;
      isUpdatingRef.current = false;
    }
  }, [value]);

  return (
    <div className="rich-text-editor">
      <div ref={editorRef} />
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          background: #1a1b1e !important;
          border: 1px solid #2b313c !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }
        
        .rich-text-editor .ql-container {
          background: #1a1b1e !important;
          border: 1px solid #2b313c !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
          min-height: 400px;
          font-size: 16px;
        }
        
        .rich-text-editor .ql-editor {
          color: #e2e8f0;
          min-height: 400px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: #94a3b8;
        }
        
        .rich-text-editor .ql-fill {
          fill: #94a3b8;
        }
        
        .rich-text-editor .ql-picker-label {
          color: #94a3b8;
        }
        
        .rich-text-editor .ql-picker-options {
          background: #1e293b;
          border: 1px solid #2b313c;
        }
        
        .rich-text-editor .ql-picker-item {
          color: #94a3b8;
        }
        
        .rich-text-editor .ql-picker-item:hover {
          color: #e2e8f0;
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
      `}</style>
    </div>
  );
}

export default memo(RichTextEditor);
