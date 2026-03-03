export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    // biome-ignore lint/complexity/noUselessFragments: not yet covered by the course
    <>
      <div>Loading</div>
    </>
  );
}
