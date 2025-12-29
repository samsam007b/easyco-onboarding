/**
 * Unified Messaging Service
 *
 * Provides a Facebook Messenger-like messaging experience across all user roles.
 * Features:
 * - Unified conversation list with role indicators
 * - Pinned conversations (Ma Résidence, Mon Propriétaire)
 * - Visual distinction for external contacts
 * - Invitation CTAs when owner/residents are missing
 */

import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = 'searcher' | 'owner' | 'resident' | 'admin';

export type ConversationType =
  | 'residence_group'      // Ma résidence - group chat
  | 'residence_owner'      // Résidence ↔ Propriétaire
  | 'private_residents'    // Private between residents
  | 'private_resident_owner' // Private resident ↔ owner
  | 'candidate_inquiry'    // Searcher ↔ residents/owner
  | 'property_inquiry'     // Searcher ↔ owner about property
  | 'direct';              // General direct message

export interface RoleVisual {
  role: UserRole;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  bgColor: string; // Background color class
  label: string; // French label
}

export const ROLE_VISUALS: Record<UserRole, RoleVisual> = {
  searcher: {
    role: 'searcher',
    icon: 'Search',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Candidat',
  },
  owner: {
    role: 'owner',
    icon: 'Key',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Propriétaire',
  },
  resident: {
    role: 'resident',
    icon: 'Home',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Résident',
  },
  admin: {
    role: 'admin',
    icon: 'Shield',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Admin',
  },
};

export interface UnifiedConversation {
  id: string;
  type: ConversationType;

  // Display info
  name: string;
  photo?: string;
  subject?: string;

  // Role & visual indicators
  otherUserRole?: UserRole;
  isOfficial: boolean;
  isPinned: boolean;
  isExternal: boolean; // True if participant is not from same residence

  // Message info
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSenderId?: string;
  lastMessageSenderName?: string;
  unreadCount: number;

  // Participants (for group chats)
  participantCount?: number;
  participants?: {
    id: string;
    name: string;
    photo?: string;
    role: UserRole;
  }[];

  // Property context
  propertyId?: string;
  propertyName?: string;

  // Status
  isVirtual?: boolean; // True if conversation doesn't exist yet
  needsInvitation?: boolean; // True if owner/residents need to be invited
  invitationType?: 'owner' | 'resident';

  // Metadata
  metadata?: Record<string, any>;
}

export interface UnifiedMessagingState {
  // Pinned conversations (always visible)
  pinnedConversations: UnifiedConversation[];

  // Regular conversations
  conversations: UnifiedConversation[];

  // User's residence info
  userResidence?: {
    propertyId: string;
    propertyName: string;
    hasOwner: boolean;
    hasOtherResidents: boolean;
    residentCount: number;
  };

  // Missing invitations banner
  missingInvitations: {
    needsOwner: boolean;
    needsResidents: boolean;
  };
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Get user role from user data
 */
export function getUserRole(userType: string | undefined): UserRole {
  switch (userType) {
    case 'searcher':
      return 'searcher';
    case 'owner':
      return 'owner';
    case 'resident':
      return 'resident';
    case 'admin':
      return 'admin';
    default:
      return 'searcher';
  }
}

/**
 * Get user's residence information
 */
export async function getUserResidenceInfo(userId: string): Promise<{
  propertyId: string | null;
  propertyName: string | null;
  ownerId: string | null;
  ownerName: string | null;
  residents: { id: string; name: string; photo?: string }[];
} | null> {
  try {
    const supabase = createClient();

    // Get user's active property membership
    const { data: membership, error: memberError } = await supabase
      .from('property_members')
      .select(`
        property_id,
        properties (
          id,
          title,
          owner_id,
          users:owner_id (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (memberError || !membership) {
      return null;
    }

    const property = (membership as any).properties;
    if (!property) return null;

    // Get other residents
    const { data: otherMembers } = await supabase
      .from('property_members')
      .select(`
        user_id,
        users:user_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('property_id', membership.property_id)
      .eq('status', 'active')
      .neq('user_id', userId);

    const residents = (otherMembers || []).map((m: any) => ({
      id: m.users?.id,
      name: m.users?.full_name || 'Résident',
      photo: m.users?.avatar_url,
    })).filter((r: any) => r.id);

    const owner = property.users;

    return {
      propertyId: property.id,
      propertyName: property.title || 'Ma Résidence',
      ownerId: property.owner_id,
      ownerName: owner?.full_name || null,
      residents,
    };
  } catch (error) {
    logger.error('Error getting user residence info', error);
    return null;
  }
}

/**
 * Get unified conversations for a user
 */
export async function getUnifiedConversations(
  userId: string,
  userRole: UserRole
): Promise<{ success: boolean; data?: UnifiedMessagingState; error?: string }> {
  try {
    const supabase = createClient();

    // Get user's residence info (for residents)
    const residenceInfo = userRole === 'resident'
      ? await getUserResidenceInfo(userId)
      : null;

    // Get all conversations where user is a participant
    const { data: participations, error: partError } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        last_read_at,
        conversations (
          id,
          conversation_type,
          is_official,
          subject,
          property_id,
          last_message_at,
          metadata,
          properties (
            id,
            title,
            owner_id
          )
        )
      `)
      .eq('user_id', userId);

    if (partError) throw partError;

    const conversationIds = (participations || []).map(p => p.conversation_id);

    // Build unified conversations
    const pinnedConversations: UnifiedConversation[] = [];
    const regularConversations: UnifiedConversation[] = [];

    for (const part of participations || []) {
      const conv = (part as any).conversations;
      if (!conv) continue;

      // Get last message
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          users:sender_id (
            full_name
          )
        `)
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const lastMessage = messages?.[0];

      // Count unread
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', userId)
        .gt('created_at', part.last_read_at || '1970-01-01');

      // Get other participants for name/photo
      const { data: otherParticipants } = await supabase
        .from('conversation_participants')
        .select(`
          user_id,
          users:user_id (
            id,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .eq('conversation_id', conv.id)
        .neq('user_id', userId);

      // Determine conversation name and type
      let name = conv.subject || 'Conversation';
      let photo: string | undefined;
      let otherUserRole: UserRole | undefined;
      let isExternal = false;
      let isPinned = false;

      const convType = conv.conversation_type as ConversationType;

      // Handle different conversation types
      if (convType === 'residence_group') {
        name = 'Ma Résidence';
        isPinned = true;
      } else if (convType === 'residence_owner') {
        name = 'Mon Propriétaire';
        isPinned = true;
        otherUserRole = 'owner';
      } else if (otherParticipants && otherParticipants.length === 1) {
        // 1-to-1 conversation
        const other = (otherParticipants[0] as any).users;
        if (other) {
          name = other.full_name || 'Utilisateur';
          photo = other.avatar_url;
          otherUserRole = getUserRole(other.user_type);

          // Check if external (not from same residence)
          if (residenceInfo && userRole === 'resident') {
            const isResident = residenceInfo.residents.some(r => r.id === other.id);
            const isOwner = residenceInfo.ownerId === other.id;
            isExternal = !isResident && !isOwner;
          }
        }
      } else if (otherParticipants && otherParticipants.length > 1) {
        // Group conversation
        name = conv.subject || `Groupe (${otherParticipants.length + 1})`;
      }

      const unifiedConv: UnifiedConversation = {
        id: conv.id,
        type: convType,
        name,
        photo,
        subject: conv.subject,
        otherUserRole,
        isOfficial: conv.is_official || false,
        isPinned,
        isExternal,
        lastMessage: lastMessage?.content,
        lastMessageAt: lastMessage?.created_at || conv.last_message_at,
        lastMessageSenderId: lastMessage?.sender_id,
        lastMessageSenderName: lastMessage?.sender_id === userId
          ? 'Vous'
          : (lastMessage as any)?.users?.full_name,
        unreadCount: unreadCount || 0,
        participantCount: (otherParticipants?.length || 0) + 1,
        propertyId: conv.property_id,
        propertyName: (conv as any).properties?.title,
        metadata: conv.metadata,
      };

      if (isPinned) {
        pinnedConversations.push(unifiedConv);
      } else {
        regularConversations.push(unifiedConv);
      }
    }

    // For residents: ensure pinned conversations exist (virtual if needed)
    if (userRole === 'resident' && residenceInfo) {
      // Check for "Ma Résidence"
      const hasResidenceGroup = pinnedConversations.some(
        c => c.type === 'residence_group'
      );

      if (!hasResidenceGroup) {
        pinnedConversations.unshift({
          id: `virtual-residence-${residenceInfo.propertyId}`,
          type: 'residence_group',
          name: 'Ma Résidence',
          isOfficial: true,
          isPinned: true,
          isExternal: false,
          unreadCount: 0,
          participantCount: residenceInfo.residents.length + 1,
          propertyId: residenceInfo.propertyId ?? undefined,
          propertyName: residenceInfo.propertyName ?? undefined,
          isVirtual: true,
          needsInvitation: residenceInfo.residents.length === 0,
          invitationType: 'resident',
        });
      }

      // Check for "Mon Propriétaire"
      const hasOwnerChat = pinnedConversations.some(
        c => c.type === 'residence_owner'
      );

      if (!hasOwnerChat) {
        pinnedConversations.push({
          id: `virtual-owner-${residenceInfo.propertyId}`,
          type: 'residence_owner',
          name: 'Mon Propriétaire',
          otherUserRole: 'owner',
          isOfficial: true,
          isPinned: true,
          isExternal: false,
          unreadCount: 0,
          propertyId: residenceInfo.propertyId ?? undefined,
          propertyName: residenceInfo.propertyName ?? undefined,
          isVirtual: true,
          needsInvitation: !residenceInfo.ownerId,
          invitationType: 'owner',
        });
      }
    }

    // Sort regular conversations by last message
    regularConversations.sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

    return {
      success: true,
      data: {
        pinnedConversations,
        conversations: regularConversations,
        userResidence: residenceInfo && residenceInfo.propertyId ? {
          propertyId: residenceInfo.propertyId,
          propertyName: residenceInfo.propertyName || 'Ma Résidence',
          hasOwner: !!residenceInfo.ownerId,
          hasOtherResidents: residenceInfo.residents.length > 0,
          residentCount: residenceInfo.residents.length,
        } : undefined,
        missingInvitations: {
          needsOwner: residenceInfo ? !residenceInfo.ownerId : false,
          needsResidents: residenceInfo ? residenceInfo.residents.length === 0 : false,
        },
      },
    };
  } catch (error: any) {
    logger.error('Error getting unified conversations', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate invitation link for owner or residents
 */
export async function generateInvitationLink(
  propertyId: string,
  inviteType: 'owner' | 'resident',
  inviterName: string
): Promise<{ success: boolean; data?: { link: string; code: string }; error?: string }> {
  try {
    const supabase = createClient();

    // Generate unique invite code
    const code = `${inviteType.substring(0, 1).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

    // Store invitation in database
    const { data, error } = await supabase
      .from('property_invitations')
      .insert({
        property_id: propertyId,
        invite_type: inviteType,
        invite_code: code,
        inviter_name: inviterName,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (error) {
      // Table might not exist, generate a simple link
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://easyco.be';

      const link = `${baseUrl}/invite/${inviteType}/${propertyId}?ref=${encodeURIComponent(inviterName)}`;
      return { success: true, data: { link, code: propertyId.substring(0, 8) } };
    }

    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://easyco.be';

    const link = `${baseUrl}/invite/${code}`;

    return { success: true, data: { link, code } };
  } catch (error: any) {
    logger.error('Error generating invitation link', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create or get a private conversation with another user
 */
export async function getOrCreatePrivateConversation(
  userId: string,
  otherUserId: string,
  propertyId?: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Check for existing private conversation
    const { data: existingParticipation } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    const userConvIds = (existingParticipation || []).map(p => p.conversation_id);

    if (userConvIds.length > 0) {
      const { data: otherParticipation } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', otherUserId)
        .in('conversation_id', userConvIds);

      // Find a private conversation (not group)
      for (const p of otherParticipation || []) {
        const { data: conv } = await supabase
          .from('conversations')
          .select('id, conversation_type')
          .eq('id', p.conversation_id)
          .in('conversation_type', ['private_residents', 'private_resident_owner', 'candidate_inquiry', 'property_inquiry', 'direct'])
          .single();

        if (conv) {
          return { success: true, data: conv.id };
        }
      }
    }

    // Determine conversation type based on user roles
    const { data: users } = await supabase
      .from('users')
      .select('id, user_type')
      .in('id', [userId, otherUserId]);

    const userTypes = new Map((users || []).map(u => [u.id, u.user_type]));
    const myType = userTypes.get(userId);
    const otherType = userTypes.get(otherUserId);

    let conversationType: ConversationType = 'direct';
    if (myType === 'resident' && otherType === 'resident') {
      conversationType = 'private_residents';
    } else if ((myType === 'resident' && otherType === 'owner') ||
               (myType === 'owner' && otherType === 'resident')) {
      conversationType = 'private_resident_owner';
    } else if ((myType === 'searcher' && otherType === 'resident') ||
               (myType === 'resident' && otherType === 'searcher')) {
      conversationType = 'candidate_inquiry';
    } else if ((myType === 'searcher' && otherType === 'owner') ||
               (myType === 'owner' && otherType === 'searcher')) {
      conversationType = 'property_inquiry';
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert({
        conversation_type: conversationType,
        is_official: false,
        property_id: propertyId,
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, user_id: userId },
        { conversation_id: newConv.id, user_id: otherUserId },
      ]);

    return { success: true, data: newConv.id };
  } catch (error: any) {
    logger.error('Error creating private conversation', error);
    return { success: false, error: error.message };
  }
}
