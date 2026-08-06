import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

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
    if (msg.status === 'Unread') {
      markAsRead(msg.id);
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kotak Masuk Pesan Publik</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Messages List */}
        <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg overflow-hidden h-[600px] flex flex-col border border-gray-200">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
             <h2 className="font-semibold text-gray-700">Daftar Pesan</h2>
             <span className="bg-brand-blue text-white text-xs px-2 py-1 rounded-full">
               {messages.filter(m => m.status === 'Unread').length} Baru
             </span>
          </div>
          <div className="overflow-y-auto flex-1">
            {messages.length === 0 ? (
              <p className="p-4 text-gray-500 text-center text-sm">Belum ada pesan masuk.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {messages.map((msg) => (
                  <li 
                    key={msg.id} 
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-100' : ''} ${msg.status === 'Unread' ? 'bg-white border-l-4 border-l-brand-blue' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate pr-2 ${msg.status === 'Unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {msg.sender_name}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${msg.status === 'Unread' ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{msg.subject}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{msg.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg overflow-hidden h-[600px] flex flex-col border border-gray-200">
           {selectedMessage ? (
             <div className="flex flex-col h-full">
               <div className="p-6 border-b">
                 <div className="flex justify-between items-start mb-4">
                   <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                   <div className="flex space-x-2">
                     <a href={`mailto:${selectedMessage.email}`} className="text-sm bg-brand-blue text-white px-3 py-1.5 rounded hover:bg-brand-lightblue transition-colors">
                       Balas via Email
                     </a>
                   </div>
                 </div>
                 <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                   <div className="w-10 h-10 bg-brand-lightblue rounded-full flex items-center justify-center text-white font-bold mr-3">
                     {selectedMessage.sender_name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="font-semibold text-gray-800">{selectedMessage.sender_name} <span className="font-normal text-gray-500">&lt;{selectedMessage.email}&gt;</span></p>
                     <p className="text-xs text-gray-500">{new Date(selectedMessage.created_at).toLocaleString('id-ID')}</p>
                   </div>
                 </div>
               </div>
               <div className="p-6 overflow-y-auto flex-1 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                 {selectedMessage.message}
               </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
               <MailOpen className="h-16 w-16 mb-4 text-gray-300" />
               <p className="text-lg font-medium text-gray-500">Pilih pesan untuk dibaca</p>
               <p className="text-sm">Klik salah satu pesan di panel sebelah kiri untuk melihat isi pesan secara detail.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MessageManagementPage;
