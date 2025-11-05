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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full border-orange-200 hover:bg-orange-50"
              >
                <ChevronLeft className="h-5 w-5 text-orange-600" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mes Groupes</h1>
                  <p className="text-gray-600 mt-1">Recherchez un logement ensemble</p>
                </div>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-2xl gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push('/groups/create')}
            >
              <Plus className="h-5 w-5" />
              Créer un groupe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* My Groups */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Mes Groupes ({myGroups.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className="rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-orange-100 hover:border-orange-300"
                onClick={() => router.push(`/groups/${group.id}/settings`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-900">{group.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex -space-x-2">
                      {group.avatars.map((avatar, idx) => (
                        <Avatar key={idx} className="border-2 border-white ring-2 ring-orange-100">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-orange-100 bg-orange-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-orange-700">
                          +{group.members - group.avatars.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      {group.location}
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      {group.budget}
                    </Badge>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl gap-2 border-orange-200 hover:bg-orange-50 text-orange-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/messages');
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat du groupe
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
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Invitations aux groupes ({invitations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((group) => (
                <Card key={group.id} className="rounded-2xl shadow-lg border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-900">{group.name}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">Invité par {group.invitedBy}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex -space-x-2 mb-3">
                        {group.avatars.map((avatar, idx) => (
                          <Avatar key={idx} className="border-2 border-white ring-2 ring-orange-100">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        {group.location}
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        {group.budget}
                      </Badge>
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl">
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl border-orange-200 hover:bg-orange-50"
                        >
                          Refuser
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
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl border-2 border-orange-100 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/40 to-orange-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30 animate-pulse">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Aucun groupe pour le moment
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                Créez ou rejoignez un groupe pour chercher un logement ensemble
              </p>
              <Button
                className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] px-8 py-6 text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all gap-2"
                onClick={() => router.push('/groups/create')}
              >
                <Plus className="h-5 w-5" />
                Créer votre premier groupe
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
