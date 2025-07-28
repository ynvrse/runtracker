import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGoogleOAuth } from '@/features/run-tracking/hooks/useGoogleOAuth';
import { env } from '@/lib/env';

export default function Login() {
  const { nonce, isLoading, handleGoogleSuccess, handleGoogleError } = useGoogleOAuth();
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <div className="space-y-4">
          <GoogleOAuthProvider clientId={env.googleClientId}>
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Signing in...
                  </div>
                </Button>
              ) : (
                <GoogleLogin
                  nonce={nonce}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  auto_select={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              )}
            </div>
          </GoogleOAuthProvider>

          <div className="text-muted-foreground text-center text-sm">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
