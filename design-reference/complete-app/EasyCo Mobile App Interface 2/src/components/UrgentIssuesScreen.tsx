import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { 
  Plus, 
  AlertTriangle, 
  Wrench, 
  Zap, 
  Droplets,
  Thermometer,
  Wifi,
  Clock,
  MessageCircle,
  CheckCircle,
  Camera,
  Send,
  ArrowLeft
} from "lucide-react";

const ISSUES = [
  {
    id: 1,
    title: "Kitchen Sink Leak",
    description: "Water is leaking from under the kitchen sink. Getting worse over the past 2 days.",
    category: "plumbing",
    priority: "urgent",
    status: "reported",
    reportedBy: "You",
    reportedAt: "2 hours ago",
    responses: 3,
    landlordNotified: true,
    icon: Droplets,
    avatar: ""
  },
  {
    id: 2,
    title: "Washing Machine Not Working",
    description: "Washing machine stops mid-cycle and shows error code E03. Tried turning it off and on.",
    category: "appliance",
    priority: "high",
    status: "in_progress",
    reportedBy: "Sarah M.",
    reportedAt: "1 day ago",
    responses: 5,
    landlordNotified: true,
    icon: Wrench,
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    title: "Heating Not Working",
    description: "No heating in the living room and bedrooms. Temperature is very cold.",
    category: "heating",
    priority: "urgent",
    status: "resolved",
    reportedBy: "Alex K.",
    reportedAt: "3 days ago",
    responses: 8,
    landlordNotified: true,
    icon: Thermometer,
    avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjB5b3VuZ3xlbnwxfHx8fDE3NTU0MzQwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    title: "Internet Outage",
    description: "No internet connection since this morning. Router shows red light.",
    category: "internet",
    priority: "medium",
    status: "reported",
    reportedBy: "Sarah M.",
    reportedAt: "5 hours ago",
    responses: 2,
    landlordNotified: true,
    icon: Wifi,
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const CATEGORIES = [
  { id: "all", label: "All Issues", count: ISSUES.length },
  { id: "plumbing", label: "Plumbing", count: 1 },
  { id: "appliance", label: "Appliances", count: 1 },
  { id: "heating", label: "Heating", count: 1 },
  { id: "internet", label: "Internet", count: 1 }
];

interface UrgentIssuesScreenProps {
  onBack: () => void;
}

export function UrgentIssuesScreen({ onBack }: UrgentIssuesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showReportForm, setShowReportForm] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [newIssueCategory, setNewIssueCategory] = useState("plumbing");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-[var(--color-easyCo-mustard)] text-black border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-[var(--color-easyCo-mustard)] text-black';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported':
        return 'Reported';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  const filteredIssues = selectedCategory === "all" 
    ? ISSUES 
    : ISSUES.filter(issue => issue.category === selectedCategory);

  const urgentCount = ISSUES.filter(issue => issue.priority === 'urgent' && issue.status !== 'resolved').length;

  const handleSubmitIssue = () => {
    if (newIssueTitle.trim() && newIssueDescription.trim()) {
      // In a real app, this would submit the issue
      setShowReportForm(false);
      setNewIssueTitle("");
      setNewIssueDescription("");
      setNewIssueCategory("plumbing");
    }
  };

  if (showReportForm) {
    return (
      <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
        <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReportForm(false)}
                className="text-white hover:bg-white/20 rounded-xl p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-white">Report New Issue</h1>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowReportForm(false)}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              Cancel
            </Button>
          </div>
          <p className="text-white/80 text-sm">Describe the urgent problem you're experiencing</p>
        </div>

        <div className="p-6 space-y-6">
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">Issue Title</label>
                <input
                  type="text"
                  placeholder="Brief description of the problem"
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  className="w-full p-3 border-2 border-[var(--color-easyCo-gray-medium)] rounded-xl focus:border-[var(--color-easyCo-purple)] bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">Category</label>
                <select
                  value={newIssueCategory}
                  onChange={(e) => setNewIssueCategory(e.target.value)}
                  className="w-full p-3 border-2 border-[var(--color-easyCo-gray-medium)] rounded-xl focus:border-[var(--color-easyCo-purple)] bg-white"
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="appliance">Appliances</option>
                  <option value="heating">Heating</option>
                  <option value="electrical">Electrical</option>
                  <option value="internet">Internet</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">Description</label>
                <Textarea
                  placeholder="Provide detailed information about the issue, when it started, and any steps you've already taken..."
                  value={newIssueDescription}
                  onChange={(e) => setNewIssueDescription(e.target.value)}
                  className="border-2 border-[var(--color-easyCo-gray-medium)] rounded-xl focus:border-[var(--color-easyCo-purple)] min-h-32"
                />
              </div>

              <div>
                <Button variant="outline" className="w-full border-2 border-[var(--color-easyCo-gray-medium)] rounded-xl py-6">
                  <Camera className="w-5 h-5 mr-2" />
                  Add Photos (Optional)
                </Button>
                <p className="text-xs text-[var(--color-easyCo-gray-dark)] mt-2 text-center">
                  Photos help landlords understand the issue better
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-[var(--color-easyCo-gray-light)] p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-easyCo-mustard)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[var(--color-easyCo-purple)] text-sm mb-1">Automatic Notifications</h3>
                <p className="text-xs text-[var(--color-easyCo-gray-dark)]">
                  Your landlord will be automatically notified. All roommates will see this issue on the board.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmitIssue}
            disabled={!newIssueTitle.trim() || !newIssueDescription.trim()}
            className="w-full bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black py-4 rounded-2xl"
          >
            <Send className="w-5 h-5 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Issues Board</h1>
              <p className="text-white/80 text-sm">Report and track urgent problems</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowReportForm(true)}
            className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* Urgent Alert */}
        {urgentCount > 0 && (
          <div className="bg-red-500/20 border border-red-300 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-300 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-sm">Urgent Issues Requiring Attention</h3>
                <p className="text-red-200 text-xs">
                  {urgentCount} urgent issue{urgentCount > 1 ? 's' : ''} need{urgentCount === 1 ? 's' : ''} immediate attention
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className={`flex-shrink-0 px-4 py-2 rounded-xl cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-[var(--color-easyCo-purple)] text-white'
                  : 'bg-[var(--color-easyCo-gray-light)] border border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)]'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="p-6 space-y-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="shadow-sm border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    issue.priority === 'urgent' ? 'bg-red-100' : 'bg-[var(--color-easyCo-purple)]/10'
                  }`}>
                    <issue.icon className={`w-6 h-6 ${
                      issue.priority === 'urgent' ? 'text-red-600' : 'text-[var(--color-easyCo-purple)]'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                        {issue.title}
                      </h3>
                      <div className="flex flex-col gap-2 ml-4">
                        <Badge className={`${getPriorityColor(issue.priority)} px-2 py-1 text-xs border`}>
                          {issue.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(issue.status)} px-2 py-1 text-xs`}>
                          {issue.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {getStatusText(issue.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-3 leading-relaxed">
                      {issue.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={issue.avatar} alt={issue.reportedBy} />
                            <AvatarFallback className="text-xs">
                              {issue.reportedBy === "You" ? "ME" : issue.reportedBy.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[var(--color-easyCo-gray-dark)]">
                            by {issue.reportedBy}
                          </span>
                        </div>
                        <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                          <Clock className="w-4 h-4 mr-1" />
                          {issue.reportedAt}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {issue.landlordNotified && (
                          <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Landlord notified
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)] p-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {issue.responses}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-easyCo-gray-medium)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--color-easyCo-gray-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2">No Issues Found</h3>
            <p className="text-[var(--color-easyCo-gray-dark)] text-sm">
              No issues in this category. Everything looks good!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}