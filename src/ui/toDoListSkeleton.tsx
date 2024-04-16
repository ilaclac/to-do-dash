import { lusitana } from '@/src/ui/fonts';
import { Item } from '@/src/lib/definitions';

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

const shimmerOverlayStyle =
  'relative rounded-3xl inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60';
const shimmerOverlayTextStyle = 'text-gray-800 text-xl p-10';
export function RowSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function ToDoListSkeleton({
  items,
  loading,
}: {
  items: Item[];
  loading: boolean;
}) {
  const noItems = items.length === 0;
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
      {/* Overlay Text */}
      <div
        className={` absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center`}
      >
        <p
          className={`${lusitana.className} ${shimmerOverlayTextStyle} ${shimmerOverlayStyle}`}
        >
          {loading ? 'Loading...' : noItems ? 'Start adding items' : ''}
        </p>
      </div>
    </div>
  );
}
