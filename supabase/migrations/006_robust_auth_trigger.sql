-- Improved handle_new_user trigger to capture metadata and handle errors gracefully
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_credits INTEGER := 6;
BEGIN
    -- Insert into profiles with metadata
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

    -- Insert into credits
    INSERT INTO public.credits (user_id, balance)
    VALUES (NEW.id, default_credits)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error details if possible (Postgres logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW; -- Still return NEW to allow auth user creation even if profile fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
