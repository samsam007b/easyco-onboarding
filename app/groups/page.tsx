'use client';

import { useRouter } from 'next/navigation';
import { Users, Plus, ChevronLeft, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GroupsPage() {
  const router = useRouter();

  // Mock groups data
  const myGroups = [
    {
      id: '1',
      name: 'Brussels Co-living Seekers',
      members: 4,
      budget: '€600-800',
      location: 'Brussels',
      avatars: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
      ],
    },
  ];

  const invitations = [
    {
      id: '2',
      name: 'Ixelles House Hunters',
      members: 3,
      budget: '€700-900',
      location: 'Ixelles',
      invitedBy: 'Sophie M.',
      avatars: [
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                <p className="text-gray-600 mt-1">Search for housing together</p>
              </div>
            </div>
            <Button
              className="bg-purple-700 hover:bg-purple-800 rounded-2xl gap-2"
              onClick={() => router.push('/groups/create')}
            >
              <Plus className="h-5 w-5" />
              Create Group
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* My Groups */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Groups ({myGroups.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/groups/${group.id}/settings`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-700" />
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex -space-x-2">
                      {group.avatars.map((avatar, idx) => (
                        <Avatar key={idx} className="border-2 border-white">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-700">
                          +{group.members - group.avatars.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {group.location}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">
                      {group.budget}
                    </Badge>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/messages');
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Group Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Group Invitations */}
        {invitations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Group Invitations ({invitations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((group) => (
                <Card key={group.id} className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-700" />
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Invited by {group.invitedBy}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex -space-x-2 mb-3">
                        {group.avatars.map((avatar, idx) => (
                          <Avatar key={idx} className="border-2 border-white">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {group.location}
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {group.budget}
                      </Badge>
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl">
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myGroups.length === 0 && invitations.length === 0 && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
              <p className="text-gray-600 mb-6">
                Create or join a group to search for housing together
              </p>
              <Button
                className="bg-purple-700 hover:bg-purple-800 rounded-2xl gap-2"
                onClick={() => router.push('/groups/create')}
              >
                <Plus className="h-5 w-5" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
