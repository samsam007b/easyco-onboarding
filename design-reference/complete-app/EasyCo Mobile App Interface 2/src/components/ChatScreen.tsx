import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Plus,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  DollarSign,
  Receipt,
  Users,
  Home,
  Zap,
  Droplets,
  Wifi,
  Settings,
  Star,
  Clock
} from "lucide-react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  type?: 'text' | 'image' | 'file' | 'payment' | 'system';
  paymentData?: {
    amount: number;
    description: string;
    type: 'request' | 'paid' | 'split';
  };
  fileData?: {
    name: string;
    size: string;
    type: string;
  };
}

interface Conversation {
  id: number;
  name: string;
  type: 'individual' | 'group';
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  participants?: number;
  isImportant?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "🏠 Apartment 42 - All Roommates",
    type: 'group',
    avatar: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8Y29saXZpbmclMjBzcGFjZXxlbnwxfHx8fDE3NTU0MzQwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Sarah: The electricity bill is ready for splitting 💡",
    timestamp: "2 min",
    unreadCount: 3,
    participants: 4,
    isImportant: true
  },
  {
    id: 2,
    name: "Sarah Chen",
    type: 'individual',
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8eW91bmclMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1MDkxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Thanks for organizing the cleaning schedule! 🧹",
    timestamp: "1h",
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 3,
    name: "Alex Thompson",
    type: 'individual',
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8eW91bmclMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1MDkxODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Can I borrow your bike tomorrow?",
    timestamp: "3h",
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    type: 'individual',
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8eW91bmclMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Movie night this Friday? 🍿",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 5,
    name: "🧹 Cleaning Squad",
    type: 'group',
    avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8Y2xlYW5pbmclMjBzdXBwbGllc3xlbnwxfHx8fDE3NTg0Nzc1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Weekly cleaning schedule updated",
    timestamp: "2 days",
    unreadCount: 0,
    participants: 4
  }
];

const GROUP_CHAT_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "System",
    content: "Sarah Chen added the electricity bill (€89.20) to shared expenses",
    timestamp: "10:30 AM",
    isMe: false,
    type: 'system'
  },
  {
    id: 2,
    sender: "Sarah Chen",
    content: "Hey everyone! 💡 The electricity bill for this month is €89.20. That's €22.30 each. Can everyone pay their part?",
    timestamp: "10:32 AM",
    isMe: false,
    isRead: true
  },
  {
    id: 3,
    sender: "Alex Thompson",
    content: "Got it! Paying now through the app 💳",
    timestamp: "10:35 AM",
    isMe: false,
    isRead: true
  },
  {
    id: 4,
    sender: "System",
    content: "Alex Thompson paid €22.30 for Electricity Bill",
    timestamp: "10:36 AM",
    isMe: false,
    type: 'system'
  },
  {
    id: 5,
    sender: "You",
    content: "Perfect! I'll pay mine too",
    timestamp: "10:38 AM",
    isMe: true,
    isRead: true
  },
  {
    id: 6,
    sender: "You",
    content: "",
    timestamp: "10:38 AM",
    isMe: true,
    isRead: true,
    type: 'payment',
    paymentData: {
      amount: 22.30,
      description: "Electricity Bill - January",
      type: 'paid'
    }
  },
  {
    id: 7,
    sender: "Emma Rodriguez",
    content: "Thanks for organizing this Sarah! 🙏 I'll pay when I get home",
    timestamp: "10:42 AM",
    isMe: false,
    isRead: false
  },
  {
    id: 8,
    sender: "Sarah Chen",
    content: "No problem! Emma, you can pay directly through the expense split below 👇",
    timestamp: "10:45 AM",
    isMe: false,
    isRead: false
  }
];

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('chat');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = CONVERSATIONS.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Conversation List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-[var(--color-easyCo-gray-light)] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-easyCo-purple)] px-6 py-4 pt-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack} className="p-0 text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">Messages</h1>
                <p className="text-white/80 text-sm">Stay connected with your roommates</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border-0 rounded-2xl focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-white">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Card className="min-w-fit border-0 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Split Bills</p>
                  <p className="text-sm text-blue-700">€89.20 pending</p>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-fit border-0 rounded-2xl bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900">House Rules</p>
                  <p className="text-sm text-green-700">View & update</p>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-fit border-0 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-easyCo-purple)] rounded-2xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">Rate Roomies</p>
                  <p className="text-sm text-purple-700">Monthly review</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 bg-white px-6">
          <div className="py-4">
            <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Recent Conversations</h2>
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <Card 
                  key={conversation.id}
                  className="border-0 rounded-2xl hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openConversation(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.type === 'individual' && conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        {conversation.type === 'group' && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-easyCo-mustard)] rounded-full flex items-center justify-center">
                            <span className="text-xs text-black font-medium">{conversation.participants}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-[var(--color-easyCo-purple)] truncate">
                            {conversation.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {conversation.isImportant && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                Important
                              </Badge>
                            )}
                            <span className="text-xs text-[var(--color-easyCo-gray-dark)]">
                              {conversation.timestamp}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-[var(--color-easyCo-gray-dark)] truncate pr-2">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-[var(--color-easyCo-mustard)] text-black text-xs min-w-fit">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Individual Chat View
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 py-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('list')} 
              className="p-0 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedConversation?.avatar} alt={selectedConversation?.name} />
                  <AvatarFallback>{selectedConversation?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedConversation?.type === 'individual' && selectedConversation?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-white">{selectedConversation?.name}</h2>
                <p className="text-sm text-white/80">
                  {selectedConversation?.type === 'group' 
                    ? `${selectedConversation.participants} participants`
                    : selectedConversation?.isOnline ? 'Active now' : 'Last seen 2h ago'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Bill Split Banner */}
      {selectedConversation?.id === 1 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200 px-6 py-3">
          <Card className="border-0 rounded-2xl bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">Electricity Bill - January</p>
                    <p className="text-sm text-orange-700">€22.30 per person • 2/4 paid</p>
                  </div>
                </div>
                <Button className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay My Part
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {GROUP_CHAT_MESSAGES.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-[var(--color-easyCo-gray-light)] px-4 py-2 rounded-2xl">
                  <p className="text-xs text-[var(--color-easyCo-gray-dark)] text-center">
                    {message.content}
                  </p>
                  <p className="text-xs text-[var(--color-easyCo-gray-dark)] text-center mt-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            );
          }

          if (message.type === 'payment') {
            return (
              <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.isMe ? 'order-2' : 'order-1'}`}>
                  <Card className="border-0 rounded-2xl bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">Payment Sent</p>
                          <p className="text-sm text-green-700">€{message.paymentData?.amount}</p>
                        </div>
                      </div>
                      <p className="text-sm text-green-800">{message.paymentData?.description}</p>
                    </CardContent>
                  </Card>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">{message.timestamp}</p>
                    {message.isMe && (
                      <div className="text-[var(--color-easyCo-purple)]">
                        {message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.isMe ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.isMe
                      ? 'bg-[var(--color-easyCo-purple)] text-white rounded-br-md'
                      : 'bg-[var(--color-easyCo-gray-light)] text-black rounded-bl-md'
                  }`}
                >
                  {!message.isMe && (
                    <p className="text-xs font-medium mb-1 opacity-70">{message.sender}</p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs text-[var(--color-easyCo-gray-dark)] ${message.isMe ? 'order-2' : 'order-1'}`}>
                    {message.timestamp}
                  </p>
                  {message.isMe && (
                    <div className="text-[var(--color-easyCo-purple)] order-2 ml-2">
                      {message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              </div>
              {!message.isMe && (
                <Avatar className="w-8 h-8 order-1 mr-3 mt-auto">
                  <AvatarImage src={selectedConversation?.avatar} alt={message.sender} />
                  <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 bg-[var(--color-easyCo-gray-light)]">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button size="sm" variant="outline" className="min-w-fit rounded-2xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">
            <DollarSign className="w-4 h-4 mr-2" />
            Split Bill
          </Button>
          <Button size="sm" variant="outline" className="min-w-fit rounded-2xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">
            <Home className="w-4 h-4 mr-2" />
            House Rules
          </Button>
          <Button size="sm" variant="outline" className="min-w-fit rounded-2xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">
            <Clock className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-6">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)] p-2">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)] p-2">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)] p-2">
              <ImageIcon className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 py-3 border-2 border-[var(--color-easyCo-gray-medium)] rounded-2xl focus:border-[var(--color-easyCo-purple)] resize-none min-h-[48px]"
            />
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-purple)] p-1">
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}