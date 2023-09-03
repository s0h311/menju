import {createClient} from "@supabase/supabase-js";
import {RegisterCredentials} from "@/types/credentials.type";


const supabaseClientAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE || '',
    { auth: { persistSession: false } }
)

export async function createUser(credentials: RegisterCredentials, restaurant: { id: any; name?: string; })
{
    return supabaseClientAdmin.auth.admin.createUser({
        email: credentials.email,
        password: credentials.password,
        email_confirm: true,
        user_metadata: {
            name: credentials.name,
            restaurantId: restaurant.id,
        },
    })
}
