import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

interface ContactMessage {
  id: number;
  sender_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'Unread' | 'Read';
}

const MessageManagementPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages.php');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Read' }),
      });
      fetchMessages(); // Refresh
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (msg.status === 'Unread') {
      markAsRead(msg.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        const response = await fetch(`/api/messages.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          fetchMessages();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: 'Status',
      accessor: (msg) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${msg.status === 'Unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {msg.status === 'Unread' ? <Mail className="w-3 h-3 mr-1" /> : <MailOpen className="w-3 h-3 mr-1" />}
          {msg.status === 'Unread' ? 'Baru' : 'Dibaca'}
        </span>
      ),
      className: 'w-24'
    },
    { 
      header: 'Pengirim', 
      accessor: (msg) => (
        <div>
          <p className={`font-medium ${msg.status === 'Unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.sender_name}</p>
          <p className="text-xs text-gray-500">{msg.email}</p>
        </div>
      )
    },
    { 
      header: 'Subjek', 
      accessor: (msg) => (
        <p className={`truncate max-w-[200px] sm:max-w-xs ${msg.status === 'Unread' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          {msg.subject}
        </p>
      )
    },
    { 
      header: 'Tanggal', 
      accessor: (msg) => new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
      className: 'text-gray-500 text-xs'
    },
    {
      header: 'Aksi',
      accessor: (msg) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleOpenMessage(msg)} 
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Baca Pesan"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(msg.id)} 
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            title="Hapus Pesan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-center'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kotak Masuk Pesan Publik</h1>
          <p className="text-gray-500 mt-1">Kelola dan baca pesan dari halaman kontak</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        searchPlaceholder="Cari pengirim, email, atau subjek pesan..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detail Pesan"
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="w-10 h-10 bg-brand-lightblue rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                     {selectedMessage.sender_name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="font-semibold text-gray-800">{selectedMessage.sender_name} <span className="font-normal text-gray-500">&lt;{selectedMessage.email}&gt;</span></p>
                     <p className="text-xs text-gray-500 mt-0.5">{new Date(selectedMessage.created_at).toLocaleString('id-ID')}</p>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-inner">
              <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={handleCloseModal} 
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Tutup
              </button>
              <a 
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} 
                className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors"
              >
                Balas via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessageManagementPage;
