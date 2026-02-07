import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

// Simulated users and messages for demo
const simulatedUsers = ['AstroWatcher', 'NeoHunter', 'SpaceObserver', 'CometChaser', 'OrbitalEye'];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    user: 'AstroWatcher',
    message: 'Anyone tracking 458723? The trajectory looks interesting.',
    timestamp: new Date(Date.now() - 3600000),
    isCurrentUser: false,
  },
  {
    id: '2',
    user: 'NeoHunter',
    message: 'Yes! Added it to my watchlist. The velocity is quite high for its size.',
    timestamp: new Date(Date.now() - 3000000),
    isCurrentUser: false,
  },
  {
    id: '3',
    user: 'SpaceObserver',
    message: 'The approach on July 22nd will be the closest this year. Make sure to watch the 3D view!',
    timestamp: new Date(Date.now() - 1800000),
    isCurrentUser: false,
  },
];

const autoResponses = [
  'Interesting observation! I\'ll add that to my notes.',
  'Good point. The orbital mechanics support that theory.',
  'Has anyone checked the latest NASA updates on this?',
  'I\'ve been tracking this one for weeks now.',
  'The miss distance seems safe, but worth monitoring.',
  'Check out the impact simulation - quite dramatic!',
  'Added to watchlist. Thanks for the heads up!',
  'The hazardous classification is accurate based on current data.',
];

interface CommunityChatProps {
  asteroidContext?: string;
}

export const CommunityChat = ({ asteroidContext }: CommunityChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate response after a delay
    setTimeout(() => {
      const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: randomUser,
        message: randomResponse,
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="panel-glass rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/25">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron text-sm font-bold tracking-widest text-white">COMMUNITY CHAT</span>
          <span className="ml-auto text-xs text-gray-400 font-mono">
            {simulatedUsers.length} online
          </span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        {asteroidContext && (
          <p className="text-xs text-cyan-400 font-mono mt-1">
            Discussing: {asteroidContext}
          </p>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.isCurrentUser ? 'bg-cyan-500/20' : 'bg-white/10'
              }`}>
                <User className={`w-4 h-4 ${msg.isCurrentUser ? 'text-cyan-400' : 'text-gray-400'}`} />
              </div>
              <div className={`max-w-[75%] ${msg.isCurrentUser ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono ${msg.isCurrentUser ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {msg.user}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className={`px-3 py-2 rounded-sm text-sm font-sans ${
                  msg.isCurrentUser
                    ? 'bg-cyan-500/20 text-white'
                    : 'bg-black/25 text-white border border-white/10'
                }`}>
                  {msg.message}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/25">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black/40 border-white/10 text-white font-mono text-sm placeholder:text-gray-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim()}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
