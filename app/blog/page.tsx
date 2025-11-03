import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import PostsClient from './PostsClient';

export default async function PostsPage() {
  const queryClient = new QueryClient()

  // Prefetch posts on the server
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`).then((r) => r.json()),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient />
    </HydrationBoundary>
  )
}
