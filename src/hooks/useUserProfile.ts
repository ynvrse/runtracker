import { db } from '@/lib/instantDB';

export const useUserProfile = () => {
  const { user, isLoading: authLoading, error } = db.useAuth();

  const { data, isLoading: queryLoading } = db.useQuery(
    user
      ? {
          profiles: {
            $: {
              where: {
                userId: user.id,
              },
            },
          },
        }
      : null,
  );

  const profile = data?.profiles?.[0] ?? null;

  return {
    user,
    profile,
    isLoading: authLoading || queryLoading,
    error,
  };
};
