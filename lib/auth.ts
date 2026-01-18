import { createClient } from '@/lib/supabase/server';

export interface AuthPayload {
    userId: string;
    email?: string;
    name?: string;
}

export async function getUserFromRequest(request?: any): Promise<AuthPayload | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        return {
            userId: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
        };
    } catch (e) {
        console.error("Auth error:", e);
        return null;
    }
}

// Client-side helper to get user
export async function getClientUser() {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return {
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
    };
}
