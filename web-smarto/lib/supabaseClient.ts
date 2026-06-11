import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabasePublishKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""

// Instance ini aman digunakan di Client Component ('use client')
export const supabase = createClient(supabaseUrl, supabasePublishKey)
