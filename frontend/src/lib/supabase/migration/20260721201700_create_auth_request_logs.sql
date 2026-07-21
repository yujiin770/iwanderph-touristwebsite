-- Migration: Create auth_request_logs and anti-spam function
-- Created at: 2026-07-21

-- 1. Create the log table
CREATE TABLE IF NOT EXISTS public.auth_request_logs (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email varchar NOT NULL,
    request_type varchar NOT NULL, -- 'invite' or 'reset'
    created_at timestamptz DEFAULT now(),
    ip_address text 
);

-- 2. Add indexes for performance (Crucial for the lookup function)
CREATE INDEX IF NOT EXISTS idx_auth_logs_email_type ON public.auth_request_logs (email, request_type);

-- 3. Enable RLS
ALTER TABLE public.auth_request_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view auth logs') THEN
        CREATE POLICY "Admins can view auth logs" 
        ON public.auth_request_logs FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert invite logs') THEN
        CREATE POLICY "Admins can insert invite logs" 
        ON public.auth_request_logs FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;
END $$;

-- 5. Anti-Spam / Rate Limiting Function
-- Returns TRUE if allowed (and logs it), FALSE if on cooldown
CREATE OR REPLACE FUNCTION check_auth_cooldown(target_email TEXT, req_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    last_request_time TIMESTAMPTZ;
BEGIN
    -- Get the timestamp of the last request for this email and type
    SELECT created_at INTO last_request_time
    FROM public.auth_request_logs
    WHERE email = target_email AND request_type = req_type
    ORDER BY created_at DESC
    LIMIT 1;

    -- Cooldown logic: Allow if never requested OR last request was > 5 minutes ago
    IF last_request_time IS NULL OR last_request_time < (now() - INTERVAL '5 minutes') THEN
        INSERT INTO public.auth_request_logs (email, request_type)
        VALUES (target_email, req_type);
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function to authenticated users (admins)
GRANT EXECUTE ON FUNCTION check_auth_cooldown(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_auth_cooldown(TEXT, TEXT) TO anon;